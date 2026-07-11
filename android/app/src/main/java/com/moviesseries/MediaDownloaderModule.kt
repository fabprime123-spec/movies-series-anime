package com.moviesseries

import android.os.Environment
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class MediaDownloaderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MediaDownloader"
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    private fun sendProgress(message: String, current: Int, total: Int) {
        val map = Arguments.createMap()
        map.putString("message", message)
        map.putInt("current", current)
        map.putInt("total", total)
        sendEvent("onDownloadProgress", map)
    }

    @ReactMethod
    fun downloadAndZipMedia(folderName: String, metadataMap: ReadableMap, imagesArray: ReadableArray, promise: Promise) {
        Thread {
            try {
                // 1. Setup temporary directory
                val tempDir = File(reactApplicationContext.cacheDir, "zip_prep_$folderName")
                if (tempDir.exists()) tempDir.deleteRecursively()
                
                val baseDir = File(tempDir, folderName)
                baseDir.mkdirs()

                val metaDir = File(baseDir, "metadata")
                metaDir.mkdirs()
                
                val relatedDir = File(baseDir, "related")
                relatedDir.mkdirs()

                val imagesDir = File(baseDir, "images")
                imagesDir.mkdirs()

                // 2. Write metadata files
                sendProgress("Preparing metadata...", 0, 100)
                val iterator = metadataMap.keySetIterator()
                while (iterator.hasNextKey()) {
                    val key = iterator.nextKey() // e.g. "metadata/Details.md"
                    val content = metadataMap.getString(key)
                    if (content != null) {
                        val file = File(baseDir, key)
                        file.writeText(content)
                    }
                }

                // 3. Download images
                val totalImages = imagesArray.size()
                for (i in 0 until totalImages) {
                    val imgMap = imagesArray.getMap(i)
                    val urlString = imgMap?.getString("url")
                    val pathString = imgMap?.getString("path") // e.g. "images/Primary_Poster.jpg"
                    
                    if (urlString != null && pathString != null) {
                        try {
                            val url = URL(urlString)
                            val connection = url.openConnection() as HttpURLConnection
                            connection.requestMethod = "GET"
                            connection.connectTimeout = 30000
                            connection.readTimeout = 30000
                            connection.connect()

                            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                                val file = File(baseDir, pathString)
                                connection.inputStream.use { input ->
                                    FileOutputStream(file).use { output ->
                                        input.copyTo(output)
                                    }
                                }
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                            // Continue downloading other images even if one fails
                        }
                    }
                    sendProgress("Downloading images...", i + 1, totalImages)
                }

                // 4. Zip the folder
                sendProgress("Creating ZIP file...", 100, 100)
                
                // Save directly to Downloads folder
                val downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                val finalZipFile = File(downloadsDir, "$folderName.zip")
                
                if (finalZipFile.exists()) finalZipFile.delete()

                FileOutputStream(finalZipFile).use { fos ->
                    ZipOutputStream(BufferedOutputStream(fos)).use { zos ->
                        zipDirectory(baseDir, baseDir.name, zos)
                    }
                }

                // 5. Cleanup
                tempDir.deleteRecursively()

                promise.resolve(finalZipFile.absolutePath)

            } catch (e: Exception) {
                e.printStackTrace()
                promise.reject("ZIP_ERROR", e.message, e)
            }
        }.start()
    }

    private fun zipDirectory(dir: File, baseName: String, zos: ZipOutputStream) {
        val files = dir.listFiles()
        if (files != null) {
            for (file in files) {
                if (file.isDirectory) {
                    zipDirectory(file, "$baseName/${file.name}", zos)
                } else {
                    FileInputStream(file).use { fis ->
                        val entry = ZipEntry("$baseName/${file.name}")
                        zos.putNextEntry(entry)
                        fis.copyTo(zos)
                        zos.closeEntry()
                    }
                }
            }
        }
    }
}

package com.moviesseries

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.common.MapBuilder

class NativeMediaListManager : SimpleViewManager<NativeMediaListView>() {

    override fun getName() = "NativeMediaList"

    override fun createViewInstance(reactContext: ThemedReactContext): NativeMediaListView {
        return NativeMediaListView(reactContext)
    }

    @ReactProp(name = "data")
    fun setData(view: NativeMediaListView, data: ReadableArray?) {
        if (data == null) return
        val items = mutableListOf<TMDBMedia>()
        for (i in 0 until data.size()) {
            val map = data.getMap(i) ?: continue
            val id = if (map.hasKey("id")) map.getInt("id") else 0
            
            // Handle both title and name (for tv shows)
            val title = if (map.hasKey("title") && map.getString("title") != null) {
                map.getString("title")!!
            } else if (map.hasKey("name") && map.getString("name") != null) {
                map.getString("name")!!
            } else ""

            val posterPath = if (map.hasKey("poster_path") && map.getString("poster_path") != null) {
                map.getString("poster_path")!!
            } else ""

            val backdropPath = if (map.hasKey("backdrop_path") && map.getString("backdrop_path") != null) {
                map.getString("backdrop_path")!!
            } else ""

            val voteAverage = if (map.hasKey("vote_average")) map.getDouble("vote_average") else 0.0
            
            val mediaType = if (map.hasKey("media_type") && map.getString("media_type") != null) {
                map.getString("media_type")!!
            } else if (map.hasKey("title")) {
                "movie"
            } else {
                "tv"
            }

            items.add(TMDBMedia(id, title, posterPath, backdropPath, voteAverage, mediaType))
        }
        view.setData(items)
    }

    @ReactProp(name = "isGrid", defaultBoolean = false)
    fun setIsGrid(view: NativeMediaListView, isGrid: Boolean) {
        view.setIsGrid(isGrid)
    }

    @ReactProp(name = "isHorizontalCard", defaultBoolean = false)
    fun setIsHorizontalCard(view: NativeMediaListView, isHorizontalCard: Boolean) {
        view.setIsHorizontalCard(isHorizontalCard)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? {
        return MapBuilder.of(
            "onItemPress", 
            MapBuilder.of("registrationName", "onItemPress")
        )
    }
}

package com.moviesseries

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class NativeGridMediaListManager : SimpleViewManager<NativeGridMediaListView>() {
    override fun getName() = "NativeGridMediaList"

    override fun createViewInstance(reactContext: ThemedReactContext): NativeGridMediaListView {
        return NativeGridMediaListView(reactContext)
    }

    @ReactProp(name = "data")
    fun setData(view: NativeGridMediaListView, data: ReadableArray?) {
        if (data == null) return
        val items = mutableListOf<TMDBMedia>()
        for (i in 0 until data.size()) {
            val map = data.getMap(i) ?: continue
            items.add(
                TMDBMedia(
                    id = if (map.hasKey("id")) map.getInt("id") else 0,
                    title = if (map.hasKey("title")) map.getString("title") ?: "" else if (map.hasKey("name")) map.getString("name") ?: "" else "",
                    posterPath = if (map.hasKey("poster_path")) map.getString("poster_path") ?: "" else "",
                    backdropPath = if (map.hasKey("backdrop_path")) map.getString("backdrop_path") ?: "" else "",
                    voteAverage = if (map.hasKey("vote_average")) map.getDouble("vote_average") else 0.0,
                    mediaType = if (map.hasKey("media_type")) map.getString("media_type") ?: "" else ""
                )
            )
        }
        view.setData(items)
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return MapBuilder.of(
            "onItemPress",
            MapBuilder.of("registrationName", "onItemPress")
        )
    }
}

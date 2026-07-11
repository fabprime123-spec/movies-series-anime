package com.moviesseries

import android.content.Context
import android.widget.FrameLayout
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class NativeMediaListView(context: Context) : FrameLayout(context) {

    private val recyclerView = RecyclerView(context)
    private var adapter: MediaListAdapter? = null
    
    private var isGrid: Boolean = false
    private var isHorizontalCard: Boolean = false

    init {
        val layoutParams = LayoutParams(
            LayoutParams.MATCH_PARENT,
            LayoutParams.MATCH_PARENT
        )
        recyclerView.layoutParams = layoutParams
        addView(recyclerView)
        setupRecyclerView()
    }

    private fun setupRecyclerView() {
        val layoutManager = if (isGrid) {
            GridLayoutManager(context, 3)
        } else {
            LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        }
        recyclerView.layoutManager = layoutManager

        val density = context.resources.displayMetrics.density
        val paddingHorizontal = if (isGrid) (10 * density).toInt() else (16 * density).toInt()
        val paddingTop = if (isGrid) (16 * density).toInt() else 0
        val paddingBottom = if (isGrid) (90 * density).toInt() else 0
        recyclerView.setPadding(paddingHorizontal, paddingTop, paddingHorizontal, paddingBottom)
        recyclerView.clipToPadding = false

        adapter = MediaListAdapter(isHorizontalCard, isGrid) { item ->
            val event = Arguments.createMap().apply {
                putInt("id", item.id)
                putString("mediaType", item.mediaType)
            }
            val reactContext = context as ReactContext
            reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
                id,
                "onItemPress",
                event
            )
        }
        recyclerView.adapter = adapter
    }

    fun setIsGrid(grid: Boolean) {
        if (isGrid != grid) {
            isGrid = grid
            setupRecyclerView()
        }
    }

    fun setIsHorizontalCard(horizontal: Boolean) {
        if (isHorizontalCard != horizontal) {
            isHorizontalCard = horizontal
            setupRecyclerView()
        }
    }

    fun setData(items: List<TMDBMedia>) {
        adapter?.submitList(items)
    }
}

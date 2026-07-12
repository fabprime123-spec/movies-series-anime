package com.moviesseries

import android.content.Context
import android.graphics.Rect
import android.view.View
import android.widget.FrameLayout
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class GridSpacingItemDecoration(private val spanCount: Int, private val spacing: Int, private val includeEdge: Boolean) : RecyclerView.ItemDecoration() {
    override fun getItemOffsets(outRect: Rect, view: View, parent: RecyclerView, state: RecyclerView.State) {
        val position = parent.getChildAdapterPosition(view)
        val column = position % spanCount

        if (includeEdge) {
            outRect.left = spacing - column * spacing / spanCount
            outRect.right = (column + 1) * spacing / spanCount
            if (position < spanCount) {
                outRect.top = spacing
            }
            outRect.bottom = spacing
        } else {
            outRect.left = column * spacing / spanCount
            outRect.right = spacing - (column + 1) * spacing / spanCount
            if (position >= spanCount) {
                outRect.top = spacing
            }
        }
    }
}

class NativeGridMediaListView(context: Context) : FrameLayout(context) {

    private val recyclerView = RecyclerView(context)
    private var adapter: GridMediaListAdapter? = null
    
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
        val layoutManager = GridLayoutManager(context, 3)
        recyclerView.layoutManager = layoutManager

        val density = context.resources.displayMetrics.density
        // React Native LibraryScreen uses 16dp horizontal padding. We will apply it here.
        val paddingHorizontal = (16 * density).toInt()
        val paddingTop = (20 * density).toInt()
        val paddingBottom = (90 * density).toInt()
        val spacing = (8 * density).toInt() // Gap between cards

        recyclerView.setPadding(paddingHorizontal, paddingTop, paddingHorizontal, paddingBottom)
        recyclerView.clipToPadding = false
        recyclerView.addItemDecoration(GridSpacingItemDecoration(3, spacing, false))

        adapter = GridMediaListAdapter { item ->
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

    fun setData(items: List<TMDBMedia>) {
        adapter?.submitList(items)
    }
}

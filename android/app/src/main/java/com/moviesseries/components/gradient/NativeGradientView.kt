package com.moviesseries.components.gradient

import android.content.Context
import android.graphics.drawable.GradientDrawable
import android.view.View
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.ReactPointerEventsView
import com.facebook.react.uimanager.PointerEvents

class NativeGradientView(context: Context) : View(context), ReactPointerEventsView {

    private var mColors: IntArray = intArrayOf(0x00000000, 0x00000000)
    private var mStartPoint: FloatArray = floatArrayOf(0f, 0f)
    private var mEndPoint: FloatArray = floatArrayOf(0f, 1f)

    init {
        updateGradient()
    }

    fun setColors(colors: ReadableArray?) {
        if (colors != null && colors.size() >= 2) {
            mColors = IntArray(colors.size())
            for (i in 0 until colors.size()) {
                mColors[i] = colors.getInt(i)
            }

            // Fix transparent black interpolation bug natively
            for (i in mColors.indices) {
                if (mColors[i] == 0x00000000) {
                    val adjacentColor = findAdjacentNonTransparentColor(mColors, i)
                    if (adjacentColor != null) {
                        // Keep RGB of adjacent color, but set alpha to 00
                        mColors[i] = adjacentColor and 0x00FFFFFF
                    }
                }
            }
            updateGradient()
        }
    }

    private fun findAdjacentNonTransparentColor(colors: IntArray, index: Int): Int? {
        // Search forwards
        for (i in index + 1 until colors.size) {
            if (colors[i] != 0x00000000) return colors[i]
        }
        // Search backwards
        for (i in index - 1 downTo 0) {
            if (colors[i] != 0x00000000) return colors[i]
        }
        return null
    }

    fun setStartPoint(startPoint: ReadableMap?) {
        if (startPoint != null) {
            if (startPoint.hasKey("x")) mStartPoint[0] = startPoint.getDouble("x").toFloat()
            if (startPoint.hasKey("y")) mStartPoint[1] = startPoint.getDouble("y").toFloat()
            updateGradient()
        }
    }

    fun setEndPoint(endPoint: ReadableMap?) {
        if (endPoint != null) {
            if (endPoint.hasKey("x")) mEndPoint[0] = endPoint.getDouble("x").toFloat()
            if (endPoint.hasKey("y")) mEndPoint[1] = endPoint.getDouble("y").toFloat()
            updateGradient()
        }
    }

    private fun getOrientation(): GradientDrawable.Orientation {
        val dx = mEndPoint[0] - mStartPoint[0]
        val dy = mEndPoint[1] - mStartPoint[1]

        if (dx > 0 && dy == 0f) return GradientDrawable.Orientation.LEFT_RIGHT
        if (dx < 0 && dy == 0f) return GradientDrawable.Orientation.RIGHT_LEFT
        if (dx == 0f && dy > 0f) return GradientDrawable.Orientation.TOP_BOTTOM
        if (dx == 0f && dy < 0f) return GradientDrawable.Orientation.BOTTOM_TOP
        
        if (dx > 0 && dy > 0) return GradientDrawable.Orientation.TL_BR
        if (dx < 0 && dy > 0) return GradientDrawable.Orientation.TR_BL
        if (dx > 0 && dy < 0) return GradientDrawable.Orientation.BL_TR
        if (dx < 0 && dy < 0) return GradientDrawable.Orientation.BR_TL
        
        return GradientDrawable.Orientation.TOP_BOTTOM
    }

    private fun updateGradient() {
        if (mColors.size >= 2) {
            val drawable = GradientDrawable(getOrientation(), mColors)
            background = drawable
        }
    }

    override val pointerEvents: PointerEvents
        get() = PointerEvents.NONE
}

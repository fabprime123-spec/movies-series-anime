package com.moviesseries.components.gradient

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class NativeGradientManager : SimpleViewManager<NativeGradientView>() {
    override fun getName(): String {
        return "NativeGradient"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): NativeGradientView {
        return NativeGradientView(reactContext)
    }

    @ReactProp(name = "colors")
    fun setColors(view: NativeGradientView, colors: ReadableArray?) {
        view.setColors(colors)
    }

    @ReactProp(name = "startPoint")
    fun setStartPoint(view: NativeGradientView, startPoint: ReadableMap?) {
        view.setStartPoint(startPoint)
    }

    @ReactProp(name = "endPoint")
    fun setEndPoint(view: NativeGradientView, endPoint: ReadableMap?) {
        view.setEndPoint(endPoint)
    }
}

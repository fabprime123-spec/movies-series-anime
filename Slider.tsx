import { useEffect, useRef, useState } from "react"
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from "react-native"

export interface SliderProps {
  defaultValue?: number
  value?: number
  onValueChange?: (val: number) => void
  onSlidingComplete?: (val: number) => void
  min?: number
  max?: number
  step?: number
  isDisabled?: boolean
  isReversed?: boolean
  trackHeight?: number
  thumbSize?: number
  activeColor?: string
  inactiveColor?: string
  thumbColor?: string
  thumbBorderColor?: string
  scaleOnSliding?: boolean
}

export function Slider({
  defaultValue = 0,
  value: controlledValue,
  onValueChange,
  onSlidingComplete,
  min = 0,
  max = 100,
  step,
  isDisabled = false,
  isReversed = false,
  trackHeight = 8,
  thumbSize = 24,
  activeColor = "#3b82f6",
  inactiveColor = "#e2e8f0",
  thumbColor = "#ffffff",
  thumbBorderColor = "#3b82f6",
  scaleOnSliding = true,
}: SliderProps) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : localValue

  // Layout width
  const [trackWidth, setTrackWidth] = useState(0)

  // Animated scale for thumb press/drag animation
  const thumbScale = useRef(new Animated.Value(1)).current

  // Store variables in ref for PanResponder callbacks
  const stateRef = useRef({
    currentValue,
    min,
    max,
    step,
    trackWidth,
    isReversed,
    isDisabled,
    onValueChange,
    onSlidingComplete,
    thumbSize,
  })

  useEffect(() => {
    stateRef.current = {
      currentValue,
      min,
      max,
      step,
      trackWidth,
      isReversed,
      isDisabled,
      onValueChange,
      onSlidingComplete,
      thumbSize,
    }
  }, [
    currentValue,
    min,
    max,
    step,
    trackWidth,
    isReversed,
    isDisabled,
    onValueChange,
    onSlidingComplete,
    thumbSize,
  ])

  const getValueFromLocation = (locationX: number) => {
    const { min, max, trackWidth, isReversed, step } = stateRef.current
    const width = trackWidth || 1

    const clampedX = Math.max(0, Math.min(locationX, width))
    let percentage = clampedX / width
    if (isReversed) {
      percentage = 1 - percentage
    }

    let newValue = min + percentage * (max - min)
    if (step && step > 0) {
      newValue = Math.round(newValue / step) * step
    }

    return Math.max(min, Math.min(newValue, max))
  }

  const getValueFromDrag = (startingValue: number, dx: number) => {
    const { min, max, trackWidth, isReversed, step, thumbSize } = stateRef.current
    const maxMove = Math.max(1, trackWidth - thumbSize)

    let dragDeltaPct = dx / maxMove
    if (isReversed) {
      dragDeltaPct = -dragDeltaPct
    }

    const dragDeltaVal = dragDeltaPct * (max - min)
    let newValue = startingValue + dragDeltaVal
    if (step && step > 0) {
      newValue = Math.round(newValue / step) * step
    }

    return Math.max(min, Math.min(newValue, max))
  }

  const startValRef = useRef(currentValue)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !stateRef.current.isDisabled,
      onStartShouldSetPanResponderCapture: () => !stateRef.current.isDisabled,
      onMoveShouldSetPanResponder: () => !stateRef.current.isDisabled,
      onMoveShouldSetPanResponderCapture: () => !stateRef.current.isDisabled,

      onPanResponderGrant: (evt, gestureState) => {
        if (stateRef.current.isDisabled) return

        if (scaleOnSliding) {
          Animated.spring(thumbScale, {
            toValue: 1.25,
            useNativeDriver: true,
          }).start()
        }

        const locX = evt.nativeEvent.locationX
        const initialVal = getValueFromLocation(locX)
        startValRef.current = initialVal

        if (!isControlled) {
          setLocalValue(initialVal)
        }
        stateRef.current.onValueChange?.(initialVal)
      },

      onPanResponderMove: (evt, gestureState) => {
        if (stateRef.current.isDisabled) return

        const newVal = getValueFromDrag(startValRef.current, gestureState.dx)
        if (!isControlled) {
          setLocalValue(newVal)
        }
        stateRef.current.onValueChange?.(newVal)
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (stateRef.current.isDisabled) return

        if (scaleOnSliding) {
          Animated.spring(thumbScale, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start()
        }

        const finalVal = getValueFromDrag(
          startValRef.current,
          gestureState.dx
        )
        stateRef.current.onSlidingComplete?.(finalVal)
      },

      onPanResponderTerminate: () => {
        if (scaleOnSliding) {
          Animated.spring(thumbScale, {
            toValue: 1,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width)
  }

  const pct = max === min ? 0 : (currentValue - min) / (max - min)
  const thumbLeftPct = isReversed ? 1 - pct : pct

  const maxMove = Math.max(0, trackWidth - thumbSize)
  const thumbLeft = thumbLeftPct * maxMove

  let filledTrackStyle = {}
  if (trackWidth > 0) {
    if (isReversed) {
      filledTrackStyle = {
        left: thumbLeft + thumbSize / 2,
        width: trackWidth - (thumbLeft + thumbSize / 2),
      }
    } else {
      filledTrackStyle = {
        left: 0,
        width: thumbLeft + thumbSize / 2,
      }
    }
  } else {
    // Fallback before layout
    filledTrackStyle = isReversed
      ? { right: 0, width: `${pct * 100}%` }
      : { left: 0, width: `${pct * 100}%` }
  }

  return (
    <View
      style={[
        styles.container,
        { opacity: isDisabled ? 0.5 : 1 },
      ]}
      onLayout={onLayout}
      pointerEvents="box-only"
      {...panResponder.panHandlers}
    >
      <View
        style={[
          styles.track,
          {
            height: trackHeight,
            backgroundColor: inactiveColor,
          },
        ]}
      >
        <View
          style={[
            styles.filledTrack,
            filledTrackStyle,
            {
              backgroundColor: activeColor,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              left: thumbLeft,
              transform: [
                { scale: scaleOnSliding ? thumbScale : 1 },
              ],
              borderColor: thumbBorderColor,
              backgroundColor: thumbColor,
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  track: {
    width: "100%",
    borderRadius: 999,
    position: "relative",
    justifyContent: "center",
    overflow: "hidden", // Keep track background rounded corners perfect
  },
  filledTrack: {
    height: "100%",
    position: "absolute",
    borderRadius: 999,
  },
  thumb: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
})
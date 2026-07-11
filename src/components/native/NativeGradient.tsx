import React from 'react';
import { requireNativeComponent, processColor, ViewProps, ViewStyle } from 'react-native';

interface NativeGradientProps extends ViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle | ViewStyle[];
}

const NativeGradientView = requireNativeComponent<any>('NativeGradient');

export function NativeGradient({ colors, start = { x: 0, y: 0 }, end = { x: 0, y: 1 }, style, ...props }: NativeGradientProps) {
  const processedColors = colors.map((c) => {
    if (c === 'transparent') {
      // In JS, processColor('transparent') returns 0.
      return 0;
    }
    return processColor(c);
  });

  return (
    <NativeGradientView
      {...props}
      style={style}
      colors={processedColors}
      startPoint={start}
      endPoint={end}
    />
  );
}

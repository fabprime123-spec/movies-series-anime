import React from 'react';
import { requireNativeComponent, ViewStyle, StyleProp, View } from 'react-native';

interface NativeMediaListProps {
  data: any[];
  isGrid?: boolean;
  isHorizontalCard?: boolean;
  onItemPress?: (event: any) => void;
  style?: StyleProp<ViewStyle>;
}

// The string must match the exact string returned by getName() in the ViewManager
const NativeMediaListManager = requireNativeComponent<NativeMediaListProps>('NativeMediaList');

export function NativeMediaList(props: NativeMediaListProps) {
  // We wrap the native component in a View with standard flexing 
  // so it occupies the space correctly in the RN tree.
  return (
    <View style={props.style}>
      <NativeMediaListManager {...props} style={{ flex: 1, width: '100%', height: '100%' }} />
    </View>
  );
}

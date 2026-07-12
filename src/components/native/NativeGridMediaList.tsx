import React, { useRef, useEffect } from 'react'
import { requireNativeComponent, ViewProps, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface NativeGridMediaListProps extends ViewProps {
  data: any[]
  onItemPress?: (event: any) => void
}

const NativeGridMediaListView = requireNativeComponent<NativeGridMediaListProps>('NativeGridMediaList')

interface Props {
  data: any[]
  style?: any
}

export function NativeGridMediaList({ data, style }: Props) {
  const navigation = useNavigation<any>()

  const handleItemPress = (event: any) => {
    const { id, mediaType } = event.nativeEvent
    if (id) {
      navigation.push('Details', { 
        id, 
        type: mediaType || 'movie'
      })
    }
  }

  // Fallback for iOS
  if (Platform.OS === 'ios') {
    return null;
  }

  return (
    <NativeGridMediaListView
      style={style}
      data={data}
      onItemPress={handleItemPress}
    />
  )
}

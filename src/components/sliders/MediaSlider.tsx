import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../ui/Text';
import { Skeleton } from '../ui/Skeleton';
import { TMDBMedia } from '../../types/tmdb';
import { NativeGradient } from '../native/NativeGradient'
import { useTheme } from '../../theme/ThemeContext';
import { NativeMediaList } from '../native/NativeMediaList';
import { useNavigation } from '@react-navigation/native';

interface MediaSliderProps {
  title: string;
  fetchFn: () => Promise<{ results: TMDBMedia[] }>
}

export const MediaSlider = React.memo(function MediaSlider({ title, fetchFn }: MediaSliderProps) {
  const [mediaList, setMediaList] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme()
  const navigation = useNavigation<any>();

  useEffect(() => {
    let mounted = true;
    fetchFn().then(res => {
      if (mounted) {
        setMediaList(res.results);
        setLoading(false);
      }
    }).catch(err => {
      console.error(`Error fetching ${title}:`, err);
      if (mounted) setLoading(false);
    });

    return () => { mounted = false; };
  }, [fetchFn]);

  const handleItemPress = useCallback((event: any) => {
    const { id, mediaType } = event.nativeEvent;
    navigation.navigate('Details', { id, type: mediaType || 'movie' });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text weight="bold" size={20} style={styles.title}>{title}</Text>
      <View style={styles.listContainer}>
        {loading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ marginRight: 10 }}>
                <Skeleton width={112} height={168} borderRadius={12} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <NativeMediaList
            data={mediaList}
            isGrid={false}
            isHorizontalCard={false}
            onItemPress={handleItemPress}
            style={{ width: '100%', height: 168, paddingHorizontal: 0 }}
          />
        )}
        <NativeGradient
          colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
  },
  title: {
    marginBottom: 12,
    paddingHorizontal: 16
  },
  listContainer: {
  },
  listContent: {
    gap: 10
  },
  loaderContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

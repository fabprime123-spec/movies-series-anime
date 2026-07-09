import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Text } from './ui/Text';
import { Skeleton } from './ui/Skeleton';
import { MediaCard } from './cards/MediaCard';
import { TMDBMedia } from '../types/tmdb';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

interface MediaSliderProps {
  title: string;
  fetchFn: () => Promise<{ results: TMDBMedia[] }>;
}

export const MediaSlider = React.memo(function MediaSlider({ title, fetchFn }: MediaSliderProps) {
  const [mediaList, setMediaList] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme()

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

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);
  const renderItem = useCallback(({ item }: any) => <MediaCard media={item} />, []);
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 112 + 10,
    offset: (112 + 10) * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <Text weight="bold" size={20} style={styles.title}>{title}</Text>
      <View style={styles.listContainer}>
        {loading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ marginRight: 16 }}>
                <Skeleton width={120} height={180} borderRadius={12} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <FlatList
            data={mediaList}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
          />
        )}
      </View>
      <LinearGradient
        colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents={"none"}
      />
    </View>
  );
})

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    marginLeft: 20,
    marginBottom: 12,
  },
  listContainer: {
    minHeight: 180, // rough height so it doesn't collapse
  },
  listContent: {
    paddingHorizontal: 10,
    gap: 10
  },
  loaderContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

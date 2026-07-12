import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '../ui/Text';
import { TMDBMedia } from '../../types/tmdb';
import { useTheme } from '../../theme/ThemeContext';

interface Top10SliderProps {
  data: TMDBMedia[];
  title?: string;
}

const { width } = Dimensions.get('window');
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export function Top10Slider({ data, title = "Top 10 Trending Today" }: Top10SliderProps) {
  const navigation = useNavigation<any>();
  const { theme, accentColor } = useTheme();

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text weight="bold" size={20} style={styles.title}>{title}</Text>
      <FlatList
        data={data.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Details', { id: item.id, type: item.media_type || 'movie' })}
          >
            <View style={[styles.posterWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {item.poster_path ? (
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
                  style={styles.poster}
                />
              ) : (
                <View style={[styles.poster, styles.noImage]}>
                  <Text size={12} color={theme.muted} style={{ textAlign: 'center' }}>No Image</Text>
                </View>
              )}
            </View>

            {/* The huge background number */}
            <View pointerEvents="none" style={{
              zIndex: 40,
              position: "absolute",
              bottom: 0,
              left: "50%"
            }}>
              <Text
                weight="bold"
                style={[
                  styles.numberBackground,
                  {
                    color: theme.background,
                    textShadowColor: theme.foreground,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 4,
                    right: index + 1 == 10 ? "25%" : index + 1 == 1 ? "65%" : "55%",
                  }
                ]}
              >
                {index + 1}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginTop: 30,
    gap: 16
  },
  title: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingHorizontal: 10, // allows shadow and overlap
    gap: 10,
    height: "auto"
  },
  cardContainer: {
    width: "100%",
    height: "auto",
    maxWidth: 125,
    aspectRatio: 11 / 16,
    marginRight: 15,
    flexDirection: 'row',
    alignItems: "center"
  },
  numberBackground: {
    fontSize: 140,
    lineHeight: 120,
    letterSpacing: -8,
    position: 'absolute',
    bottom: 4,
    zIndex: 500
  },
  posterWrapper: {
    height: '95%',
    borderRadius: 16,
    overflow: 'hidden',
    zIndex: 2,
    aspectRatio: 11 / 16,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  poster: {
    width: '100%',
    height: '100%'
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  }
});

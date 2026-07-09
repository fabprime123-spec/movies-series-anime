import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../theme/ThemeContext';

interface CastCardProps {
  person: any;
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w185';

export function CastCard({ person }: CastCardProps) {
  const { theme } = useTheme();
  const imageUrl = person.profile_path ? `${IMAGE_BASE_URL}${person.profile_path}` : null;

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: theme.card }]} />
      )}
      <Text weight="medium" size={12} numberOfLines={1} style={styles.name}>{person.name}</Text>
      <Text color={theme.muted} size={10} numberOfLines={1} style={styles.character}>
        {person.character || person.job}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 90,
    marginRight: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    textAlign: 'center',
    marginBottom: 2,
  },
  character: {
    textAlign: 'center',
  }
});

import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Play, ExternalLink } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useTheme } from '../../theme/ThemeContext';

interface VideoCardProps {
  video: any;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = (CARD_WIDTH * 9) / 16;

export function VideoCard({ video }: VideoCardProps) {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;

  const openInYouTube = () => {
    Linking.openURL(youtubeUrl).catch(console.error);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.videoContainer, { backgroundColor: theme.card }]}>
        {isPlaying ? (
          <YoutubeIframe
            height={CARD_HEIGHT}
            width={CARD_WIDTH}
            play={true}
            videoId={video.key}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsPlaying(true)}
            style={styles.thumbnailWrapper}
          >
            <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
            <View style={styles.playOverlay}>
              <View style={styles.playButton}>
                <Play color="#fff" size={24} fill="#fff" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text weight="medium" size={12} numberOfLines={2} style={styles.title}>
          {video.name}
        </Text>
        <TouchableOpacity onPress={openInYouTube} style={styles.externalButton}>
          <ExternalLink color={theme.muted} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  videoContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnailWrapper: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  externalButton: {
    padding: 4,
  }
});

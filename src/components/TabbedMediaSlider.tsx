import React, { useEffect, useState, useCallback } from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from './ui/Text'
import { Skeleton } from './ui/Skeleton'
import { HorizontalMediaCard } from './cards/HorizontalMediaCard'
import { TMDBMedia, TMDBResponse } from '../types/tmdb'
import { useTheme } from '../theme/ThemeContext'
import LinearGradient from 'react-native-linear-gradient'

export interface TabOption {
  label: string
  fetchFn: () => Promise<TMDBResponse>
}

interface TabbedMediaSliderProps {
  tabs: TabOption[]
}

export const TabbedMediaSlider = React.memo(function TabbedMediaSlider({ tabs }: TabbedMediaSliderProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [mediaList, setMediaList] = useState<TMDBMedia[]>([])
  const [loading, setLoading] = useState(true)
  const { theme, accentColor } = useTheme()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setMediaList([])

    tabs[activeTab].fetchFn().then(res => {
      if (mounted) {
        setMediaList(res.results)
        setLoading(false)
      }
    }).catch(err => {
      console.error(`Error fetching ${tabs[activeTab].label}:`, err)
      if (mounted) setLoading(false)
    })

    return () => { mounted = false }
  }, [activeTab, tabs])

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);
  const renderItem = useCallback(({ item }: any) => <HorizontalMediaCard media={item} />, []);
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 240 + 16,
    offset: (240 + 16) * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsGrid}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.label}
              onPress={() => setActiveTab(index)}
              style={[
                styles.tabButton, {
                  boxShadow: `0px 0px 10px ${theme.muted}, inset 0px 0px ${activeTab == index ? 30 : 20}px ${activeTab != index ? theme.muted : accentColor}`,
                  backgroundColor: activeTab == index ? accentColor + "00" : theme.background
                }
              ]}
            >
              <Text
                weight={activeTab == index ? "bold" : "semibold"}
                color={activeTab == index ? theme.foreground : theme.muted}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.listContainer}>
        {loading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {[1, 2, 3].map(i => (
              <View key={i} style={{ marginRight: 16 }}>
                <Skeleton width={240} height={(300 * 9) / 16} borderRadius={12} />
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
        colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        pointerEvents='none'
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  tabsWrapper: {
    marginBottom: 16,
  },
  tabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    rowGap: 8,
    paddingVertical: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '48.5%',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    minHeight: 150, // rough height so it doesn't collapse
  },
  listContent: {
    paddingHorizontal: 10,
  },
  loaderContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

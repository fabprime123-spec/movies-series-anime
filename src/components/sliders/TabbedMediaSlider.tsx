import React, { useEffect, useState, useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Text } from '../ui/Text'
import { Skeleton } from '../ui/Skeleton'
import { TMDBMedia, TMDBResponse } from '../../types/tmdb'
import { useTheme } from '../../theme/ThemeContext'
import { NativeGradient } from '../native/NativeGradient'
import { NativeMediaList } from '../native/NativeMediaList'
import { useNavigation } from '@react-navigation/native'
import { Flame } from 'lucide-react-native'

export interface TabOption {
  label: string
  fetchFn: () => Promise<TMDBResponse>
  Icon: any
}

interface TabbedMediaSliderProps {
  tabs: TabOption[]
}

export const TabbedMediaSlider = React.memo(function TabbedMediaSlider({ tabs }: TabbedMediaSliderProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [mediaCache, setMediaCache] = useState<Record<number, TMDBMedia[]>>({})
  const [loading, setLoading] = useState(true)
  const { theme, accentColor } = useTheme()
  const navigation = useNavigation<any>()

  useEffect(() => {
    let mounted = true
    if (mediaCache[activeTab]) {
      setLoading(false)
      return
    }

    setLoading(true)
    tabs[activeTab].fetchFn().then(res => {
      if (mounted) {
        setMediaCache(prev => ({ ...prev, [activeTab]: res.results }))
        setLoading(false)
      }
    }).catch(err => {
      console.error(`Error fetching ${tabs[activeTab].label}:`, err)
      if (mounted) setLoading(false)
    })

    return () => { mounted = false }
  }, [activeTab, tabs])

  const handleItemPress = useCallback((event: any) => {
    const { id } = event.nativeEvent;
    const media = mediaCache[activeTab]?.find(m => m.id === id);
    const type = media?.media_type || event.nativeEvent.mediaType || 'movie';
    navigation.navigate('Details', { id, type });
  }, [navigation, mediaCache, activeTab]);

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
                  boxShadow: activeTab == index ? `0px 0px 10px ${accentColor}` : undefined,
                  backgroundColor: activeTab == index ? accentColor : theme.card
                }
              ]}
            >
              {React.cloneElement(tab.Icon as React.ReactElement<any>, { color: activeTab === index ? theme.background : theme.muted })}
              <Text
                weight={activeTab == index ? "bold" : "semibold"}
                color={activeTab == index ? theme.foreground : theme.muted}
                style={{
                  minWidth: 80,
                  paddingLeft: 4
                }}
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
                <Skeleton width={240} height={180} borderRadius={12} />
              </View>

            ))}
          </ScrollView>
        ) : (
          <NativeMediaList
            data={mediaCache[activeTab] || []}
            isGrid={false}
            isHorizontalCard={true}
            onItemPress={handleItemPress}
            style={{ width: '100%', height: 180 }}
          />
        )}
        <NativeGradient
          colors={[theme.background, "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", "transparent", theme.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
  },
  tabsWrapper: {
    marginBottom: 16,
  },
  tabsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    paddingVertical: 8,
    paddingHorizontal: 20
  },
  tabButton: {
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '48.5%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "row",
    gap: 10
  },
  listContainer: {
    minHeight: 150, // rough height so it doesn't collapse
  },
  listContent: {
    paddingHorizontal: 0,
  },
  loaderContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

import React, { useState } from 'react'
import { View, Modal, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native'
import { X, Search } from 'lucide-react-native'
import { Text } from '../ui/Text'
import { COUNTRIES, Country } from '../../constants/countries'
import { useTheme } from '../../theme/ThemeContext'
import { NativeGradient } from '../native/NativeGradient'

interface CountryPickerModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (country: Country) => void
  selectedCode?: string | null
}

export function CountryPickerModal({ visible, onClose, onSelect, selectedCode }: CountryPickerModalProps) {
  const { theme, safeAreaInsets } = useTheme()
  const [search, setSearch] = useState('')

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  const renderItem = ({ item }: { item: Country }) => {
    const isSelected = item.code === selectedCode

    return (
      <TouchableOpacity
        style={[styles.item, isSelected && { backgroundColor: theme.card }]}
        onPress={() => {
          onSelect(item)
          onClose()
        }}
      >
        <Text size={24} style={styles.flag}>{item.flag}</Text>
        <Text weight={isSelected ? "bold" : "medium"} style={styles.name}>
          {`${item.name} [${item.code}]`}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={"pageSheet"} onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.background, paddingTop: safeAreaInsets.top }]}>

        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text weight="bold" size={20}>Select Country</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color={theme.foreground} size={24} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
          <Search color={theme.muted} size={20} />
          <TextInput
            style={[styles.searchInput, { color: theme.foreground }]}
            placeholder="Search country..."
            placeholderTextColor={theme.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />

      </View>
      <NativeGradient
        colors={["transparent", "transparent", theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'GeneralSans-Medium',
  },
  list: {
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  flag: {
    marginRight: 16,
  },
  name: {
    flex: 1,
  }
})

import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../theme/ThemeContext';
import { CheckCircle, AlertCircle, X } from 'lucide-react-native';

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export function AlertModal({ visible, title, message, type = 'info', onClose }: AlertModalProps) {
  const { theme } = useTheme();

  const getColor = () => {
    switch (type) {
      case 'success': return '#10b981'; // Emerald
      case 'error': return '#ef4444'; // Red
      default: return theme.foreground;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle color="#10b981" size={40} />;
      case 'error': return <AlertCircle color="#ef4444" size={40} />;
      default: return null;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X color={theme.muted} size={20} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            {getIcon()}
          </View>

          <Text weight="bold" size={20} style={[styles.title, { color: getColor() }]}>
            {title}
          </Text>
          
          <Text color={theme.muted} style={styles.message}>
            {message}
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: getColor() }]}
            onPress={onClose}
          >
            <Text weight="bold" color="#fff">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: width - 40,
    borderRadius: 20,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  }
});

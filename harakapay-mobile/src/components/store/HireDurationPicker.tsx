// harakapay-mobile/src/components/store/HireDurationPicker.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { HireSettings } from '../../types/store';

interface HireDurationPickerProps {
  visible: boolean;
  onClose: () => void;
  hireSettings: HireSettings;
  onDatesSelected: (startDate: string, endDate: string) => void;
}

export const HireDurationPicker: React.FC<HireDurationPickerProps> = ({
  visible,
  onClose,
  hireSettings,
  onDatesSelected,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(hireSettings.minDurationDays);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const calculateEndDate = (start: string, duration: number) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    return endDate.toISOString().split('T')[0];
  };

  const handleDurationSelect = (duration: number) => {
    setSelectedDuration(duration);
  };

  const handleConfirm = () => {
    const endDate = calculateEndDate(startDate, selectedDuration);
    onDatesSelected(startDate, endDate);
  };

  const generateDurationOptions = () => {
    const options = [];
    for (let i = hireSettings.minDurationDays; i <= hireSettings.maxDurationDays; i++) {
      options.push(i);
    }
    return options;
  };

  const formatDurationText = (days: number) => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days === 7) return '1 week';
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
    if (days === 30) return '1 month';
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''}`;
  };

  const durationOptions = generateDurationOptions();
  const endDate = calculateEndDate(startDate, selectedDuration);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Hire Duration</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Start Date */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Start Date</Text>
              <Text style={styles.dateText}>{startDate}</Text>
              <Text style={styles.note}>
                Note: Start date is set to today. Contact school to change if needed.
              </Text>
            </View>

            {/* Duration Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              <Text style={styles.subtitle}>
                Select from {hireSettings.minDurationDays} to {hireSettings.maxDurationDays} days
              </Text>
              
              <View style={styles.durationGrid}>
                {durationOptions.map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.durationOption,
                      selectedDuration === days && styles.selectedDurationOption,
                    ]}
                    onPress={() => handleDurationSelect(days)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selectedDuration === days && styles.selectedDurationText,
                      ]}
                    >
                      {formatDurationText(days)}
                    </Text>
                    <Text
                      style={[
                        styles.durationSubtext,
                        selectedDuration === days && styles.selectedDurationSubtext,
                      ]}
                    >
                      {days} day{days > 1 ? 's' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* End Date Preview */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>End Date</Text>
              <Text style={styles.dateText}>{endDate}</Text>
            </View>

            {/* Deposit Information */}
            {hireSettings.depositAmount && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Deposit Required</Text>
                <Text style={styles.depositText}>
                  ${hireSettings.depositAmount.toFixed(2)}
                </Text>
                <Text style={styles.note}>
                  This deposit will be refunded when the item is returned in good condition.
                </Text>
              </View>
            )}

            {/* Late Fee Information */}
            {hireSettings.lateFeePerDay && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Late Return Fee</Text>
                <Text style={styles.lateFeeText}>
                  ${hireSettings.lateFeePerDay.toFixed(2)} per day
                </Text>
                <Text style={styles.note}>
                  Additional charges apply for late returns.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationOption: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDurationOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedDurationText: {
    color: '#fff',
  },
  durationSubtext: {
    fontSize: 12,
    color: '#666',
  },
  selectedDurationSubtext: {
    color: '#fff',
  },
  depositText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff8800',
    marginBottom: 8,
  },
  lateFeeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

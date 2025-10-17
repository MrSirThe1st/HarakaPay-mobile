import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ChildCardProps {
  student: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    grade_level?: string;
    school_name?: string;
  };
  onPress: () => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ student, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Profile Photo Placeholder */}
      <View style={styles.photoContainer}>
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>
            {(student.first_name || 'S').charAt(0)}{(student.last_name || 'T').charAt(0)}
          </Text>
        </View>
      </View>

      {/* Student Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.studentName}>
          {student.first_name || 'Unknown'} {student.last_name || 'Student'}
        </Text>
        
        {student.grade_level && (
          <Text style={styles.gradeText}>Grade {student.grade_level}</Text>
        )}
        
        {student.school_name && (
          <Text style={styles.schoolText} numberOfLines={2}>
            {student.school_name}
          </Text>
        )}
      </View>

      {/* Card Accent */}
      <View style={styles.accentBar} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 160,
    backgroundColor: 'white',
    borderRadius: 16,
    marginRight: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0080FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  gradeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  schoolText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#0080FF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import colors from '../../constants/colors';

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
  variant?: number; // Variant number for different shades (0-4)
}

// Color schemes for different card variants - using primary blue with variations
const cardVariants = [
  {
    base: colors.primary, // Light blue
    blob1: colors.blue.lighter, // Sky blue
    blob2: colors.blue.light, // Medium light blue
  },
  {
    base: colors.blue.dark, // Medium dark blue
    blob1: colors.primary, // Light blue
    blob2: colors.blue.medium, // Medium blue
  },
  {
    base: colors.blue.darkest, // Deep blue
    blob1: colors.blue.light, // Light blue
    blob2: colors.blue.dark, // Dark blue
  },
  {
    base: colors.accent, // Emerald green (accent color)
    blob1: colors.accentLight, // Light green
    blob2: colors.accentDark, // Dark green
  },
  {
    base: colors.blue.darker, // Darker blue
    blob1: colors.blue.lighter, // Sky blue
    blob2: colors.primary, // Light blue
  },
];

// Helper function to generate DiceBear avatar URL
const getAvatarUrl = (student: { id: string; first_name?: string | null; last_name?: string | null }): string => {
  // Use student name as seed if available, otherwise use student ID
  const seed = (student.first_name && student.last_name)
    ? `${student.first_name} ${student.last_name}`
    : student.id;
  
  // Encode the seed to handle special characters
  const encodedSeed = encodeURIComponent(seed);
  
  return `https://api.dicebear.com/7.x/micah/png?seed=${encodedSeed}`;
};

// Helper function to format grade in Congolese format
const formatCongoleseGrade = (gradeLevel: string): string => {
  if (!gradeLevel) return '';
  
  // If already in Congolese format (contains superscript), return as is
  if (gradeLevel.includes('ʳᵉ') || gradeLevel.includes('ᵉ')) {
    return gradeLevel;
  }
  
  // Map common grade values to Congolese format
  const gradeMap: Record<string, string> = {
    'maternelle-1': '1ʳᵉ Maternelle',
    'maternelle-2': '2ᵉ Maternelle',
    'maternelle-3': '3ᵉ Maternelle',
    'primaire-1': '1ʳᵉ Primaire',
    'primaire-2': '2ᵉ Primaire',
    'primaire-3': '3ᵉ Primaire',
    'primaire-4': '4ᵉ Primaire',
    'primaire-5': '5ᵉ Primaire',
    'primaire-6': '6ᵉ Primaire',
    'base-7': '7ᵉ année de l\'Éducation de Base',
    'base-8': '8ᵉ année de l\'Éducation de Base',
    'humanites-1': '1ʳᵉ année des Humanités',
    'humanites-2': '2ᵉ année des Humanités',
    'humanites-3': '3ᵉ année des Humanités',
    'humanites-4': '4ᵉ année des Humanités',
    'licence-1': 'Licence 1 (L1)',
    'licence-2': 'Licence 2 (L2)',
    'licence-3': 'Licence 3 (L3)',
    'master-1': 'Master 1 (M1)',
    'master-2': 'Master 2 (M2)',
  };
  
  // Check if it's a mapped value
  if (gradeMap[gradeLevel.toLowerCase()]) {
    return gradeMap[gradeLevel.toLowerCase()];
  }
  
  // Try to parse numeric grades (legacy format)
  const numericMatch = gradeLevel.match(/grade-?(\d+)/i);
  if (numericMatch) {
    const num = parseInt(numericMatch[1]);
    if (num <= 6) return `${num}${num === 1 ? 'ʳᵉ' : 'ᵉ'} Primaire`;
    if (num === 7) return '7ᵉ année de l\'Éducation de Base';
    if (num === 8) return '8ᵉ année de l\'Éducation de Base';
    if (num >= 9 && num <= 12) {
      const humaniteNum = num - 8;
      return `${humaniteNum}${humaniteNum === 1 ? 'ʳᵉ' : 'ᵉ'} année des Humanités`;
    }
  }
  
  // Return as is if no match
  return gradeLevel;
};

export const ChildCard: React.FC<ChildCardProps> = ({ student, onPress, variant = 0 }) => {
  const formattedGrade = student.grade_level ? formatCongoleseGrade(student.grade_level) : '';
  const [imageError, setImageError] = useState(false);
  const avatarUrl = getAvatarUrl(student);
  
  // Get color scheme for this variant (cycle through variants if index exceeds array length)
  const colorScheme = cardVariants[variant % cardVariants.length];
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Abstract Blue Background */}
      <View style={styles.backgroundContainer}>
        {/* Base solid background */}
        <View style={[styles.baseBackground, { backgroundColor: colorScheme.base }]} />
        {/* Solid color blob shapes */}
        <View style={[styles.blob1, { backgroundColor: colorScheme.blob1 }]} />
        <View style={[styles.blob2, { backgroundColor: colorScheme.blob2 }]} />
      </View>
      
      <View style={styles.cardContent}>
        {/* Top Section - Name and Avatar */}
        <View style={styles.topSection}>
          <View style={styles.nameContainer}>
            <Text style={styles.studentName} numberOfLines={2} ellipsizeMode="tail">
              {(student.first_name || 'Unknown') + ' ' + (student.last_name || 'Student')}
            </Text>
          </View>
          <View style={styles.photoPlaceholder}>
            {!imageError ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                onError={() => setImageError(true)}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.photoText}>
                {(student.first_name || 'S').charAt(0)}{(student.last_name || 'T').charAt(0)}
              </Text>
            )}
          </View>
        </View>

        {/* Bottom Section - Details (like cardholder name and expiry) */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomLeft}>
            {student.school_name && (
              <Text style={styles.schoolText} numberOfLines={1}>
                {student.school_name}
              </Text>
            )}
          </View>
          {formattedGrade && (
            <View style={styles.bottomRight}>
              <View style={styles.badgeContainer}>
                <Text style={styles.gradeText}>{formattedGrade}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 200,
    borderRadius: 32,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 46,
    overflow: 'hidden',
  },
  baseBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor will be set dynamically via variant
  },
  blob1: {
    position: 'absolute',
    top: -10,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    // backgroundColor will be set dynamically via variant
  },
  blob2: {
    position: 'absolute',
    bottom: -45,
    left: -70,
    width: 200,
    height: 210,
    borderRadius: 100,
    // backgroundColor will be set dynamically via variant
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    zIndex: 1,
    position: 'relative',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  nameContainer: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'flex-start',
  },
  photoPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },
  photoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    lineHeight: 26,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bottomLeft: {
    flex: 1,
    marginRight: 16,
  },
  bottomRight: {
    alignItems: 'flex-end',
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gradeText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  schoolText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

// harakapay-mobile/src/screens/ChildrenTabScreen.tsx - Debug Version
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';

export default function ChildrenScreen({ navigation }) {
  const { parent } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadChildren();
    }, [])
  );

  const loadChildren = async () => {
    console.log('🔍 Starting to load children...');
    console.log('📋 Parent data:', parent);

    if (!parent) {
      console.log('❌ No parent data available');
      setDebugInfo('No parent data available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔍 Parent ID:', parent.id);

      // Step 1: Check if parent_students table has any records for this parent
      console.log('🔍 Step 1: Checking parent_students table...');
      const { data: parentStudentsData, error: parentStudentsError } = await supabase
        .from('parent_students')
        .select('*')
        .eq('parent_id', parent.id);

      console.log('📊 Parent-students raw data:', parentStudentsData);
      console.log('❌ Parent-students error:', parentStudentsError);

      if (parentStudentsError) {
        console.log('❌ Error fetching parent_students:', parentStudentsError);
        setDebugInfo(`Error fetching parent_students: ${parentStudentsError.message}`);
        return;
      }

      if (!parentStudentsData || parentStudentsData.length === 0) {
        console.log('📝 No parent-student relationships found');
        setDebugInfo(`No children connected for parent ID: ${parent.id}`);
        setChildren([]);
        return;
      }

      // Step 2: Get detailed data with joins
      console.log('🔍 Step 2: Getting detailed data with joins...');
      const { data, error } = await supabase
        .from('parent_students')
        .select(`
          *,
          student:students(
            *,
            school:schools(id, name, address)
          )
        `)
        .eq('parent_id', parent.id)
        .order('created_at', { ascending: false });

      console.log('📊 Detailed children data:', JSON.stringify(data, null, 2));
      console.log('❌ Detailed query error:', error);

      if (error) {
        console.log('❌ Error fetching detailed children data:', error);
        setDebugInfo(`Error fetching detailed data: ${error.message}`);
        return;
      }

      setChildren(data || []);
      setDebugInfo(`Successfully loaded ${data?.length || 0} children`);

    } catch (error) {
      console.error('💥 Unexpected error loading children:', error);
      setDebugInfo(`Unexpected error: ${error.message}`);
      Alert.alert('Error', 'Failed to load children. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadChildren();
    setRefreshing(false);
  };

  const handleAddChild = () => {
    navigation.navigate('ConnectChild');
  };

  // Debug: Check parent_students table manually
  const checkParentStudentsTable = async () => {
    try {
      console.log('🔍 Manual check of parent_students table...');
      
      // Get all records in parent_students table
      const { data: allRecords, error } = await supabase
        .from('parent_students')
        .select('*');

      console.log('📊 All parent_students records:', allRecords);
      console.log('❌ Error:', error);

      Alert.alert(
        'Debug Info', 
        `Total records in parent_students: ${allRecords?.length || 0}\n\nCheck console for details.`
      );
    } catch (error) {
      console.error('Error checking parent_students table:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0080FF" />
        <Text style={styles.loadingText}>Loading your children...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Debug Header */}
      <View style={styles.debugHeader}>
        <Text style={styles.debugTitle}>Children Tab - Debug Mode</Text>
        <Text style={styles.debugText}>Parent ID: {parent?.id}</Text>
        <Text style={styles.debugText}>Status: {debugInfo}</Text>
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={checkParentStudentsTable}
        >
          <Text style={styles.debugButtonText}>Check Database</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {children.length > 0 ? (
          <>
            <Text style={styles.successText}>✅ Found {children.length} children!</Text>
            {children.map((child, index) => (
              <View key={child.id} style={styles.childCard}>
                <Text style={styles.childName}>
                  Child {index + 1}: {child.student?.first_name} {child.student?.last_name}
                </Text>
                <Text style={styles.schoolName}>
                  School: {child.student?.school?.name || 'Unknown'}
                </Text>
                <Text style={styles.gradeText}>
                  Grade: {child.student?.grade_level || 'Not specified'}
                </Text>
                <Text style={styles.studentId}>
                  Student ID: {child.student?.student_id}
                </Text>
                <Text style={styles.relationshipText}>
                  Relationship: {child.relationship_type}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Children Found</Text>
            <Text style={styles.emptyDescription}>
              Debug Info: {debugInfo}
            </Text>
            <TouchableOpacity
              style={styles.addChildButton}
              onPress={handleAddChild}
            >
              <Text style={styles.addChildText}>Connect Your First Child</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  debugHeader: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#92400E',
    marginBottom: 4,
  },
  debugButton: {
    backgroundColor: '#D97706',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  successText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  childCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  schoolName: {
    fontSize: 14,
    color: '#0080FF',
    marginBottom: 2,
  },
  gradeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  relationshipText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  addChildButton: {
    backgroundColor: '#0080FF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  addChildText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
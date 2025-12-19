import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { fetchMessages } from '../api/messageApi';
import type { ParentSchoolMessage } from '../types/message';
import colors from '../constants/colors';
import SendMessageModal from './SendMessageModal';

const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<ParentSchoolMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ParentSchoolMessage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadMessages = async (refresh = false) => {
    try {
      const currentPage = refresh ? 1 : page;
      const result = await fetchMessages(currentPage, 20);

      if (refresh) {
        setMessages(result.messages);
        setPage(1);
      } else {
        setMessages(prev => [...prev, ...result.messages]);
      }

      setUnreadCount(result.unreadCount);
      setHasMore(result.pagination ? currentPage < result.pagination.pages : false);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMessages(true);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMessages(true);
  }, []);

  const handleMessagePress = (message: ParentSchoolMessage) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadMessages(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const renderMessageItem = ({ item }: { item: ParentSchoolMessage }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => handleMessagePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.messageHeader}>
        <View style={styles.messageIcon}>
          <Ionicons
            name="send-outline"
            size={24}
            color={item.status === 'read' ? '#10B981' : '#9CA3AF'}
          />
        </View>

        <View style={styles.messageContent}>
          <Text style={styles.subject} numberOfLines={1}>
            {item.subject}
          </Text>

          <Text style={styles.messageText} numberOfLines={2}>
            {item.message}
          </Text>

          <View style={styles.footer}>
            {item.student && (
              <View style={styles.studentBadge}>
                <Ionicons name="person" size={12} color="#6B7280" />
                <Text style={styles.studentName}>
                  {item.student.first_name} {item.student.last_name}
                </Text>
              </View>
            )}
            <View style={styles.statusRow}>
              <Text style={[styles.statusText, item.status === 'read' && styles.readStatus]}>
                {item.status === 'read' ? '✓ Read by school' : 'Sent'}
              </Text>
              <Text style={styles.time}> · {getRelativeTime(item.created_at)}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No Messages</Text>
      <Text style={styles.emptyText}>
        Send a message to your school to get started.
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => setSendModalVisible(true)}>
        <Ionicons name="send" size={20} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Send Message</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && messages.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={() => setSendModalVisible(true)} style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[messages.length === 0 ? styles.emptyContainer : styles.listContainer, { paddingBottom: 90 }]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && messages.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : null
        }
      />

      <SendMessageModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
        onSuccess={() => loadMessages(true)}
      />

      {/* Message Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Message</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedMessage && (
                <>
                  <View style={styles.modalMessageHeader}>
                    <View style={styles.modalIconContainer}>
                      <Ionicons name="mail-outline" size={32} color="#3B82F6" />
                    </View>
                  </View>

                  <Text style={styles.modalSubject}>{selectedMessage.subject}</Text>

                  <Text style={styles.modalMessage}>{selectedMessage.message}</Text>

                  <View style={styles.modalFooter}>
                    {selectedMessage.student && (
                      <View style={styles.modalStudentBadge}>
                        <Ionicons name="person" size={16} color="#6B7280" />
                        <Text style={styles.modalStudentName}>
                          Regarding: {selectedMessage.student.first_name} {selectedMessage.student.last_name}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.modalTime}>
                      Sent {getRelativeTime(selectedMessage.created_at)}
                    </Text>
                    {selectedMessage.status === 'read' && selectedMessage.read_at && (
                      <Text style={styles.modalReadStatus}>
                        Read by school {getRelativeTime(selectedMessage.read_at)}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  newMessageButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  messageItem: {
    backgroundColor: '#1E3A8A',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
  },
  messageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#B0C4DE',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  studentName: {
    fontSize: 12,
    color: '#B0C4DE',
    marginLeft: 4,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: '#B0C4DE',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  readStatus: {
    color: '#10B981',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.inverse,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalMessageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubject: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalStudentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  modalStudentName: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  modalTime: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  modalReadStatus: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
});

export default MessagesTab;
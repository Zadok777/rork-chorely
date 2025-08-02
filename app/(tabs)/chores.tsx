import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function ChoresScreen() {
  const { user } = useAuthStore();
  const isParent = user?.role === 'parent';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Chores</Text>
        {isParent && (
          <Button 
            title="Create Chore" 
            variant="primary"
            size="small"
            testID="create-chore-button"
            onPress={() => {}}
          />
        )}
      </View>
      
      <Card style={styles.filterCard}>
        <View style={styles.filterRow}>
          <Button 
            title="All" 
            variant="primary"
            size="small"
            style={styles.filterButton}
            onPress={() => {}}
          />
          <Button 
            title="Assigned" 
            variant="outline"
            size="small"
            style={styles.filterButton}
            onPress={() => {}}
          />
          <Button 
            title="Completed" 
            variant="outline"
            size="small"
            style={styles.filterButton}
            onPress={() => {}}
          />
        </View>
      </Card>
      
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No Chores Yet</Text>
        <Text style={styles.emptyStateText}>
          {isParent 
            ? "Create chores and assign them to your children." 
            : "You don't have any chores assigned yet."}
        </Text>
        
        {isParent && (
          <Button 
            title="Create First Chore" 
            style={styles.emptyStateButton}
            testID="empty-create-chore-button"
            onPress={() => {}}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterCard: {
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterButton: {
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyStateButton: {
    marginTop: 16,
  },
});
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function RewardsScreen() {
  const { user, familyMembers } = useAuthStore();
  const isParent = user?.role === 'parent';
  
  const currentMember = familyMembers.find(member => member.id === user?.id);
  const points = currentMember?.points || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Rewards</Text>
        {isParent && (
          <Button 
            title="Create Reward" 
            variant="primary"
            size="small"
            testID="create-reward-button"
            onPress={() => {}}
          />
        )}
      </View>
      
      {!isParent && (
        <Card style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Your Points</Text>
          <Text style={styles.pointsValue}>{points}</Text>
          <Text style={styles.pointsSubtitle}>Complete chores to earn more points!</Text>
        </Card>
      )}
      
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>No Rewards Yet</Text>
        <Text style={styles.emptyStateText}>
          {isParent 
            ? "Create rewards that children can redeem with their points." 
            : "No rewards are available yet. Ask your parents to create some!"}
        </Text>
        
        {isParent && (
          <Button 
            title="Create First Reward" 
            style={styles.emptyStateButton}
            testID="empty-create-reward-button"
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
  pointsCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  pointsTitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  pointsSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
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
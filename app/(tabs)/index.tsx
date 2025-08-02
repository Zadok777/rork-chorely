import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const { user, family, familyMembers } = useAuthStore();
  
  const isParent = user?.role === 'parent';
  const currentMember = familyMembers.find(member => member.id === user?.id);
  
  // Filter children for the leaderboard
  const children = familyMembers.filter(member => member.role === 'child');
  const sortedChildren = [...children].sort((a, b) => b.points - a.points);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome{currentMember ? `, ${currentMember.name}` : ''}!
        </Text>
        <Text style={styles.familyName}>{family?.name}</Text>
      </View>
      
      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>
          {isParent ? 'Family Overview' : 'Your Progress'}
        </Text>
        
        {isParent ? (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{children.length}</Text>
              <Text style={styles.statLabel}>Children</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Active Chores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentMember?.points || 0}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}
      </Card>
      
      {children.length > 0 && (
        <Card style={styles.leaderboardCard}>
          <Text style={styles.cardTitle}>Leaderboard</Text>
          
          {sortedChildren.map((child, index) => (
            <View key={child.id} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <Text style={styles.leaderboardName}>{child.name}</Text>
              <Text style={styles.leaderboardPoints}>{child.points} pts</Text>
            </View>
          ))}
        </Card>
      )}
      
      <Card style={styles.activityCard}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No recent activity to show.
          </Text>
        </View>
      </Card>
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
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  familyName: {
    fontSize: 16,
    color: colors.textLight,
  },
  summaryCard: {
    marginBottom: 16,
  },
  leaderboardCard: {
    marginBottom: 16,
  },
  activityCard: {
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  leaderboardPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});
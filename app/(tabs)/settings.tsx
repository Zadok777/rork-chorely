import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { 
  LogOut, 
  Users, 
  Bell, 
  Shield, 
  HelpCircle, 
  ChevronRight 
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
// Button component removed as we're using custom logout button
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function SettingsScreen() {
  const { user, family, logout } = useAuthStore();
  const isParent = user?.role === 'parent';

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      
      <Card style={styles.familyCard}>
        <Text style={styles.familyName}>{family?.name}</Text>
        <Text style={styles.familyCode}>Family Code: {family?.code}</Text>
      </Card>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        {isParent && (
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Users size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Family Members</Text>
              <Text style={styles.settingDescription}>Manage family profiles</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Bell size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingDescription}>Manage alerts and reminders</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        {isParent && (
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Shield size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy & Security</Text>
              <Text style={styles.settingDescription}>Manage account security</Text>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <HelpCircle size={24} color={colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingDescription}>FAQs and contact support</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.logoutButtonContainer}>
        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.logoutButton}
          testID="logout-button"
        >
          <LogOut size={20} color={colors.primary} style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.versionText}>Chorely v1.0.0</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  familyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  familyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  familyCode: {
    fontSize: 16,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  logoutButtonContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  versionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
});
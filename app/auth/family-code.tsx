import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FamilyCodeDisplay } from '@/components/auth/FamilyCodeDisplay';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function FamilyCodeScreen() {
  const { family, user } = useAuthStore();

  useEffect(() => {
    // Redirect if no family or user
    if (!family || !user) {
      router.replace('/');
    }
  }, [family, user]);

  const handleContinue = () => {
    router.push('/auth/add-children');
  };

  if (!family) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Family Account is Ready!</Text>
        <Text style={styles.subtitle}>
          Here's your unique family code. Share it with your family members so they can join.
        </Text>
        
        <FamilyCodeDisplay 
          code={family.code} 
          familyName={family.name} 
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What's Next?</Text>
          <Text style={styles.infoText}>
            1. Add your children's profiles{'\n'}
            2. Create chores and assign them{'\n'}
            3. Set up rewards for completed tasks
          </Text>
        </View>
        
        <Button
          title="Continue to Add Children"
          onPress={handleContinue}
          size="large"
          style={styles.button}
          testID="continue-button"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  infoContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginVertical: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  button: {
    marginBottom: 32,
    width: '100%',
  },
});
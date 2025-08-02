import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChildProfileItem } from '@/components/auth/ChildProfileItem';
import { useAuthStore } from '@/store/authStore';
import { FamilyMember } from '@/types/auth';
import { colors } from '@/constants/colors';

export default function ChildLoginScreen() {
  const [familyCode, setFamilyCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showProfiles, setShowProfiles] = useState(false);
  
  const { 
    getFamilyByCode, 
    getFamilyMembers, 
    loginChild, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();

  const handleVerifyCode = async () => {
    clearError();
    setCodeError('');
    
    if (!familyCode.trim()) {
      setCodeError('Please enter your family code');
      return;
    }
    
    try {
      const family = await getFamilyByCode(familyCode);
      
      if (!family) {
        setCodeError('Family not found with that code');
        return;
      }
      
      const members = await getFamilyMembers(family.id);
      const children = members.filter(member => member.role === 'child');
      
      if (children.length === 0) {
        setCodeError('No children found in this family');
        return;
      }
      
      setFamilyMembers(children);
      setShowProfiles(true);
    } catch (err) {
      console.error('Code verification error:', err);
      setCodeError('An error occurred. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!selectedChildId) {
      return;
    }
    
    try {
      await loginChild(familyCode, selectedChildId);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Child login error:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Card style={styles.card}>
          {!showProfiles ? (
            <>
              <Text style={styles.title}>Enter Your Family Code</Text>
              <Text style={styles.subtitle}>
                Ask your parent for the family code to log in
              </Text>
              
              <Input
                label="Family Code"
                placeholder="Enter 6-character code"
                value={familyCode}
                onChangeText={(text) => {
                  setFamilyCode(text.toUpperCase());
                  if (codeError) {
                    setCodeError('');
                  }
                }}
                autoCapitalize="characters"
                maxLength={6}
                error={codeError}
                testID="family-code-input"
              />
              
              {error && <Text style={styles.errorText}>{error}</Text>}
              
              <Button
                title="Continue"
                onPress={handleVerifyCode}
                isLoading={isLoading}
                style={styles.button}
                testID="verify-code-button"
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>Who Are You?</Text>
              <Text style={styles.subtitle}>
                Select your profile to continue
              </Text>
              
              <View style={styles.profilesContainer}>
                <FlatList
                  data={familyMembers}
                  renderItem={({ item }) => (
                    <ChildProfileItem
                      child={item}
                      onSelect={setSelectedChildId}
                      isSelected={selectedChildId === item.id}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.profilesList}
                />
              </View>
              
              {error && <Text style={styles.errorText}>{error}</Text>}
              
              <Button
                title="Log In"
                onPress={handleLogin}
                disabled={!selectedChildId}
                isLoading={isLoading}
                style={styles.button}
                testID="child-login-button"
              />
              
              <Button
                title="Back to Family Code"
                onPress={() => {
                  setShowProfiles(false);
                  setSelectedChildId(null);
                }}
                variant="text"
                style={styles.textButton}
                testID="back-button"
              />
            </>
          )}
        </Card>
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
    justifyContent: 'center',
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
  },
  profilesContainer: {
    marginVertical: 24,
  },
  profilesList: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 16,
  },
  textButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
});
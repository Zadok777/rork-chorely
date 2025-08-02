import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, Home } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function ParentRegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { registerParent, isLoading, error, clearError } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!familyName) {
      newErrors.familyName = 'Family name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    try {
      await registerParent(email, password, familyName);
      router.push('/auth/family-code');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Card style={styles.card}>
            <Text style={styles.title}>Create Your Family Account</Text>
            <Text style={styles.subtitle}>
              Set up your family's Chorely account to start assigning and tracking chores.
            </Text>
            
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              leftIcon={<Mail size={20} color={colors.textLight} />}
              testID="email-input"
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              secureTextEntry
              error={errors.password}
              leftIcon={<Lock size={20} color={colors.textLight} />}
              testID="password-input"
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: '' });
                }
              }}
              secureTextEntry
              error={errors.confirmPassword}
              leftIcon={<Lock size={20} color={colors.textLight} />}
              testID="confirm-password-input"
            />
            
            <Input
              label="Family Name"
              placeholder="e.g. Smith Family"
              value={familyName}
              onChangeText={(text) => {
                setFamilyName(text);
                if (errors.familyName) {
                  setErrors({ ...errors, familyName: '' });
                }
              }}
              error={errors.familyName}
              leftIcon={<Home size={20} color={colors.textLight} />}
              testID="family-name-input"
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Button
              title="Create Family Account"
              onPress={handleRegister}
              isLoading={isLoading}
              style={styles.button}
              testID="register-button"
            />
            
            <Button
              title="Already have an account? Log in"
              onPress={() => router.push('/auth/parent-login')}
              variant="text"
              style={styles.textButton}
              testID="login-link"
            />
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
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
  button: {
    marginTop: 24,
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
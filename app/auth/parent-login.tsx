import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';

export default function ParentLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { loginParent, isLoading, error, clearError } = useAuthStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    
    if (!validate()) {
      return;
    }
    
    try {
      await loginParent(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Login error:', err);
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Log in to manage your family's chores and rewards
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
              placeholder="Enter your password"
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
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Button
              title="Log In"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.button}
              testID="login-button"
            />
            
            <Button
              title="Forgot Password?"
              onPress={() => {/* TODO: Implement password reset */}}
              variant="text"
              style={styles.textButton}
              testID="forgot-password"
            />
            
            <Button
              title="Create a Family Account"
              onPress={() => router.push('/auth/parent-register')}
              variant="outline"
              style={styles.outlineButton}
              testID="register-link"
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
  outlineButton: {
    marginTop: 16,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
});
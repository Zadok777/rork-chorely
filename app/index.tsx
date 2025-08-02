import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors, gradients } from '@/constants/colors';

export default function WelcomeScreen() {
  const handleParentLogin = () => {
    router.push('/auth/parent-login');
  };

  const handleChildLogin = () => {
    router.push('/auth/child-login');
  };

  const handleCreateFamily = () => {
    router.push('/auth/parent-register');
  };

  return (
    <LinearGradient
      colors={['#F8F9FA', '#E8F4F8']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://r2-pub.rork.com/attachments/89rdge6cposq2c17g8guf' }} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Welcome to Chorely</Text>
          <Text style={styles.subtitle}>
            Making chores fun for the whole family
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="I'm a Parent" 
              onPress={handleParentLogin}
              size="large"
              style={styles.button}
              testID="parent-login-button"
            />
            
            <Button 
              title="I'm a Child" 
              onPress={handleChildLogin}
              variant="secondary"
              size="large"
              style={styles.button}
              testID="child-login-button"
            />
            
            <Button 
              title="Create a Family" 
              onPress={handleCreateFamily}
              variant="outline"
              size="large"
              style={styles.button}
              testID="create-family-button"
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.textLight,
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
  button: {
    marginBottom: 16,
  },
});
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  glassmorphism?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  glassmorphism = false,
  testID
}) => {
  if (glassmorphism) {
    return (
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.5)"]}
        style={[styles.card, styles.glassmorphism, style]}
        testID={testID}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  glassmorphism: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: 'transparent',
  },
});
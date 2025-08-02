import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  testID,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 32;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 24;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = colors.accent;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = colors.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        break;
      default: // primary
        // Will use gradient
        break;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
      default: // medium
        baseStyle.fontSize = 16;
    }

    // Variant text colors
    switch (variant) {
      case 'outline':
      case 'text':
        baseStyle.color = colors.primary;
        break;
      default: // primary, secondary
        baseStyle.color = '#FFFFFF';
    }

    return baseStyle;
  };

  const buttonStyle = getButtonStyle();
  const buttonTextStyle = getTextStyle();

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color={variant === 'primary' ? '#FFFFFF' : colors.primary} />;
    }
    
    return (
      <View style={styles.contentContainer}>
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
        <Text style={[buttonTextStyle, textStyle]}>{title}</Text>
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
    );
  };

  // For primary buttons, use gradient background
  if (variant === 'primary' && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[styles.container, style]}
        activeOpacity={0.8}
        testID={testID}
        {...rest}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[buttonStyle, styles.gradient]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[buttonStyle, style]}
      activeOpacity={0.8}
      testID={testID}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginHorizontal: 4,
  },
});
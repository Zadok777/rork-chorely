import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';

interface FamilyCodeDisplayProps {
  code: string;
  familyName: string;
}

export const FamilyCodeDisplay: React.FC<FamilyCodeDisplayProps> = ({ 
  code,
  familyName
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedCode = code.split('').join(' ');

  return (
    <Card glassmorphism style={styles.container} testID="family-code-display">
      <Text style={styles.title}>Your Family Code</Text>
      <Text style={styles.subtitle}>{familyName}</Text>
      
      <View style={styles.codeContainer}>
        <Text style={styles.code}>{formattedCode}</Text>
        <TouchableOpacity 
          onPress={copyToClipboard} 
          style={styles.copyButton}
          testID="copy-code-button"
        >
          {copied ? (
            <Check size={24} color={colors.success} />
          ) : (
            <Copy size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
      
      <Text style={styles.instructions}>
        Share this code with your family members so they can join your family group.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    width: '100%',
  },
  code: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: colors.primary,
  },
  copyButton: {
    marginLeft: 16,
    padding: 8,
  },
  instructions: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
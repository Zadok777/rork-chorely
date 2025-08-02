import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import { FamilyMember } from '@/types/auth';
import { colors } from '@/constants/colors';

interface ChildProfileItemProps {
  child: FamilyMember;
  onSelect: (childId: string) => void;
  isSelected: boolean;
}

export const ChildProfileItem: React.FC<ChildProfileItemProps> = ({
  child,
  onSelect,
  isSelected,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onSelect(child.id)}
      testID={`child-profile-${child.id}`}
    >
      <View style={styles.avatarContainer}>
        {child.avatar ? (
          <Image source={{ uri: child.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>{child.name.charAt(0)}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.name}>{child.name}</Text>
      
      {child.age && (
        <Text style={styles.age}>{child.age} years old</Text>
      )}
      
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsLabel}>Points</Text>
        <Text style={styles.pointsValue}>{child.points}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: 150,
    marginHorizontal: 8,
    marginBottom: 16,
    shadowColor: colors.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderAvatar: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  age: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  pointsContainer: {
    backgroundColor: colors.background,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
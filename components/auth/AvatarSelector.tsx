import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';

// Default avatar options
const defaultAvatars = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100',
  'https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?q=80&w=100',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100',
  'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=100',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100',
];

interface AvatarSelectorProps {
  selectedAvatar: string | undefined;
  onSelectAvatar: (avatar: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({ 
  selectedAvatar, 
  onSelectAvatar 
}) => {
  return (
    <View style={styles.container} testID="avatar-selector">
      <Text style={styles.title}>Choose an Avatar</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.avatarList}
      >
        {defaultAvatars.map((avatar, index) => (
          <TouchableOpacity
            key={`avatar-${index}`}
            style={[
              styles.avatarOption,
              selectedAvatar === avatar && styles.selectedAvatarOption
            ]}
            onPress={() => onSelectAvatar(avatar)}
            testID={`avatar-option-${index}`}
          >
            <Image
              source={{ uri: avatar }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: colors.text,
  },
  avatarList: {
    paddingVertical: 8,
  },
  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 2,
  },
  selectedAvatarOption: {
    borderColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
});
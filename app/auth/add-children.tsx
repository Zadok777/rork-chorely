import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { router } from 'expo-router';
import { UserPlus, Edit, Trash2 } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AvatarSelector } from '@/components/auth/AvatarSelector';
import { useAuthStore } from '@/store/authStore';
import { FamilyMember } from '@/types/auth';
import { colors } from '@/constants/colors';

export default function AddChildrenScreen() {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(undefined);
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  
  const { 
    family, 
    familyMembers, 
    addFamilyMember, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();

  useEffect(() => {
    // Redirect if no family
    if (!family) {
      router.replace('/');
    }
  }, [family]);

  const validate = () => {
    let isValid = true;
    
    if (!childName.trim()) {
      setNameError('Child name is required');
      isValid = false;
    }
    
    if (childAge && (isNaN(Number(childAge)) || Number(childAge) <= 0 || Number(childAge) > 18)) {
      setAgeError('Please enter a valid age (1-18)');
      isValid = false;
    }
    
    return isValid;
  };

  const handleAddChild = async () => {
    clearError();
    setNameError('');
    setAgeError('');
    
    if (!validate()) {
      return;
    }
    
    try {
      await addFamilyMember(
        childName, 
        childAge ? Number(childAge) : undefined, 
        selectedAvatar
      );
      
      // Reset form
      setChildName('');
      setChildAge('');
      setSelectedAvatar(undefined);
    } catch (err) {
      console.error('Add child error:', err);
    }
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  const children = familyMembers.filter(member => member.role === 'child');

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
          <Text style={styles.title}>Add Children to Your Family</Text>
          <Text style={styles.subtitle}>
            Create profiles for your children so they can log in and track their chores
          </Text>
          
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Add a Child</Text>
            
            <Input
              label="Child's Name"
              placeholder="Enter name"
              value={childName}
              onChangeText={(text) => {
                setChildName(text);
                if (nameError) {
                  setNameError('');
                }
              }}
              error={nameError}
              testID="child-name-input"
            />
            
            <Input
              label="Age (Optional)"
              placeholder="Enter age"
              value={childAge}
              onChangeText={(text) => {
                setChildAge(text);
                if (ageError) {
                  setAgeError('');
                }
              }}
              keyboardType="number-pad"
              error={ageError}
              testID="child-age-input"
            />
            
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <Button
              title="Add Child"
              onPress={handleAddChild}
              isLoading={isLoading}
              style={styles.button}
              leftIcon={<UserPlus size={20} color="#FFFFFF" />}
              testID="add-child-button"
            />
          </Card>
          
          {children.length > 0 && (
            <Card style={styles.childrenCard}>
              <Text style={styles.cardTitle}>Your Children</Text>
              
              <FlatList
                data={children}
                renderItem={({ item }) => (
                  <View style={styles.childItem}>
                    <View style={styles.childInfo}>
                      {item.avatar && (
                        <View style={styles.avatarContainer}>
                          <View style={styles.avatar}>
                            {/* Avatar image would go here */}
                          </View>
                        </View>
                      )}
                      <View>
                        <Text style={styles.childName}>{item.name}</Text>
                        {item.age && (
                          <Text style={styles.childAge}>{item.age} years old</Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.childActions}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Edit size={20} color={colors.textLight} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Trash2 size={20} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </Card>
          )}
          
          <Button
            title={children.length > 0 ? "Finish Setup" : "Skip for Now"}
            onPress={handleFinish}
            variant={children.length > 0 ? "primary" : "outline"}
            size="large"
            style={styles.finishButton}
            testID="finish-button"
          />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
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
  card: {
    padding: 24,
    marginBottom: 24,
  },
  childrenCard: {
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  finishButton: {
    marginBottom: 32,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  childName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  childAge: {
    fontSize: 14,
    color: colors.textLight,
  },
  childActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
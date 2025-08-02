import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, Family, FamilyMember, User } from '@/types/auth';

// Mock functions for now - will be replaced with actual Supabase calls
const mockGenerateFamilyCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let code = '';
  
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
};

interface AuthStore extends AuthState {
  // Auth actions
  registerParent: (email: string, password: string, familyName: string) => Promise<void>;
  loginParent: (email: string, password: string) => Promise<void>;
  loginChild: (familyCode: string, memberId: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Family management
  createFamily: (name: string) => Promise<Family>;
  addFamilyMember: (name: string, age?: number, avatar?: string) => Promise<FamilyMember>;
  getFamilyByCode: (code: string) => Promise<Family | null>;
  getFamilyMembers: (familyId: string) => Promise<FamilyMember[]>;
  
  // Session management
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  family: null,
  familyMembers: [],
  isLoading: false,
  error: null,

  registerParent: async (email, password, familyName) => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Replace with actual Supabase auth
      // Mock registration for now
      const userId = `user_${Date.now()}`;
      const family = await get().createFamily(familyName);
      
      const user: User = {
        id: userId,
        email,
        role: 'parent',
        familyId: family.id,
      };
      
      // Add the parent as a family member
      const parentMember = await get().addFamilyMember('Parent', undefined, undefined);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('family', JSON.stringify(family));
      
      set({ 
        user,
        family,
        familyMembers: [parentMember],
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to register', 
        isLoading: false 
      });
    }
  },

  loginParent: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // TODO: Replace with actual Supabase auth
      // Mock login for now
      const userId = `user_${Date.now()}`;
      
      const user: User = {
        id: userId,
        email,
        role: 'parent',
        familyId: 'family_123',
      };
      
      const family: Family = {
        id: 'family_123',
        name: 'Smith Family',
        code: 'ABC123',
        createdAt: new Date().toISOString(),
        ownerId: userId,
      };
      
      const familyMembers = await get().getFamilyMembers(family.id);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('family', JSON.stringify(family));
      
      set({ 
        user,
        family,
        familyMembers,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        isLoading: false 
      });
    }
  },

  loginChild: async (familyCode, memberId) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find family by code
      const family = await get().getFamilyByCode(familyCode);
      
      if (!family) {
        throw new Error('Family not found with that code');
      }
      
      // Get family members
      const familyMembers = await get().getFamilyMembers(family.id);
      
      // Find the specific child
      const childMember = familyMembers.find(member => 
        member.id === memberId && member.role === 'child'
      );
      
      if (!childMember) {
        throw new Error('Child not found in this family');
      }
      
      const user: User = {
        id: childMember.id,
        role: 'child',
        familyId: family.id,
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('family', JSON.stringify(family));
      
      set({ 
        user,
        family,
        familyMembers,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('family');
      
      set({ 
        user: null,
        family: null,
        familyMembers: [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout', 
        isLoading: false 
      });
    }
  },

  createFamily: async (name) => {
    // TODO: Replace with actual Supabase call
    const family: Family = {
      id: `family_${Date.now()}`,
      name,
      code: mockGenerateFamilyCode(),
      createdAt: new Date().toISOString(),
      ownerId: get().user?.id || `user_${Date.now()}`,
    };
    
    return family;
  },

  addFamilyMember: async (name, age, avatar) => {
    // TODO: Replace with actual Supabase call
    const member: FamilyMember = {
      id: `member_${Date.now()}`,
      familyId: get().family?.id || '',
      name,
      age,
      avatar,
      role: 'child', // Default to child, parent is created differently
      points: 0,
    };
    
    set(state => ({
      familyMembers: [...state.familyMembers, member]
    }));
    
    return member;
  },

  getFamilyByCode: async (code) => {
    // TODO: Replace with actual Supabase call
    // Mock implementation for now
    if (code === 'ABC123') {
      return {
        id: 'family_123',
        name: 'Smith Family',
        code: 'ABC123',
        createdAt: new Date().toISOString(),
        ownerId: 'user_123',
      };
    }
    
    return null;
  },

  getFamilyMembers: async (familyId) => {
    // TODO: Replace with actual Supabase call
    // Mock implementation for now
    return [
      {
        id: 'member_1',
        familyId,
        name: 'John Smith',
        age: 40,
        role: 'parent' as const,
        points: 0,
      },
      {
        id: 'member_2',
        familyId,
        name: 'Emma Smith',
        age: 10,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100',
        role: 'child' as const,
        points: 120,
      },
      {
        id: 'member_3',
        familyId,
        name: 'Jake Smith',
        age: 8,
        avatar: 'https://images.unsplash.com/photo-1570655652364-2e0a67455ac6?q=80&w=100',
        role: 'child' as const,
        points: 85,
      }
    ];
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      
      // Get from AsyncStorage
      const userJson = await AsyncStorage.getItem('user');
      const familyJson = await AsyncStorage.getItem('family');
      
      if (userJson && familyJson) {
        const user = JSON.parse(userJson) as User;
        const family = JSON.parse(familyJson) as Family;
        
        // Get family members
        const familyMembers = await get().getFamilyMembers(family.id);
        
        set({ 
          user,
          family,
          familyMembers,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to restore session', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, Family, FamilyMember, User } from '@/types/auth';
import { supabase, generateFamilyCode } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type FamilyRow = Database['public']['Tables']['families']['Row'];
type FamilyMemberRow = Database['public']['Tables']['family_members']['Row'];

// Helper functions to convert database rows to app types
const convertFamilyRow = (row: FamilyRow): Family => ({
  id: row.id,
  name: row.name,
  code: row.family_code,
  createdAt: row.created_at,
  ownerId: row.created_by,
});

const convertFamilyMemberRow = (row: FamilyMemberRow): FamilyMember => ({
  id: row.id,
  familyId: row.family_id,
  name: row.display_name,
  age: row.age || undefined,
  avatar: row.avatar_url || undefined,
  role: row.role,
  points: row.points,
});

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
      console.log('Starting parent registration for:', email);
      
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }
      if (!authData.user) {
        console.error('No user returned from signup');
        throw new Error('Failed to create user');
      }
      
      const userId = authData.user.id;
      console.log('User created with ID:', userId);
      
      // Create family with generated code
      let familyCode = generateFamilyCode();
      let attempts = 0;
      let family: Family;
      
      // Ensure unique family code
      while (attempts < 10) {
        const { data: existingFamily } = await supabase
          .from('families')
          .select('id')
          .eq('family_code', familyCode)
          .single();
        
        if (!existingFamily) break;
        familyCode = generateFamilyCode();
        attempts++;
      }
      
      console.log('Generated unique family code:', familyCode);
      
      // Insert family
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({
          name: familyName,
          family_code: familyCode,
          created_by: userId,
        })
        .select()
        .single();
      
      if (familyError) {
        console.error('Family creation error:', familyError);
        // Try to clean up the auth user if family creation fails
        try {
          await supabase.auth.signOut();
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        throw new Error(`Failed to create family: ${familyError.message}`);
      }
      if (!familyData) {
        console.error('No family data returned');
        throw new Error('Failed to create family - no data returned');
      }
      
      family = convertFamilyRow(familyData);
      console.log('Family created with ID:', family.id);
      
      // Add parent as family member
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: family.id,
          user_id: userId,
          role: 'parent' as const,
          display_name: email.split('@')[0] || 'Parent',
          points: 0,
          level: 1,
        })
        .select()
        .single();
      
      if (memberError) {
        console.error('Family member creation error:', memberError);
        // Try to clean up family and auth user if member creation fails
        try {
          await supabase.from('families').delete().eq('id', family.id);
          await supabase.auth.signOut();
        } catch (cleanupError) {
          console.error('Failed to cleanup after member creation error:', cleanupError);
        }
        throw new Error(`Failed to create family member: ${memberError.message}`);
      }
      if (!memberData) {
        console.error('No member data returned');
        throw new Error('Failed to create family member - no data returned');
      }
      
      const parentMember = convertFamilyMemberRow(memberData);
      console.log('Parent member created with ID:', parentMember.id);
      
      const user: User = {
        id: userId,
        email,
        role: 'parent',
        familyId: family.id,
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('family', JSON.stringify(family));
      
      console.log('Registration completed successfully');
      set({ 
        user,
        family,
        familyMembers: [parentMember],
        isLoading: false 
      });
    } catch (error) {
      console.error('Registration error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to register', 
        isLoading: false 
      });
    }
  },

  loginParent: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      console.log('Starting parent login for:', email);
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (authError) {
        console.error('Auth login error:', authError);
        throw authError;
      }
      if (!authData.user) {
        console.error('No user returned from login');
        throw new Error('Failed to authenticate');
      }
      
      const userId = authData.user.id;
      console.log('User authenticated with ID:', userId);
      
      // First, get the family member record for this user
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'parent')
        .single();
      
      if (memberError) {
        console.error('Family member lookup error:', memberError);
        throw new Error(`No family found for this account. Error: ${memberError.message}`);
      }
      if (!memberData) {
        console.error('No family member data found for user:', userId);
        throw new Error('Family member not found');
      }
      
      console.log('Found family member:', memberData);
      
      // Now get the family data
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('id', memberData.family_id)
        .single();
      
      if (familyError) {
        console.error('Family lookup error:', familyError);
        throw new Error(`Family not found. Error: ${familyError.message}`);
      }
      if (!familyData) {
        console.error('No family data found for ID:', memberData.family_id);
        throw new Error('Family data not found');
      }
      
      const family = convertFamilyRow(familyData);
      console.log('Found family:', family);
      
      // Get all family members
      const familyMembers = await get().getFamilyMembers(family.id);
      console.log('Found family members:', familyMembers.length);
      
      const user: User = {
        id: userId,
        email,
        role: 'parent',
        familyId: family.id,
      };
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('family', JSON.stringify(family));
      
      console.log('Login completed successfully');
      set({ 
        user,
        family,
        familyMembers,
        isLoading: false 
      });
    } catch (error) {
      console.error('Login error:', error);
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
      
      // Save to AsyncStorage (custom session for children)
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('family', JSON.stringify(family));
      
      set({ 
        user,
        family,
        familyMembers,
        isLoading: false 
      });
    } catch (error) {
      console.error('Child login error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      
      // Sign out from Supabase if it's a parent (authenticated user)
      const { user } = get();
      if (user?.role === 'parent') {
        await supabase.auth.signOut();
      }
      
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
      console.error('Logout error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout', 
        isLoading: false 
      });
    }
  },

  createFamily: async (name) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');
    
    // Generate unique family code
    let familyCode = generateFamilyCode();
    let attempts = 0;
    
    while (attempts < 10) {
      const { data: existingFamily } = await supabase
        .from('families')
        .select('id')
        .eq('family_code', familyCode)
        .single();
      
      if (!existingFamily) break;
      familyCode = generateFamilyCode();
      attempts++;
    }
    
    // Insert family
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .insert({
        name,
        family_code: familyCode,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (familyError) throw familyError;
    if (!familyData) throw new Error('Failed to create family');
    
    return convertFamilyRow(familyData);
  },

  addFamilyMember: async (name, age, avatar) => {
    const { family } = get();
    if (!family) throw new Error('No family found');
    
    // Insert family member
    const { data: memberData, error: memberError } = await supabase
      .from('family_members')
      .insert({
        family_id: family.id,
        role: 'child',
        display_name: name,
        age: age || null,
        avatar_url: avatar || null,
        points: 0,
        level: 1,
      })
      .select()
      .single();
    
    if (memberError) throw memberError;
    if (!memberData) throw new Error('Failed to create family member');
    
    const member = convertFamilyMemberRow(memberData);
    
    set(state => ({
      familyMembers: [...state.familyMembers, member]
    }));
    
    return member;
  },

  getFamilyByCode: async (code) => {
    const { data: familyData, error } = await supabase
      .from('families')
      .select('*')
      .eq('family_code', code.toUpperCase())
      .single();
    
    if (error || !familyData) {
      return null;
    }
    
    return convertFamilyRow(familyData);
  },

  getFamilyMembers: async (familyId) => {
    const { data: membersData, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching family members:', error);
      return [];
    }
    
    return membersData?.map(convertFamilyMemberRow) || [];
  },

  restoreSession: async () => {
    try {
      set({ isLoading: true });
      
      // Check for existing Supabase session first (for parents)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Found existing Supabase session for user:', session.user.id);
        
        // Parent session - validate with database
        const { data: memberData, error: memberError } = await supabase
          .from('family_members')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('role', 'parent')
          .single();
        
        if (!memberError && memberData) {
          console.log('Found family member data:', memberData);
          
          // Get family data separately
          const { data: familyData, error: familyError } = await supabase
            .from('families')
            .select('*')
            .eq('id', memberData.family_id)
            .single();
          
          if (!familyError && familyData) {
            const family = convertFamilyRow(familyData);
            const familyMembers = await get().getFamilyMembers(family.id);
            
            const user: User = {
              id: session.user.id,
              email: session.user.email,
              role: 'parent',
              familyId: family.id,
            };
            
            // Update AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await AsyncStorage.setItem('family', JSON.stringify(family));
            
            console.log('Session restored successfully');
            set({ user, family, familyMembers, isLoading: false });
            return;
          } else {
            console.error('Failed to get family data:', familyError);
          }
        } else {
          console.error('Failed to get family member data:', memberError);
        }
      }
      
      // Check AsyncStorage for child sessions or fallback
      const userJson = await AsyncStorage.getItem('user');
      const familyJson = await AsyncStorage.getItem('family');
      
      if (userJson && familyJson) {
        const user = JSON.parse(userJson) as User;
        const family = JSON.parse(familyJson) as Family;
        
        // Validate family still exists
        const validFamily = await get().getFamilyByCode(family.code);
        if (!validFamily) {
          // Family no longer exists, clear session
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('family');
          set({ isLoading: false });
          return;
        }
        
        // Get fresh family members
        const familyMembers = await get().getFamilyMembers(family.id);
        
        // For child users, validate they still exist in the family
        if (user.role === 'child') {
          const childExists = familyMembers.find(member => 
            member.id === user.id && member.role === 'child'
          );
          
          if (!childExists) {
            // Child no longer exists, clear session
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('family');
            set({ isLoading: false });
            return;
          }
        }
        
        set({ 
          user,
          family: validFamily,
          familyMembers,
          isLoading: false 
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Session restore error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to restore session', 
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
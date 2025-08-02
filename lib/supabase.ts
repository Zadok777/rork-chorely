import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://hagilplrzadzzbbihgel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZ2lscGxyemFkenpiYmloZ2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NjkzNDIsImV4cCI6MjA2OTU0NTM0Mn0.H3wjzZvDMsmi5kZWo0K5w9sykgUYT0fnH3U5NkEuPXU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types based on the schema
export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          family_code: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          family_code?: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          family_code?: string;
          created_by?: string;
          created_at?: string;
        };
      };
      family_members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string | null;
          role: 'parent' | 'child';
          display_name: string;
          points: number;
          level: number;
          age: number | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id?: string | null;
          role: 'parent' | 'child';
          display_name: string;
          points?: number;
          level?: number;
          age?: number | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          user_id?: string | null;
          role?: 'parent' | 'child';
          display_name?: string;
          points?: number;
          level?: number;
          age?: number | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      chores: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          description: string | null;
          points: number;
          assigned_to: string | null;
          created_by: string;
          due_date: string | null;
          status: 'pending' | 'completed' | 'verified';
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          description?: string | null;
          points: number;
          assigned_to?: string | null;
          created_by: string;
          due_date?: string | null;
          status?: 'pending' | 'completed' | 'verified';
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          title?: string;
          description?: string | null;
          points?: number;
          assigned_to?: string | null;
          created_by?: string;
          due_date?: string | null;
          status?: 'pending' | 'completed' | 'verified';
          created_at?: string;
        };
      };
      chore_completions: {
        Row: {
          id: string;
          chore_id: string;
          completed_by: string;
          photo_url: string | null;
          notes: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          chore_id: string;
          completed_by: string;
          photo_url?: string | null;
          notes?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          chore_id?: string;
          completed_by?: string;
          photo_url?: string | null;
          notes?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
        };
      };
      rewards: {
        Row: {
          id: string;
          family_id: string;
          title: string;
          description: string | null;
          cost: number;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          title: string;
          description?: string | null;
          cost: number;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          title?: string;
          description?: string | null;
          cost?: number;
          created_by?: string;
          created_at?: string;
        };
      };
      reward_redemptions: {
        Row: {
          id: string;
          reward_id: string;
          redeemed_by: string;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reward_id: string;
          redeemed_by: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reward_id?: string;
          redeemed_by?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Helper function to generate family codes
export const generateFamilyCode = (): string => {
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
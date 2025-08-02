export interface User {
  id: string;
  email?: string;
  role: 'parent' | 'child';
  familyId?: string;
}

export interface Family {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  ownerId: string;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  age?: number;
  avatar?: string;
  role: 'parent' | 'child';
  points: number;
}

export interface AuthState {
  user: User | null;
  family: Family | null;
  familyMembers: FamilyMember[];
  isLoading: boolean;
  error: string | null;
}
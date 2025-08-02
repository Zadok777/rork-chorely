export interface Chore {
  id: string;
  familyId: string;
  title: string;
  description: string;
  points: number;
  assignedTo: string; // familyMemberId
  dueDate: string;
  status: 'pending' | 'completed' | 'verified';
  createdAt: string;
  createdBy: string; // familyMemberId
}

export interface ChoreCompletion {
  id: string;
  choreId: string;
  completedBy: string; // familyMemberId
  completedAt: string;
  photoUrl?: string;
  verifiedBy?: string; // familyMemberId
  verifiedAt?: string;
}
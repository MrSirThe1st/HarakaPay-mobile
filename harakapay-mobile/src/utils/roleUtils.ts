// Simple role utilities for mobile app (parents only)
export type UserRole = 'parent';

// Check if user is a parent (all mobile users are parents)
export function isParent(role: string): boolean {
  return role === 'parent';
}

// Check if user is authenticated (has a profile)
export function isAuthenticated(user: any): boolean {
  return !!user;
}

// Mobile app permissions (all parents have these)
export const PARENT_PERMISSIONS = [
  'view_schools',
  'view_students', 
  'view_payments',
  'make_payments',
  'view_own_children'
] as const;

// Check if parent can perform operation (all parents can do everything in mobile)
export function canPerformOperation(operation: string): boolean {
  return PARENT_PERMISSIONS.includes(operation as any);
}

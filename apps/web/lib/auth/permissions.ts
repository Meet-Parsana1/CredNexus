import { UserRole } from './config';

export type Permission = 
  | 'view_schemes'
  | 'calculate_emi'
  | 'submit_application'
  | 'manage_schemes'
  | 'manage_partners'
  | 'manage_users'
  | 'sync_data'
  | 'view_admin_metrics';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  beneficiary: [
    'view_schemes',
    'calculate_emi',
    'submit_application',
  ],
  partner: [
    'view_schemes',
    'calculate_emi',
    'submit_application',
  ],
  admin: [
    'view_schemes',
    'calculate_emi',
    'submit_application',
    'manage_schemes',
    'manage_partners',
    'manage_users',
    'sync_data',
    'view_admin_metrics',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

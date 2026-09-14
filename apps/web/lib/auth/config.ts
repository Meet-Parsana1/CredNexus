export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'crednexus-dev-secret-key-change-in-production',
  tokenExpiryDays: 7,
  cookieName: 'crednexus_auth_token',
  roles: ['beneficiary', 'partner', 'admin'] as const,
  defaultRole: 'beneficiary' as const,
};

export type UserRole = typeof AUTH_CONFIG.roles[number];

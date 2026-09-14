'use client';

import { useAuth as useAuthStore } from '../lib/store/auth';

export function useAuth() {
  return useAuthStore();
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserApplication } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  /** True once localStorage hydration is complete. Use this before redirecting unauthenticated users. */
  isLoaded: boolean;
  login: (email: string, role?: 'user' | 'admin') => void;
  logout: () => void;
  toggleSaveScheme: (schemeId: string) => void;
  isSchemeSaved: (schemeId: string) => boolean;
  applications: UserApplication[];
  submitApplicationDemo: (app: Omit<UserApplication, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_demo_01',
  name: 'Ramesh Patel',
  email: 'ramesh.patel@example.com',
  phone: '+91 98765 43210',
  preferredLanguage: 'en',
  state: 'Gujarat',
  district: 'Ahmedabad',
  category: 'OBC',
  annualIncome: 380000,
  savedSchemeIds: ['sch_nbcfdc_micro', 'sch_pmmy_kishore'],
};

const DEFAULT_APPLICATIONS: UserApplication[] = [
  {
    id: 'app_demo_101',
    schemeId: 'sch_nbcfdc_micro',
    schemeName: 'NBCFDC Micro Finance Scheme',
    partnerId: 'prt_bob_ahmedabad_04',
    partnerName: 'Bank of Baroda - Financial Inclusion Hub',
    projectAmount: 120000,
    purpose: 'Small Business - Textile / Tailoring Modernization',
    status: 'GUIDED_TO_PARTNER',
    statusNotes: 'Document dossier generated. Direct physical verification scheduled at Bank of Baroda branch.',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-10',
    requiredDocuments: [
      { name: 'Aadhaar Card', uploaded: true },
      { name: 'Income Certificate', uploaded: true },
      { name: 'OBC Community Certificate', uploaded: true },
      { name: 'Bank Statement (6 months)', uploaded: false },
    ],
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [applications, setApplications] = useState<UserApplication[]>(DEFAULT_APPLICATIONS);

  useEffect(() => {
    const storedUser = localStorage.getItem('crednexus_user');
    const storedRole = localStorage.getItem('crednexus_role');
    const storedApps = localStorage.getItem('crednexus_apps');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
    if (storedRole === 'admin') {
      setIsAdmin(true);
    }
    if (storedApps) {
      try {
        setApplications(JSON.parse(storedApps));
      } catch {}
    }
    // Mark hydration as complete — guards can now safely redirect
    setIsLoaded(true);
  }, []);

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    if (role === 'admin') {
      setIsAdmin(true);
      localStorage.setItem('crednexus_role', 'admin');
    } else {
      setIsAdmin(false);
      localStorage.setItem('crednexus_role', 'user');
    }
    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email,
      name: role === 'admin' ? 'Priya Sharma (Scheme Officer)' : 'Ramesh Patel',
    };
    setUser(loggedUser);
    localStorage.setItem('crednexus_user', JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('crednexus_user');
    localStorage.removeItem('crednexus_role');
  };

  const toggleSaveScheme = (schemeId: string) => {
    if (!user) return;
    const exists = user.savedSchemeIds.includes(schemeId);
    const newSaved = exists
      ? user.savedSchemeIds.filter((id) => id !== schemeId)
      : [...user.savedSchemeIds, schemeId];

    const updatedUser = { ...user, savedSchemeIds: newSaved };
    setUser(updatedUser);
    localStorage.setItem('crednexus_user', JSON.stringify(updatedUser));
  };

  const isSchemeSaved = (schemeId: string): boolean => {
    return !!user?.savedSchemeIds.includes(schemeId);
  };

  const submitApplicationDemo = (
    appData: Omit<UserApplication, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ) => {
    const newApp: UserApplication = {
      ...appData,
      id: `app_demo_${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      status: 'GUIDED_TO_PARTNER',
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('crednexus_apps', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoaded,
        login,
        logout,
        toggleSaveScheme,
        isSchemeSaved,
        applications,
        submitApplicationDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

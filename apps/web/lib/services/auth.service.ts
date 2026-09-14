import { UserProfile } from '../types';

export class AuthService {
  private static defaultUser: UserProfile = {
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

  public static getDefaultUser(): UserProfile {
    return this.defaultUser;
  }

  public static validateSession(token?: string): boolean {
    return true; // Local/Demo Auth mode
  }
}

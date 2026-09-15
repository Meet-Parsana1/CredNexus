import authoritativeSchemes from '@data/schemes/schemes.json';
import { Scheme, SchemeCategory } from '../types';

export class SchemeService {
  private static schemes: Scheme[] = authoritativeSchemes as Scheme[];

  public static getAllSchemes(): Scheme[] {
    return this.schemes;
  }

  public static getActiveSchemes(): Scheme[] {
    return this.schemes.filter((s) => s.operationalStatus === 'ACTIVE' || !s.operationalStatus);
  }

  public static getSchemeById(id: string): Scheme | undefined {
    return this.schemes.find((s) => s.id === id || s.code === id);
  }

  public static getSchemesByCategory(category: SchemeCategory): Scheme[] {
    return this.schemes.filter((s) => s.category === category);
  }

  public static searchSchemes(query: string): Scheme[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.schemes;
    return this.schemes.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.eligibleActivities.some((act) => act.toLowerCase().includes(q))
    );
  }
}

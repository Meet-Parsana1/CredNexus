import { ChannelPartner } from '../types';

export function validatePartner(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Partner object expected'] };
  }

  const p = data as Partial<ChannelPartner>;
  if (!p.id || typeof p.id !== 'string') errors.push('Partner id is required');
  if (!p.name || typeof p.name !== 'string') errors.push('Partner name is required');
  if (!p.type) errors.push('Partner type is required');
  if (typeof p.lat !== 'number' || typeof p.lng !== 'number') {
    errors.push('Valid top-level numeric coordinates (lat, lng) are required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

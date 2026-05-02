import { createHash } from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
};

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const generateSecureToken = (): string => {
  const { randomBytes } = require('crypto');
  return randomBytes(32).toString('hex');
};

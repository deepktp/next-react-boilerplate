export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

export const isValidSlug = (slug: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export const isValidUUID = (uuid: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

export const sanitizeInput = (input: string): string =>
  input.trim().replace(/[<>]/g, '');

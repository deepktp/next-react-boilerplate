const SENSITIVE_KEYS = new Set([
  'authorization', 'cookie', 'password', 'passwordhash', 'token', 'secret',
  'apikey', 'api_key', 'accesstoken', 'refreshtoken', 'tokenhash',
]);

export function sanitizeForLog(value: unknown, depth = 0): unknown {
  if (depth > 6) return '[MaxDepth]';
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') {
    return value.length > 10000 ? value.slice(0, 10000) + '...[truncated]' : value;
  }
  if (Array.isArray(value)) {
    const arr = value.slice(0, 50).map((v) => sanitizeForLog(v, depth + 1));
    if (value.length > 50) arr.push(`...[${value.length - 50} more items]`);
    return arr;
  }
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      result[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : sanitizeForLog(v, depth + 1);
    }
    return result;
  }
  return value;
}

export function sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(headers)) {
    result[k] = SENSITIVE_KEYS.has(k.toLowerCase()) ? '[REDACTED]' : v;
  }
  return result;
}

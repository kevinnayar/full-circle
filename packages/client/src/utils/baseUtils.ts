export function formatError(error: any, fallback?: string): string {
  if (typeof error === 'object' && 'message' in error) return error.message.toString();
  if (typeof error === 'string') return error;
  return fallback || 'An unkown error occurred';
}

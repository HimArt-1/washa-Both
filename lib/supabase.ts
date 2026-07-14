import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility to convert snake_case object to camelCase object
export function toCamelCaseObj(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCaseObj(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelKey] = toCamelCaseObj(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Utility to convert camelCase object to snake_case object
export function toSnakeCaseObj(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCaseObj(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCaseObj(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

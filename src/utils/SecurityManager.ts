import { z } from 'zod';

// Input validation schemas using Zod
export const validationSchemas = {
  demographics: z.object({
    age: z.number().min(15).max(100),
    weight: z.number().min(30).max(300),
    height: z.number().min(120).max(220),
    gender: z.enum(['M', 'F']),
  }),
  
  bodyComposition: z.object({
    bodyFat: z.number().min(3).max(50),
    weight: z.number().min(30).max(300),
  }),
  
  performance: z.object({
    weight: z.number().min(0).max(1000),
    reps: z.number().min(1).max(100),
    exercise: z.string().min(1).max(100),
  }),
  
  nutrition: z.object({
    calories: z.number().min(0).max(10000),
    protein: z.number().min(0).max(500),
    carbs: z.number().min(0).max(1000),
    fat: z.number().min(0).max(300),
  }),
  
  textInput: z.string().max(1000).regex(/^[a-zA-Z0-9\s\-_.àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]*$/, 'Invalid characters detected'),
};

// Input sanitization
export class InputSanitizer {
  static sanitizeText(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .trim()
      .slice(0, 1000);
  }
  
  static sanitizeNumber(input: number, min: number, max: number): number {
    if (isNaN(input) || !isFinite(input)) return min;
    return Math.max(min, Math.min(max, input));
  }
  
  static validateAndSanitize<T>(data: unknown, schema: z.ZodSchema<T>): T | null {
    try {
      return schema.parse(data);
    } catch (error) {
      console.warn('Validation failed:', error);
      return null;
    }
  }
}

// Client-side encryption for sensitive data
export class DataEncryption {
  private static async getKey(): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('FitMaster-2024-Security-Key'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('secure-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  static async encryptData(data: string): Promise<string> {
    try {
      const key = await this.getKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);
      
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );
      
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.warn('Encryption failed, using plaintext:', error);
      return data;
    }
  }
  
  static async decryptData(encryptedData: string): Promise<string> {
    try {
      const key = await this.getKey();
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);
      
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.warn('Decryption failed, returning as-is:', error);
      return encryptedData;
    }
  }
}

// Rate limiting for API calls
export class RateLimiter {
  private static instances = new Map<string, RateLimiter>();
  private requests: number[] = [];
  
  constructor(private maxRequests: number, private windowMs: number) {}
  
  static getInstance(key: string, maxRequests = 10, windowMs = 60000): RateLimiter {
    if (!this.instances.has(key)) {
      this.instances.set(key, new RateLimiter(maxRequests, windowMs));
    }
    return this.instances.get(key)!;
  }
  
  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
  
  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

// Security event monitoring
export class SecurityMonitor {
  private static events: Array<{ type: string; timestamp: number; details: Record<string, unknown> }> = [];
  
  static logSecurityEvent(type: string, details: Record<string, unknown> = {}): void {
    this.events.push({
      type,
      timestamp: Date.now(),
      details
    });
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }
    
    // Log suspicious activity
    if (type === 'validation_failure' || type === 'rate_limit_exceeded') {
      console.warn(`Security event: ${type}`, details);
    }
  }
  
  static getSecurityEvents(): Array<{ type: string; timestamp: number; details: Record<string, unknown> }> {
    return [...this.events];
  }
  
  static clearEvents(): void {
    this.events.length = 0;
  }
}

// Secure data clearing
export class SecureDataCleaner {
  static async secureWipe(key: string): Promise<void> {
    // Overwrite with random data multiple times
    for (let i = 0; i < 3; i++) {
      const randomData = Array.from(
        { length: 1000 },
        () => Math.random().toString(36)
      ).join('');
      
      try {
        localStorage.setItem(key, randomData);
      } catch (error) {
        // Continue with cleanup even if overwrite fails
      }
    }
    
    localStorage.removeItem(key);
  }
  
  static async secureWipeAll(): Promise<void> {
    const keys = Object.keys(localStorage);
    const fitMasterKeys = keys.filter(key => 
      key.startsWith('fitmaster_') || 
      key.includes('profile') || 
      key.includes('tracking')
    );
    
    for (const key of fitMasterKeys) {
      await this.secureWipe(key);
    }
  }
}

// Data integrity verification
export class DataIntegrity {
  static async generateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const hash = await window.crypto.subtle.digest('SHA-256', encoder.encode(data));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  static async verifyData(data: string, checksum: string): Promise<boolean> {
    const currentChecksum = await this.generateChecksum(data);
    return currentChecksum === checksum;
  }
}



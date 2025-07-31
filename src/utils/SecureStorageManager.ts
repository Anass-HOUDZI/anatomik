import { UserProfile, Demographics, FitnessGoals, UserPreferences, AppSettings } from '../types';
import { DataEncryption, DataIntegrity, SecurityMonitor, SecureDataCleaner, InputSanitizer } from './SecurityManager';

// On ajoute le type SleepEntry pour typings solides (copié de SleepTracker)
type SleepEntry = {
  date: string;        // AAAA-MM-JJ
  bedtime: string;     // HH:MM
  wakeup: string;      // HH:MM
  duration: number;    // heures décimal (calculé)
  quality: number;     // 1-10
  notes?: string;
};

// Ajout de FatigueEntry pour typings solides (copié du tracker)
type FatigueEntry = {
  date: string;
  fatigue: number;
  soreness: number;
  motivation: number;
  notes?: string;
};

// Ajout de sleep ici
export interface TrackingData {
  weight: Array<{ date: string; value: number }>;
  measurements: Record<string, Array<{ date: string; value: number }>>;
  workouts: Array<{ date: string; exercises: any[] }>;
  nutrition: Array<{ date: string; calories: number; macros: any }>;
  hydration?: Array<{ date: string; value: number; unit: string }>;
  performance?: Record<string, Array<{ date: string; value: number; notes?: string }>>;
  bodyFat?: Array<{ date: string; value: number }>;
  sleep?: SleepEntry[];
  fatigue?: FatigueEntry[];
}

export class SecureStorageManager {
  private static readonly USER_PROFILE_KEY = 'fitmaster_user_profile';
  private static readonly TRACKING_DATA_KEY = 'fitmaster_tracking_data';
  private static readonly SETTINGS_KEY = 'fitmaster_settings';
  private static readonly CHECKSUM_SUFFIX = '_checksum';

  static async init() {
    console.log('SecureStorageManager initialized');
    await this.migrateOldData();
    SecurityMonitor.logSecurityEvent('storage_manager_initialized', {});
  }

  private static async secureGet(key: string): Promise<any> {
    try {
      const encryptedData = localStorage.getItem(key);
      
      if (!encryptedData) return null;

      // Decrypt data
      const decryptedData = await DataEncryption.decryptData(encryptedData);
      
      // Verify data integrity
      const checksumKey = key + this.CHECKSUM_SUFFIX;
      const storedChecksum = localStorage.getItem(checksumKey);
      
      if (storedChecksum) {
        const isValid = await DataIntegrity.verifyData(decryptedData, storedChecksum);
        if (!isValid) {
          SecurityMonitor.logSecurityEvent('data_integrity_failure', { key });
          return null;
        }
      }

      return JSON.parse(decryptedData);
    } catch (error) {
      SecurityMonitor.logSecurityEvent('storage_read_error', { key, error: error.message });
      return null;
    }
  }

  private static async secureSet(key: string, data: any): Promise<void> {
    try {
      const serializedData = JSON.stringify(data);
      
      // Generate checksum
      const checksum = await DataIntegrity.generateChecksum(serializedData);
      
      // Encrypt data
      const encryptedData = await DataEncryption.encryptData(serializedData);
      
      const checksumKey = key + this.CHECKSUM_SUFFIX;
      
      localStorage.setItem(key, encryptedData);
      localStorage.setItem(checksumKey, checksum);
      
      SecurityMonitor.logSecurityEvent('data_stored', { key });
    } catch (error) {
      SecurityMonitor.logSecurityEvent('storage_write_error', { key, error: error.message });
      throw error;
    }
  }

  // User Profile Management
  static async getUserProfile(): Promise<UserProfile | null> {
    return await this.secureGet(this.USER_PROFILE_KEY);
  }

  static async saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
    try {
      // Sanitize input data
      const sanitizedProfile = this.sanitizeProfileData(profile);
      
      const existing = await this.getUserProfile() || { 
        id: 'user_1',
        demographics: {
          age: 30,
          gender: 'M' as const,
          weight: 70,
          height: 175,
          activityLevel: 'moderate' as const
        },
        goals: {
          primary: 'maintenance' as const,
          timeline: 12,
          targetWeight: 70,
          specificGoals: []
        },
        preferences: {
          units: 'metric' as const,
          language: 'fr' as const,
          theme: 'light' as const,
          notifications: true
        },
        settings: {
          autoSave: true,
          dataRetention: 365,
          exportFormat: 'pdf' as const,
          privacyMode: false
        },
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      
      const updated = {
        ...existing,
        ...sanitizedProfile,
        updatedAt: new Date()
      };
      
      await this.secureSet(this.USER_PROFILE_KEY, updated);
      console.log('User profile saved securely');
    } catch (error) {
      SecurityMonitor.logSecurityEvent('profile_save_error', { error: error.message });
      throw error;
    }
  }

  private static sanitizeProfileData(profile: Partial<UserProfile>): Partial<UserProfile> {
    const sanitized: Partial<UserProfile> = {};
    
    if (profile.demographics) {
      sanitized.demographics = {
        age: profile.demographics.age ? InputSanitizer.sanitizeNumber(profile.demographics.age, 15, 100) : undefined,
        weight: profile.demographics.weight ? InputSanitizer.sanitizeNumber(profile.demographics.weight, 30, 300) : undefined,
        height: profile.demographics.height ? InputSanitizer.sanitizeNumber(profile.demographics.height, 120, 220) : undefined,
        gender: profile.demographics.gender,
        activityLevel: profile.demographics.activityLevel
      };
    }
    
    if (profile.goals && typeof profile.goals === 'object') {
      sanitized.goals = profile.goals;
    }
    
    if (profile.preferences && typeof profile.preferences === 'object') {
      sanitized.preferences = profile.preferences;
    }
    
    if (profile.settings && typeof profile.settings === 'object') {
      sanitized.settings = profile.settings;
    }
    
    return sanitized;
  }

  // Tracking Data Management
  static async getTrackingData(): Promise<TrackingData> {
    const data = await this.secureGet(this.TRACKING_DATA_KEY);
    return data || {
      weight: [],
      measurements: {},
      workouts: [],
      nutrition: [],
      hydration: [],
      performance: {},
      bodyFat: [],
      sleep: [],
      fatigue: []
    };
  }

  static async saveTrackingData(data: Partial<TrackingData>): Promise<void> {
    try {
      const sanitizedData = this.sanitizeTrackingData(data);
      const existing = await this.getTrackingData();
      
      const updated: TrackingData = {
        weight: sanitizedData.weight ?? existing.weight,
        measurements: sanitizedData.measurements ?? existing.measurements,
        workouts: sanitizedData.workouts ?? existing.workouts,
        nutrition: sanitizedData.nutrition ?? existing.nutrition,
        hydration: sanitizedData.hydration ?? existing.hydration,
        performance: sanitizedData.performance ?? existing.performance,
        bodyFat: sanitizedData.bodyFat ?? existing.bodyFat,
        sleep: sanitizedData.sleep ?? existing.sleep,
        fatigue: sanitizedData.fatigue ?? existing.fatigue
      };
      
      await this.secureSet(this.TRACKING_DATA_KEY, updated);
      console.log('Tracking data saved securely');
    } catch (error) {
      SecurityMonitor.logSecurityEvent('tracking_save_error', { error: error.message });
      throw error;
    }
  }

  private static sanitizeTrackingData(data: Partial<TrackingData>): Partial<TrackingData> {
    const sanitized: Partial<TrackingData> = {};
    
    if (data.weight && Array.isArray(data.weight)) {
      sanitized.weight = data.weight.map(entry => ({
        ...entry,
        value: InputSanitizer.sanitizeNumber(entry.value, 30, 300)
      }));
    }
    
    if (data.performance && typeof data.performance === 'object') {
      sanitized.performance = {};
      Object.entries(data.performance).forEach(([key, entries]) => {
        if (Array.isArray(entries)) {
          sanitized.performance![key] = entries.map(entry => ({
            ...entry,
            value: InputSanitizer.sanitizeNumber(entry.value, 0, 1000),
            notes: entry.notes ? InputSanitizer.sanitizeText(entry.notes) : undefined
          }));
        }
      });
    }
    
    if (data.bodyFat && Array.isArray(data.bodyFat)) {
      sanitized.bodyFat = data.bodyFat.map(entry => ({
        ...entry,
        value: InputSanitizer.sanitizeNumber(entry.value, 3, 50)
      }));
    }
    
    // Copy other arrays with basic validation
    if (data.measurements) sanitized.measurements = data.measurements;
    if (data.workouts) sanitized.workouts = data.workouts;
    if (data.nutrition) sanitized.nutrition = data.nutrition;
    if (data.hydration) sanitized.hydration = data.hydration;
    if (data.sleep) sanitized.sleep = data.sleep;
    if (data.fatigue) sanitized.fatigue = data.fatigue;
    
    return sanitized;
  }

  static async addWeightEntry(weight: number, date: string = new Date().toISOString()): Promise<void> {
    const sanitizedWeight = InputSanitizer.sanitizeNumber(weight, 30, 300);
    
    const trackingData = await this.getTrackingData();
    trackingData.weight.push({ date, value: sanitizedWeight });
    trackingData.weight.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    await this.saveTrackingData({ weight: trackingData.weight });
  }

  static async addMeasurementEntry(measurement: string, value: number, date: string = new Date().toISOString()): Promise<void> {
    const sanitizedMeasurement = InputSanitizer.sanitizeText(measurement);
    const sanitizedValue = InputSanitizer.sanitizeNumber(value, 0, 300);
    
    const trackingData = await this.getTrackingData();
    if (!trackingData.measurements[sanitizedMeasurement]) {
      trackingData.measurements[sanitizedMeasurement] = [];
    }
    trackingData.measurements[sanitizedMeasurement].push({ date, value: sanitizedValue });
    trackingData.measurements[sanitizedMeasurement].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    await this.saveTrackingData({ measurements: trackingData.measurements });
  }

  // Settings Management
  static async getSettings(): Promise<UserPreferences> {
    const data = await this.secureGet(this.SETTINGS_KEY);
    return data || {
      units: 'metric',
      language: 'fr',
      theme: 'light',
      notifications: true
    };
  }

  static async saveSettings(settings: Partial<UserPreferences>): Promise<void> {
    try {
      const existing = await this.getSettings();
      const updated = { ...existing, ...settings };
      await this.secureSet(this.SETTINGS_KEY, updated);
      console.log('Settings saved securely');
    } catch (error) {
      SecurityMonitor.logSecurityEvent('settings_save_error', { error: error.message });
      throw error;
    }
  }

  // Data Export/Import with enhanced security
  static async exportData(): Promise<string> {
    try {
      const data = {
        userProfile: await this.getUserProfile(),
        trackingData: await this.getTrackingData(),
        settings: await this.getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      
      // Generate checksum for exported data
      const exportString = JSON.stringify(data, null, 2);
      const checksum = await DataIntegrity.generateChecksum(exportString);
      
      const exportData = {
        data,
        checksum
      };
      
      SecurityMonitor.logSecurityEvent('data_exported', { size: exportString.length });
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      SecurityMonitor.logSecurityEvent('export_error', { error: error.message });
      return '';
    }
  }

  static async importData(jsonData: string): Promise<boolean> {
    try {
      const importedData = JSON.parse(jsonData);
      
      // Verify data integrity if checksum is present
      if (importedData.checksum && importedData.data) {
        const dataString = JSON.stringify(importedData.data, null, 2);
        const isValid = await DataIntegrity.verifyData(dataString, importedData.checksum);
        
        if (!isValid) {
          SecurityMonitor.logSecurityEvent('import_integrity_failure', {});
          return false;
        }
        
        const data = importedData.data;
        
        if (data.userProfile) {
          await this.secureSet(this.USER_PROFILE_KEY, data.userProfile);
        }
        
        if (data.trackingData) {
          await this.secureSet(this.TRACKING_DATA_KEY, data.trackingData);
        }
        
        if (data.settings) {
          await this.secureSet(this.SETTINGS_KEY, data.settings);
        }
      } else {
        // Legacy import without checksum
        if (importedData.userProfile) {
          await this.secureSet(this.USER_PROFILE_KEY, importedData.userProfile);
        }
        
        if (importedData.trackingData) {
          await this.secureSet(this.TRACKING_DATA_KEY, importedData.trackingData);
        }
        
        if (importedData.settings) {
          await this.secureSet(this.SETTINGS_KEY, importedData.settings);
        }
      }
      
      SecurityMonitor.logSecurityEvent('data_imported', {});
      console.log('Data imported successfully with security verification');
      return true;
    } catch (error) {
      SecurityMonitor.logSecurityEvent('import_error', { error: error.message });
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data securely
  static async clearAllData(): Promise<void> {
    try {
      await SecureDataCleaner.secureWipe(this.USER_PROFILE_KEY);
      await SecureDataCleaner.secureWipe(this.TRACKING_DATA_KEY);
      await SecureDataCleaner.secureWipe(this.SETTINGS_KEY);
      
      // Also clear checksums
      await SecureDataCleaner.secureWipe(this.USER_PROFILE_KEY + this.CHECKSUM_SUFFIX);
      await SecureDataCleaner.secureWipe(this.TRACKING_DATA_KEY + this.CHECKSUM_SUFFIX);
      await SecureDataCleaner.secureWipe(this.SETTINGS_KEY + this.CHECKSUM_SUFFIX);
      
      SecurityMonitor.logSecurityEvent('all_data_cleared', {});
      console.log('All data cleared securely');
    } catch (error) {
      SecurityMonitor.logSecurityEvent('clear_error', { error: error.message });
      throw error;
    }
  }

  // Migration helper for future updates
  private static async migrateOldData() {
    const version = localStorage.getItem('fitmaster_version');
    if (!version) {
      // Migrate from old StorageManager to secure version
      const oldProfile = localStorage.getItem('fitmaster_user_profile');
      const oldTracking = localStorage.getItem('fitmaster_tracking_data');
      const oldSettings = localStorage.getItem('fitmaster_settings');
      
      if (oldProfile && !localStorage.getItem(this.USER_PROFILE_KEY + this.CHECKSUM_SUFFIX)) {
        const profile = JSON.parse(oldProfile);
        await this.secureSet(this.USER_PROFILE_KEY, profile);
      }
      
      if (oldTracking && !localStorage.getItem(this.TRACKING_DATA_KEY + this.CHECKSUM_SUFFIX)) {
        const tracking = JSON.parse(oldTracking);
        await this.secureSet(this.TRACKING_DATA_KEY, tracking);
      }
      
      if (oldSettings && !localStorage.getItem(this.SETTINGS_KEY + this.CHECKSUM_SUFFIX)) {
        const settings = JSON.parse(oldSettings);
        await this.secureSet(this.SETTINGS_KEY, settings);
      }
      
      localStorage.setItem('fitmaster_version', '2.0');
      SecurityMonitor.logSecurityEvent('data_migrated_to_secure', {});
    }
  }
}
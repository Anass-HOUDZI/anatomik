import { UserProfile, Demographics, FitnessGoals, UserPreferences, AppSettings } from '../types';

export interface TrackingData {
  weight: Array<{ date: string; value: number }>;
  measurements: Record<string, Array<{ date: string; value: number }>>;
  workouts: Array<{ date: string; exercises: any[] }>;
  nutrition: Array<{ date: string; calories: number; macros: any }>;
  hydration?: Array<{ date: string; target: number; weight: number; activityLevel: string; climate: string }>;
  performance?: Record<string, Array<{ date: string; value: number; notes?: string }>>; // Ajout pour tracker de perf
}

export class StorageManager {
  private static readonly USER_PROFILE_KEY = 'fitmaster_user_profile';
  private static readonly TRACKING_DATA_KEY = 'fitmaster_tracking_data';
  private static readonly SETTINGS_KEY = 'fitmaster_settings';

  static init() {
    console.log('StorageManager initialized');
    this.migrateOldData();
  }

  // User Profile Management
  static getUserProfile(): UserProfile | null {
    try {
      const data = localStorage.getItem(this.USER_PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  static saveUserProfile(profile: Partial<UserProfile>) {
    try {
      const existing = this.getUserProfile() || { 
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
        ...profile,
        updatedAt: new Date()
      };
      
      localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(updated));
      console.log('User profile saved');
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Tracking Data Management
  static getTrackingData(): TrackingData {
    try {
      const data = localStorage.getItem(this.TRACKING_DATA_KEY);
      return data ? JSON.parse(data) : {
        weight: [],
        measurements: {},
        workouts: [],
        nutrition: [],
        hydration: [],
        performance: {}
      };
    } catch (error) {
      console.error('Error loading tracking data:', error);
      return {
        weight: [],
        measurements: {},
        workouts: [],
        nutrition: [],
        hydration: [],
        performance: {}
      };
    }
  }

  static saveTrackingData(data: Partial<TrackingData>) {
    try {
      const existing = this.getTrackingData();
      const updated = { ...existing, ...data };
      localStorage.setItem(this.TRACKING_DATA_KEY, JSON.stringify(updated));
      console.log('Tracking data saved');
    } catch (error) {
      console.error('Error saving tracking data:', error);
    }
  }

  static addWeightEntry(weight: number, date: string = new Date().toISOString()) {
    const trackingData = this.getTrackingData();
    trackingData.weight.push({ date, value: weight });
    trackingData.weight.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.saveTrackingData(trackingData);
  }

  static addMeasurementEntry(measurement: string, value: number, date: string = new Date().toISOString()) {
    const trackingData = this.getTrackingData();
    if (!trackingData.measurements[measurement]) {
      trackingData.measurements[measurement] = [];
    }
    trackingData.measurements[measurement].push({ date, value });
    trackingData.measurements[measurement].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.saveTrackingData(trackingData);
  }

  // Settings Management
  static getSettings(): UserPreferences {
    try {
      const data = localStorage.getItem(this.SETTINGS_KEY);
      return data ? JSON.parse(data) : {
        units: 'metric',
        language: 'fr',
        theme: 'light',
        notifications: true
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        units: 'metric',
        language: 'fr',
        theme: 'light',
        notifications: true
      };
    }
  }

  static saveSettings(settings: Partial<UserPreferences>) {
    try {
      const existing = this.getSettings();
      const updated = { ...existing, ...settings };
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updated));
      console.log('Settings saved');
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Data Export/Import
  static exportData(): string {
    try {
      const data = {
        userProfile: this.getUserProfile(),
        trackingData: this.getTrackingData(),
        settings: this.getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userProfile) {
        localStorage.setItem(this.USER_PROFILE_KEY, JSON.stringify(data.userProfile));
      }
      
      if (data.trackingData) {
        localStorage.setItem(this.TRACKING_DATA_KEY, JSON.stringify(data.trackingData));
      }
      
      if (data.settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
      }
      
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  static clearAllData() {
    try {
      localStorage.removeItem(this.USER_PROFILE_KEY);
      localStorage.removeItem(this.TRACKING_DATA_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Migration helper for future updates
  private static migrateOldData() {
    // Placeholder for future data migrations
    const version = localStorage.getItem('fitmaster_version');
    if (!version) {
      localStorage.setItem('fitmaster_version', '1.0');
    }
  }
}

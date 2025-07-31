import { Injectable } from '@angular/core';
import { UserProfile, NutritionCalculations, Goal } from '../models/user.model';

export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight: number;
  bodyFatPercentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    biceps?: number;
    thighs?: number;
  };
  photos?: string[]; // Base64 encoded images
  notes?: string;
}

export interface CachedData {
  userProfiles: UserProfile[];
  currentProfileId?: string;
  progressEntries: ProgressEntry[];
  goals: Goal[];
  favoriteMenus: string[];
  settings: {
    theme: 'dark' | 'light';
    units: 'metric' | 'imperial';
    language: 'fr' | 'en';
    notifications: boolean;
  };
  lastSync: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'fitnutri_data';
  private readonly BACKUP_KEY = 'fitnutri_backup';
  
  private cachedData: CachedData = {
    userProfiles: [],
    progressEntries: [],
    goals: [],
    favoriteMenus: [],
    settings: {
      theme: 'dark',
      units: 'metric',
      language: 'fr',
      notifications: true
    },
    lastSync: new Date()
  };

  constructor() {
    this.loadFromStorage();
  }

  // Gestion des profils utilisateur
  saveUserProfile(profile: UserProfile): void {
    const existingIndex = this.cachedData.userProfiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      this.cachedData.userProfiles[existingIndex] = { ...profile, updatedAt: new Date() };
    } else {
      this.cachedData.userProfiles.push(profile);
    }
    
    this.cachedData.currentProfileId = profile.id;
    this.saveToStorage();
  }

  getCurrentProfile(): UserProfile | null {
    if (!this.cachedData.currentProfileId) return null;
    return this.cachedData.userProfiles.find(p => p.id === this.cachedData.currentProfileId) || null;
  }

  getAllProfiles(): UserProfile[] {
    return [...this.cachedData.userProfiles];
  }

  switchProfile(profileId: string): boolean {
    const profile = this.cachedData.userProfiles.find(p => p.id === profileId);
    if (profile) {
      this.cachedData.currentProfileId = profileId;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteProfile(profileId: string): boolean {
    const initialLength = this.cachedData.userProfiles.length;
    this.cachedData.userProfiles = this.cachedData.userProfiles.filter(p => p.id !== profileId);
    
    if (this.cachedData.currentProfileId === profileId) {
      this.cachedData.currentProfileId = this.cachedData.userProfiles[0]?.id;
    }
    
    // Supprimer aussi les données associées
    this.cachedData.progressEntries = this.cachedData.progressEntries.filter(p => p.userId !== profileId);
    this.cachedData.goals = this.cachedData.goals.filter(g => g.userId !== profileId);
    
    this.saveToStorage();
    return this.cachedData.userProfiles.length !== initialLength;
  }

  // Gestion des entrées de progression
  addProgressEntry(entry: Omit<ProgressEntry, 'id'>): ProgressEntry {
    const newEntry: ProgressEntry = {
      ...entry,
      id: this.generateId(),
      date: new Date(entry.date)
    };
    
    this.cachedData.progressEntries.push(newEntry);
    this.cachedData.progressEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.saveToStorage();
    
    return newEntry;
  }

  getProgressEntries(userId: string): ProgressEntry[] {
    return this.cachedData.progressEntries
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  updateProgressEntry(entryId: string, updates: Partial<ProgressEntry>): boolean {
    const index = this.cachedData.progressEntries.findIndex(e => e.id === entryId);
    if (index >= 0) {
      this.cachedData.progressEntries[index] = { ...this.cachedData.progressEntries[index], ...updates };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteProgressEntry(entryId: string): boolean {
    const initialLength = this.cachedData.progressEntries.length;
    this.cachedData.progressEntries = this.cachedData.progressEntries.filter(e => e.id !== entryId);
    this.saveToStorage();
    return this.cachedData.progressEntries.length !== initialLength;
  }

  // Gestion des objectifs
  saveGoals(goals: Goal[]): void {
    // Remplacer tous les objectifs pour l'utilisateur actuel
    const currentUserId = this.cachedData.currentProfileId;
    if (currentUserId) {
      this.cachedData.goals = this.cachedData.goals.filter(g => g.userId !== currentUserId);
      this.cachedData.goals.push(...goals);
      this.saveToStorage();
    }
  }

  getGoals(userId: string): Goal[] {
    return this.cachedData.goals.filter(g => g.userId === userId);
  }

  // Gestion des favoris
  getFavoriteMenus(): string[] {
    return [...this.cachedData.favoriteMenus];
  }

  toggleFavoriteMenu(menuId: string): boolean {
    const index = this.cachedData.favoriteMenus.indexOf(menuId);
    if (index >= 0) {
      this.cachedData.favoriteMenus.splice(index, 1);
      this.saveToStorage();
      return false;
    } else {
      this.cachedData.favoriteMenus.push(menuId);
      this.saveToStorage();
      return true;
    }
  }

  // Gestion des paramètres
  getSettings() {
    return { ...this.cachedData.settings };
  }

  updateSettings(settings: Partial<CachedData['settings']>): void {
    this.cachedData.settings = { ...this.cachedData.settings, ...settings };
    this.saveToStorage();
  }

  // Statistiques et analyses
  getWeightTrend(userId: string, days: number = 30): { date: Date, weight: number }[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.cachedData.progressEntries
      .filter(entry => entry.userId === userId && new Date(entry.date) >= cutoffDate)
      .map(entry => ({ date: new Date(entry.date), weight: entry.weight }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getBodyFatTrend(userId: string, days: number = 30): { date: Date, bodyFat: number }[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.cachedData.progressEntries
      .filter(entry => 
        entry.userId === userId && 
        entry.bodyFatPercentage !== undefined && 
        new Date(entry.date) >= cutoffDate
      )
      .map(entry => ({ date: new Date(entry.date), bodyFat: entry.bodyFatPercentage! }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getProgressSummary(userId: string): {
    totalEntries: number;
    weightChange: number;
    bodyFatChange: number;
    daysTracked: number;
    lastEntry?: ProgressEntry;
  } {
    const entries = this.getProgressEntries(userId);
    
    if (entries.length === 0) {
      return {
        totalEntries: 0,
        weightChange: 0,
        bodyFatChange: 0,
        daysTracked: 0
      };
    }

    const latest = entries[0];
    const oldest = entries[entries.length - 1];
    
    const weightChange = latest.weight - oldest.weight;
    const bodyFatChange = (latest.bodyFatPercentage || 0) - (oldest.bodyFatPercentage || 0);
    
    const daysDiff = Math.ceil(
      (new Date(latest.date).getTime() - new Date(oldest.date).getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      totalEntries: entries.length,
      weightChange,
      bodyFatChange,
      daysTracked: daysDiff,
      lastEntry: latest
    };
  }

  // Sauvegarde et restauration
  private saveToStorage(): void {
    try {
      this.cachedData.lastSync = new Date();
      const dataString = JSON.stringify(this.cachedData);
      localStorage.setItem(this.STORAGE_KEY, dataString);
      
      // Sauvegarde de sécurité
      localStorage.setItem(this.BACKUP_KEY, dataString);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const dataString = localStorage.getItem(this.STORAGE_KEY);
      if (dataString) {
        const parsed = JSON.parse(dataString);
        this.cachedData = {
          ...this.cachedData,
          ...parsed,
          lastSync: new Date(parsed.lastSync)
        };
        
        // Convertir les dates
        this.cachedData.progressEntries = this.cachedData.progressEntries.map(entry => ({
          ...entry,
          date: new Date(entry.date)
        }));
        
        this.cachedData.userProfiles = this.cachedData.userProfiles.map(profile => ({
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      this.tryRestoreFromBackup();
    }
  }

  private tryRestoreFromBackup(): void {
    try {
      const backupString = localStorage.getItem(this.BACKUP_KEY);
      if (backupString) {
        const parsed = JSON.parse(backupString);
        this.cachedData = { ...this.cachedData, ...parsed };
        this.saveToStorage(); // Restaurer la sauvegarde principale
      }
    } catch (error) {
      console.error('Impossible de restaurer la sauvegarde:', error);
    }
  }

  // Export/Import des données
  exportData(): string {
    return JSON.stringify(this.cachedData, null, 2);
  }

  importData(dataString: string): boolean {
    try {
      const imported = JSON.parse(dataString);
      this.cachedData = { ...this.cachedData, ...imported };
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  clearAllData(): void {
    this.cachedData = {
      userProfiles: [],
      progressEntries: [],
      goals: [],
      favoriteMenus: [],
      settings: {
        theme: 'dark',
        units: 'metric',
        language: 'fr',
        notifications: true
      },
      lastSync: new Date()
    };
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.BACKUP_KEY);
  }

  getStorageInfo(): {
    size: number;
    profiles: number;
    entries: number;
    goals: number;
    lastSync: Date;
  } {
    const dataString = localStorage.getItem(this.STORAGE_KEY) || '';
    return {
      size: new Blob([dataString]).size,
      profiles: this.cachedData.userProfiles.length,
      entries: this.cachedData.progressEntries.length,
      goals: this.cachedData.goals.length,
      lastSync: this.cachedData.lastSync
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
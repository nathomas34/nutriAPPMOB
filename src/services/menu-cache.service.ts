import { Injectable } from '@angular/core';
import { MenuItem } from '../models/user.model';

export interface MenuCache {
  menus: MenuItem[];
  favorites: string[];
  searchHistory: string[];
  filterPreferences: {
    lastCategory: string;
    lastDifficulty: string;
    lastGoalType: string;
  };
  weeklyPlans: {
    [goalType: string]: {
      plan: any[];
      generatedAt: Date;
      expiresAt: Date;
    };
  };
  menuStats: {
    totalViews: { [menuId: string]: number };
    lastViewed: { [menuId: string]: Date };
    preparationCount: { [menuId: string]: number };
  };
  lastSync: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MenuCacheService {
  private readonly CACHE_KEY = 'fitnutri_menu_cache';
  private readonly CACHE_VERSION = '1.0';
  private readonly CACHE_EXPIRY_HOURS = 24;
  
  private cache: MenuCache = {
    menus: [],
    favorites: [],
    searchHistory: [],
    filterPreferences: {
      lastCategory: '',
      lastDifficulty: '',
      lastGoalType: ''
    },
    weeklyPlans: {},
    menuStats: {
      totalViews: {},
      lastViewed: {},
      preparationCount: {}
    },
    lastSync: new Date()
  };

  constructor() {
    this.loadCache();
  }

  // Gestion du cache des menus
  cacheMenus(menus: MenuItem[]): void {
    this.cache.menus = [...menus];
    this.cache.lastSync = new Date();
    this.saveCache();
  }

  getCachedMenus(): MenuItem[] {
    return [...this.cache.menus];
  }

  // Gestion des favoris avec cache
  addToFavorites(menuId: string): void {
    if (!this.cache.favorites.includes(menuId)) {
      this.cache.favorites.push(menuId);
      this.saveCache();
    }
  }

  removeFromFavorites(menuId: string): void {
    const index = this.cache.favorites.indexOf(menuId);
    if (index > -1) {
      this.cache.favorites.splice(index, 1);
      this.saveCache();
    }
  }

  getFavorites(): string[] {
    return [...this.cache.favorites];
  }

  isFavorite(menuId: string): boolean {
    return this.cache.favorites.includes(menuId);
  }

  // Historique de recherche
  addToSearchHistory(query: string): void {
    if (query.trim() && !this.cache.searchHistory.includes(query)) {
      this.cache.searchHistory.unshift(query);
      // Garder seulement les 10 dernières recherches
      this.cache.searchHistory = this.cache.searchHistory.slice(0, 10);
      this.saveCache();
    }
  }

  getSearchHistory(): string[] {
    return [...this.cache.searchHistory];
  }

  clearSearchHistory(): void {
    this.cache.searchHistory = [];
    this.saveCache();
  }

  // Préférences de filtres
  saveFilterPreferences(category: string, difficulty: string, goalType: string): void {
    this.cache.filterPreferences = {
      lastCategory: category,
      lastDifficulty: difficulty,
      lastGoalType: goalType
    };
    this.saveCache();
  }

  getFilterPreferences() {
    return { ...this.cache.filterPreferences };
  }

  // Cache des plans hebdomadaires
  cacheWeeklyPlan(goalType: string, plan: any[]): void {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.CACHE_EXPIRY_HOURS);

    this.cache.weeklyPlans[goalType] = {
      plan: [...plan],
      generatedAt: new Date(),
      expiresAt
    };
    this.saveCache();
  }

  getCachedWeeklyPlan(goalType: string): any[] | null {
    const cached = this.cache.weeklyPlans[goalType];
    if (!cached) return null;

    // Vérifier si le cache a expiré
    if (new Date() > new Date(cached.expiresAt)) {
      delete this.cache.weeklyPlans[goalType];
      this.saveCache();
      return null;
    }

    return [...cached.plan];
  }

  // Statistiques des menus
  incrementMenuView(menuId: string): void {
    this.cache.menuStats.totalViews[menuId] = (this.cache.menuStats.totalViews[menuId] || 0) + 1;
    this.cache.menuStats.lastViewed[menuId] = new Date();
    this.saveCache();
  }

  incrementPreparationCount(menuId: string): void {
    this.cache.menuStats.preparationCount[menuId] = (this.cache.menuStats.preparationCount[menuId] || 0) + 1;
    this.saveCache();
  }

  getMenuStats(menuId: string) {
    return {
      views: this.cache.menuStats.totalViews[menuId] || 0,
      lastViewed: this.cache.menuStats.lastViewed[menuId] || null,
      preparations: this.cache.menuStats.preparationCount[menuId] || 0
    };
  }

  getPopularMenus(limit: number = 5): string[] {
    return Object.entries(this.cache.menuStats.totalViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([menuId]) => menuId);
  }

  getRecentlyViewedMenus(limit: number = 5): string[] {
    return Object.entries(this.cache.menuStats.lastViewed)
      .sort(([,a], [,b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, limit)
      .map(([menuId]) => menuId);
  }

  // Recherche intelligente avec cache
  getSmartSuggestions(query: string): string[] {
    const suggestions = new Set<string>();
    
    // Ajouter des suggestions basées sur l'historique
    this.cache.searchHistory.forEach(term => {
      if (term.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(term);
      }
    });

    // Ajouter des suggestions basées sur les noms de menus
    this.cache.menus.forEach(menu => {
      if (menu.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(menu.name);
      }
      
      // Suggestions basées sur les tags
      menu.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, 8);
  }

  // Gestion du cache
  private saveCache(): void {
    try {
      const cacheData = {
        version: this.CACHE_VERSION,
        data: this.cache,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cache menu:', error);
    }
  }

  private loadCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        
        // Vérifier la version du cache
        if (parsed.version === this.CACHE_VERSION) {
          this.cache = {
            ...this.cache,
            ...parsed.data,
            lastSync: new Date(parsed.data.lastSync)
          };
          
          // Convertir les dates dans les stats
          Object.keys(this.cache.menuStats.lastViewed).forEach(menuId => {
            this.cache.menuStats.lastViewed[menuId] = new Date(this.cache.menuStats.lastViewed[menuId]);
          });
          
          // Convertir les dates dans les plans hebdomadaires
          Object.keys(this.cache.weeklyPlans).forEach(goalType => {
            const plan = this.cache.weeklyPlans[goalType];
            plan.generatedAt = new Date(plan.generatedAt);
            plan.expiresAt = new Date(plan.expiresAt);
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cache menu:', error);
      this.clearCache();
    }
  }

  clearCache(): void {
    this.cache = {
      menus: [],
      favorites: [],
      searchHistory: [],
      filterPreferences: {
        lastCategory: '',
        lastDifficulty: '',
        lastGoalType: ''
      },
      weeklyPlans: {},
      menuStats: {
        totalViews: {},
        lastViewed: {},
        preparationCount: {}
      },
      lastSync: new Date()
    };
    localStorage.removeItem(this.CACHE_KEY);
  }

  getCacheInfo() {
    const cacheSize = new Blob([localStorage.getItem(this.CACHE_KEY) || '']).size;
    return {
      size: cacheSize,
      menusCount: this.cache.menus.length,
      favoritesCount: this.cache.favorites.length,
      searchHistoryCount: this.cache.searchHistory.length,
      weeklyPlansCount: Object.keys(this.cache.weeklyPlans).length,
      lastSync: this.cache.lastSync,
      totalViews: Object.values(this.cache.menuStats.totalViews).reduce((sum, views) => sum + views, 0)
    };
  }

  // Export/Import du cache
  exportCache(): string {
    return JSON.stringify({
      version: this.CACHE_VERSION,
      data: this.cache,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  importCache(cacheData: string): boolean {
    try {
      const parsed = JSON.parse(cacheData);
      if (parsed.version === this.CACHE_VERSION && parsed.data) {
        this.cache = parsed.data;
        this.saveCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import du cache:', error);
      return false;
    }
  }
}
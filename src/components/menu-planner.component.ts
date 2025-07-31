import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem, UserProfile } from '../models/user.model';
import { MenuService } from '../services/menu.service';
import { StorageService } from '../services/storage.service';
import { MenuCacheService } from '../services/menu-cache.service';

@Component({
  selector: 'app-menu-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card fade-in">
      <h2 class="text-2xl font-bold mb-6 text-center">Planificateur de Menus</h2>
      
      <!-- Filtres et recherche -->
      <div class="grid grid-3 mb-6">
        <div class="form-group">
          <label class="form-label">Rechercher</label>
          <div class="relative">
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" 
                   (focus)="showSuggestions = true" (blur)="hideSuggestions()"
                   class="form-input" placeholder="Nom du plat, ingrédients...">
            
            <!-- Suggestions de recherche -->
            <div *ngIf="showSuggestions && searchSuggestions.length > 0" 
                 class="absolute top-full left-0 right-0 bg-gray-800 border border-gray-600 rounded-lg mt-1 z-10 max-h-48 overflow-y-auto">
              <div *ngFor="let suggestion of searchSuggestions" 
                   class="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                   (mousedown)="selectSuggestion(suggestion)">
                {{ suggestion }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Catégorie</label>
          <select [(ngModel)]="selectedCategory" (ngModelChange)="filterMenus()" class="form-select">
            <option value="">Toutes</option>
            <option value="breakfast">Petit-déjeuner</option>
            <option value="lunch">Déjeuner</option>
            <option value="dinner">Dîner</option>
            <option value="snack">Collation</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="form-label">Difficulté</label>
          <select [(ngModel)]="selectedDifficulty" (ngModelChange)="filterMenus()" class="form-select">
            <option value="">Toutes</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>
      </div>

      <!-- Navigation par onglets -->
      <div class="tab-container">
        <div class="tab-list">
          <button class="tab-button" [class.active]="activeTab === 'browse'" 
                  (click)="activeTab = 'browse'">
            Parcourir les Menus ({{ filteredMenus.length }})
          </button>
          <button class="tab-button" [class.active]="activeTab === 'popular'" 
                  (click)="activeTab = 'popular'; loadPopularMenus()">
            Populaires ({{ popularMenus.length }})
          </button>
          <button class="tab-button" [class.active]="activeTab === 'weekly'" 
                  (click)="activeTab = 'weekly'; generateWeeklyPlan()">
            Plan Hebdomadaire
          </button>
          <button class="tab-button" [class.active]="activeTab === 'favorites'" 
                  (click)="activeTab = 'favorites'">
            Mes Favoris ({{ favoriteMenus.length }})
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div [ngSwitch]="activeTab">
        <!-- Parcourir les menus -->
        <div *ngSwitchCase="'browse'" class="slide-up">
          <!-- Statistiques du cache -->
          <div class="mb-4 p-3 bg-gray-800 rounded-lg">
            <div class="grid grid-3 gap-4 text-sm">
              <div class="text-center">
                <div class="font-bold text-orange-400">{{ cacheInfo.menusCount }}</div>
                <div class="text-gray">Menus en cache</div>
              </div>
              <div class="text-center">
                <div class="font-bold text-cyan-400">{{ cacheInfo.totalViews }}</div>
                <div class="text-gray">Vues totales</div>
              </div>
              <div class="text-center">
                <div class="font-bold text-green-400">{{ (cacheInfo.size / 1024) | number:'1.0-1' }}KB</div>
                <div class="text-gray">Taille cache</div>
              </div>
            </div>
          </div>
          
          <div class="grid grid-2" *ngIf="filteredMenus.length > 0">
            <div *ngFor="let menu of filteredMenus" class="card" style="padding: 1.5rem;">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-semibold">{{ menu.name }}</h3>
                  <p class="text-sm text-gray mb-2">{{ menu.description }}</p>
                  
                  <!-- Statistiques du menu -->
                  <div class="text-xs text-gray mb-2" *ngIf="getMenuStats(menu.id).views > 0">
                    👁️ {{ getMenuStats(menu.id).views }} vues • 
                    🍳 {{ getMenuStats(menu.id).preparations }} préparations
                  </div>
                  
                  <div class="flex gap-2 mb-2">
                    <span class="badge badge-success">{{ getCategoryLabel(menu.category) }}</span>
                    <span class="badge" [ngClass]="getDifficultyBadgeClass(menu.difficulty)">
                      {{ getDifficultyLabel(menu.difficulty) }}
                    </span>
                  </div>
                </div>
                
                <button class="btn-outline" style="padding: 0.5rem;" 
                        (click)="toggleFavorite(menu)"
                        [class.btn-primary]="isFavorite(menu.id)">
                  {{ isFavorite(menu.id) ? '★' : '☆' }}
                </button>
              </div>

              <!-- Informations nutritionnelles -->
              <div class="grid grid-2 gap-4 mb-4 text-sm">
                <div>
                  <div class="flex justify-between">
                    <span>Calories:</span>
                    <span class="font-semibold">{{ menu.calories }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Protéines:</span>
                    <span class="font-semibold">{{ menu.protein }}g</span>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between">
                    <span>Glucides:</span>
                    <span class="font-semibold">{{ menu.carbs }}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Lipides:</span>
                    <span class="font-semibold">{{ menu.fat }}g</span>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex gap-1 mb-3 flex-wrap">
                <span *ngFor="let tag of menu.tags" 
                      class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                  {{ tag }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button class="btn btn-primary" style="flex: 1;" (click)="viewFullRecipe(menu)">
                  📖 Recette complète
                </button>
                <button class="btn btn-outline" (click)="viewRecipe(menu)">
                  👁️ Aperçu
                </button>
                <button class="btn btn-secondary" (click)="markAsPrepared(menu)">
                  🍳 Préparé
                </button>
              </div>
            </div>
          </div>
          
          <div *ngIf="filteredMenus.length === 0" class="text-center py-8 text-gray">
            <p>Aucun menu trouvé avec ces critères.</p>
          </div>
        </div>

        <!-- Menus populaires -->
        <div *ngSwitchCase="'popular'" class="slide-up">
          <div class="mb-4 text-center">
            <p class="text-gray">Menus les plus consultés et préparés</p>
          </div>
          
          <div class="grid grid-2" *ngIf="popularMenus.length > 0">
            <div *ngFor="let menu of popularMenus" class="card" style="padding: 1.5rem;">
              <!-- Même structure que browse avec badge populaire -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-lg font-semibold">{{ menu.name }}</h3>
                    <span class="badge" style="background: linear-gradient(45deg, #FFD700, #FFA500); color: #000;">
                      🔥 Populaire
                    </span>
                  </div>
                  <p class="text-sm text-gray mb-2">{{ menu.description }}</p>
                  
                  <div class="text-xs text-gray mb-2">
                    👁️ {{ getMenuStats(menu.id).views }} vues • 
                    🍳 {{ getMenuStats(menu.id).preparations }} préparations
                  </div>
                </div>
                
                <button class="btn-outline" style="padding: 0.5rem;" 
                        (click)="toggleFavorite(menu)"
                        [class.btn-primary]="isFavorite(menu.id)">
                  {{ isFavorite(menu.id) ? '★' : '☆' }}
                </button>
              </div>
              
              <div class="flex gap-2">
                <button class="btn btn-primary" style="flex: 1;" (click)="viewFullRecipe(menu)">
                  📖 Recette complète
                </button>
                <button class="btn btn-outline" (click)="viewRecipe(menu)">
                  👁️ Aperçu
                </button>
              </div>
            </div>
          </div>
          
          <div *ngIf="popularMenus.length === 0" class="text-center py-8 text-gray">
            <p>Aucun menu populaire pour le moment. Consultez des recettes pour voir les tendances !</p>
          </div>
        </div>

        <!-- Plan hebdomadaire -->
        <div *ngSwitchCase="'weekly'" class="slide-up">
          <div class="mb-4 text-center">
            <button class="btn btn-secondary" (click)="generateWeeklyPlan()">
              Générer un nouveau plan
            </button>
          </div>
          
          <div *ngIf="weeklyPlan.length > 0">
            <div *ngFor="let day of weeklyPlan; let i = index" class="mb-4">
              <h3 class="text-lg font-semibold mb-3">
                {{ getDayName(i) }} - {{ day.totalCalories }} calories
                <span class="text-sm font-normal text-gray">
                  (Objectif: {{ day.calorieTarget }})
                </span>
              </h3>
              
              <div class="grid grid-2 gap-2">
                <div *ngFor="let meal of day.meals" class="p-3 bg-gray-50 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-medium">{{ meal.name }}</span>
                    <span class="text-sm text-gray">{{ meal.calories }} cal</span>
                  </div>
                  <div class="text-xs text-gray">{{ getCategoryLabel(meal.category) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Favoris -->
        <div *ngSwitchCase="'favorites'" class="slide-up">
          <div class="grid grid-2" *ngIf="favoriteMenus.length > 0">
            <div *ngFor="let menu of favoriteMenus" class="card" style="padding: 1.5rem;">
              <!-- Même structure que le parcourir -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="text-lg font-semibold">{{ menu.name }}</h3>
                  <p class="text-sm text-gray mb-2">{{ menu.description }}</p>
                </div>
                <button class="btn btn-primary" style="padding: 0.5rem;" 
                        (click)="toggleFavorite(menu)">★</button>
              </div>
              
              <div class="flex gap-2">
                <button class="btn btn-primary" style="flex: 1;" (click)="viewFullRecipe(menu)">
                  📖 Recette complète
                </button>
                <button class="btn btn-outline" (click)="viewRecipe(menu)">
                  👁️ Aperçu
                </button>
              </div>
            </div>
          </div>
          
          <div *ngIf="favoriteMenus.length === 0" class="text-center py-8 text-gray">
            <p>Aucun menu en favoris. Ajoutez vos plats préférés !</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de recette -->
    <div *ngIf="selectedMenu" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         (click)="closeRecipe()">
      <div class="card max-w-4xl w-full max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">{{ selectedMenu.name }}</h2>
          <div class="flex gap-2">
            <button *ngIf="selectedMenu.videoUrl" class="btn btn-secondary" (click)="openVideo(selectedMenu.videoUrl!)">
              🎥 Voir la vidéo
            </button>
            <button class="btn btn-outline" (click)="closeRecipe()">✕</button>
          </div>
        </div>
        
        <p class="text-gray mb-4">{{ selectedMenu.description }}</p>
        
        <div class="grid grid-3 mb-6">
          <div>
            <h3 class="font-semibold mb-2">Informations nutritionnelles</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Calories:</span>
                <span>{{ selectedMenu.calories }}</span>
              </div>
              <div class="flex justify-between">
                <span>Protéines:</span>
                <span>{{ selectedMenu.protein }}g</span>
              </div>
              <div class="flex justify-between">
                <span>Glucides:</span>
                <span>{{ selectedMenu.carbs }}g</span>
              </div>
              <div class="flex justify-between">
                <span>Lipides:</span>
                <span>{{ selectedMenu.fat }}g</span>
              </div>
              <div class="flex justify-between">
                <span>Fibres:</span>
                <span>{{ selectedMenu.fiber }}g</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Détails</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Temps de préparation:</span>
                <span>{{ selectedMenu.prepTime }} min</span>
              </div>
              <div class="flex justify-between">
                <span>Difficulté:</span>
                <span>{{ getDifficultyLabel(selectedMenu.difficulty) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Catégorie:</span>
                <span>{{ getCategoryLabel(selectedMenu.category) }}</span>
              </div>
            </div>
          </div>
          
          <div *ngIf="selectedMenu.tips && selectedMenu.tips.length > 0">
            <h3 class="font-semibold mb-2">💡 Conseils du chef</h3>
            <ul class="space-y-1 text-sm">
              <li *ngFor="let tip of selectedMenu.tips" class="flex items-start gap-2">
                <span class="text-orange-400 mt-1">▶</span>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="font-semibold mb-2">Ingrédients</h3>
          <ul class="list-disc list-inside space-y-1 text-sm">
            <li *ngFor="let ingredient of selectedMenu.ingredients">{{ ingredient }}</li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">Instructions</h3>
          <ol class="space-y-3 text-sm">
            <li *ngFor="let instruction of selectedMenu.instructions; let i = index" 
                class="flex gap-3 p-3 bg-gray-800 rounded-lg">
              <span class="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {{ i + 1 }}
              </span>
              <span>{{ instruction }}</span>
            </li>
          </ol>
        </div>
        
        <div class="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-orange-400 text-lg">⚡</span>
            <h3 class="font-semibold text-orange-400">Informations importantes</h3>
          </div>
          <div class="grid grid-2 gap-4 text-sm">
            <div>
              <p><strong>Temps de préparation:</strong> {{ selectedMenu.prepTime }} minutes</p>
              <p><strong>Niveau:</strong> {{ getDifficultyLabel(selectedMenu.difficulty) }}</p>
            </div>
            <div>
              <p><strong>Portions:</strong> 1 personne</p>
              <p><strong>Conservation:</strong> Consommer immédiatement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MenuPlannerComponent implements OnInit {
  @Input() userProfile!: UserProfile;
  @Input() dailyCalories!: number;

  activeTab = 'browse';
  searchQuery = '';
  selectedCategory = '';
  selectedDifficulty = '';
  
  allMenus: MenuItem[] = [];
  filteredMenus: MenuItem[] = [];
  favoriteMenuIds: string[] = [];
  favoriteMenus: MenuItem[] = [];
  popularMenus: MenuItem[] = [];
  weeklyPlan: any[] = [];
  selectedMenu?: MenuItem;
  isFullRecipeView = false;
  showSuggestions: boolean = false;
  searchSuggestions: string[] = [];
  cacheInfo: any = {};

  constructor(
    private menuService: MenuService,
    private storageService: StorageService,
    private cacheService: MenuCacheService
  ) {}

  ngOnInit() {
    this.loadMenus();
    this.loadFavorites();
    this.loadCacheInfo();
    this.loadFilterPreferences();
  }

  loadMenus() {
    this.allMenus = this.menuService.getMenusByGoal(this.userProfile.goal);
    this.filteredMenus = [...this.allMenus];
  }

  onSearch() {
    // Générer des suggestions
    if (this.searchQuery.length > 1) {
      this.searchSuggestions = this.menuService.getSearchSuggestions(this.searchQuery);
    } else {
      this.searchSuggestions = [];
    }
    this.filterMenus();
  }

  filterMenus() {
    // Sauvegarder les préférences de filtre
    this.cacheService.saveFilterPreferences(
      this.selectedCategory, 
      this.selectedDifficulty, 
      this.userProfile.goal
    );
    
    let filtered = [...this.allMenus];

    if (this.searchQuery) {
      filtered = this.menuService.searchMenus(this.searchQuery)
        .filter(menu => menu.goalType === this.userProfile.goal);
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(menu => menu.category === this.selectedCategory);
    }

    if (this.selectedDifficulty) {
      filtered = filtered.filter(menu => menu.difficulty === this.selectedDifficulty);
    }

    this.filteredMenus = filtered;
  }

  generateWeeklyPlan() {
    this.weeklyPlan = this.menuService.generateWeeklyMealPlan(
      this.userProfile.goal, 
      this.dailyCalories
    );
  }

  toggleFavorite(menu: MenuItem) {
    if (this.cacheService.isFavorite(menu.id)) {
      this.cacheService.removeFromFavorites(menu.id);
    } else {
      this.cacheService.addToFavorites(menu.id);
    }
    this.updateFavoriteMenus();
  }

  isFavorite(menuId: string): boolean {
    return this.cacheService.isFavorite(menuId);
  }

  updateFavoriteMenus() {
    const favoriteIds = this.cacheService.getFavorites();
    this.favoriteMenus = this.allMenus.filter(menu => favoriteIds.includes(menu.id));
  }

  addToWeeklyPlan(menu: MenuItem) {
    // Logique pour ajouter un menu au plan hebdomadaire
    console.log('Ajout au plan:', menu.name);
  }

  viewRecipe(menu: MenuItem) {
    this.cacheService.incrementMenuView(menu.id);
    this.loadCacheInfo(); // Mettre à jour les stats
    this.selectedMenu = menu;
    this.isFullRecipeView = false;
  }

  viewFullRecipe(menu: MenuItem) {
    this.cacheService.incrementMenuView(menu.id);
    this.loadCacheInfo(); // Mettre à jour les stats
    this.selectedMenu = menu;
    this.isFullRecipeView = true;
  }

  openVideo(videoUrl: string) {
    window.open(videoUrl, '_blank');
  }

  closeRecipe() {
    this.selectedMenu = undefined;
    this.isFullRecipeView = false;
  }

  getCategoryLabel(category: string): string {
    const labels = {
      'breakfast': 'Petit-déjeuner',
      'lunch': 'Déjeuner', 
      'dinner': 'Dîner',
      'snack': 'Collation'
    };
    return labels[category as keyof typeof labels] || category;
  }

  getDifficultyLabel(difficulty: string): string {
    const labels = {
      'easy': 'Facile',
      'medium': 'Moyen',
      'hard': 'Difficile'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  }

  getDifficultyBadgeClass(difficulty: string): string {
    const classes = {
      'easy': 'badge-success',
      'medium': 'badge-warning',
      'hard': 'badge-error'
    };
    return classes[difficulty as keyof typeof classes] || 'badge-success';
  }

  getDayName(index: number): string {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[index] || `Jour ${index + 1}`;
  }

  private loadFavorites() {
    // Les favoris sont maintenant gérés par le cache service
    this.updateFavoriteMenus();
  }

  private loadCacheInfo() {
    this.cacheInfo = this.cacheService.getCacheInfo();
  }

  private loadFilterPreferences() {
    const prefs = this.cacheService.getFilterPreferences();
    this.selectedCategory = prefs.lastCategory;
    this.selectedDifficulty = prefs.lastDifficulty;
  }

  loadPopularMenus() {
    this.popularMenus = this.menuService.getPopularMenus();
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch();
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  markAsPrepared(menu: MenuItem) {
    this.cacheService.incrementPreparationCount(menu.id);
    this.loadCacheInfo();
    // Optionnel: afficher une notification
    console.log(`Menu "${menu.name}" marqué comme préparé !`);
  }

  getMenuStats(menuId: string) {
    return this.cacheService.getMenuStats(menuId);
  }

  getTotalMenus(): number {
    return this.filteredMenus.length;
  }

  getAverageCalories(): number {
    if (this.filteredMenus.length === 0) return 0;
    const total = this.filteredMenus.reduce((sum, menu) => sum + menu.calories, 0);
    return Math.round(total / this.filteredMenus.length);
  }

  getAverageProtein(): number {
    if (this.filteredMenus.length === 0) return 0;
    const total = this.filteredMenus.reduce((sum, menu) => sum + menu.protein, 0);
    return Math.round(total / this.filteredMenus.length);
  }
}
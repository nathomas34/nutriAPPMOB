import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile, NutritionCalculations } from './models/user.model';
import { UserProfileComponent } from './components/user-profile.component';
import { NutritionResultsComponent } from './components/nutrition-results.component';
import { MenuPlannerComponent } from './components/menu-planner.component';
import { GoalsTrackerComponent } from './components/goals-tracker.component';
import { NutritionCalculatorService } from './services/nutrition-calculator.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserProfileComponent,
    NutritionResultsComponent,
    MenuPlannerComponent,
    GoalsTrackerComponent
  ],
  template: `
    <div class="container">
      <!-- Header -->
      <header class="header" *ngIf="userProfile">
        <div class="header-content">
          <div class="logo">
            <span class="text-2xl">💪</span>
            <span class="font-bold">FITNUTRI</span>
          </div>
          <button class="btn btn-outline" (click)="showProfileMenu()">
            👤 {{ userProfile?.name }}
          </button>
        </div>
      </header>

      <!-- Étape 1: Profil utilisateur -->
      <div *ngIf="!userProfile" class="fade-in">
        <app-user-profile (profileSubmitted)="onProfileSubmitted($event)"></app-user-profile>
      </div>

      <!-- Navigation par onglets -->
      <div *ngIf="userProfile && calculations" class="tab-container">
        <div class="tab-list">
          <button class="tab-button" [class.active]="activeMainTab === 'dashboard'" 
                  (click)="activeMainTab = 'dashboard'">
            🏠 Dashboard
          </button>
          <button class="tab-button" [class.active]="activeMainTab === 'results'" 
                  (click)="activeMainTab = 'results'">
            📊 Analyses
          </button>
          <button class="tab-button" [class.active]="activeMainTab === 'menus'" 
                  (click)="activeMainTab = 'menus'">
            🍽️ Menus
          </button>
          <button class="tab-button" [class.active]="activeMainTab === 'goals'" 
                  (click)="activeMainTab = 'goals'">
            🎯 Objectifs
          </button>
        </div>
      </div>

      <!-- Étapes suivantes: Résultats et fonctionnalités -->
      <div *ngIf="userProfile && calculations" class="content">
        <!-- Contenu des onglets -->
        <div [ngSwitch]="activeMainTab">
          <!-- Résultats nutritionnels -->
          <div *ngSwitchCase="'results'">
            <app-nutrition-results [userProfile]="userProfile"></app-nutrition-results>
          </div>

          <!-- Planificateur de menus -->
          <div *ngSwitchCase="'menus'">
            <app-menu-planner 
              [userProfile]="userProfile" 
              [dailyCalories]="calculations.dailyCalories">
            </app-menu-planner>
          </div>

          <!-- Suivi des objectifs -->
          <div *ngSwitchCase="'goals'">
            <app-goals-tracker [userProfile]="userProfile"></app-goals-tracker>
          </div>

          <!-- Dashboard récapitulatif -->
          <div *ngSwitchCase="'dashboard'">
            <div class="grid grid-2 mb-8">
              <!-- Résumé nutritionnel -->
              <div class="card glow-primary">
                <h2 class="text-xl font-bold mb-6 text-center">
                  <span class="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    RÉSUMÉ NUTRITIONNEL
                  </span>
                </h2>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">Calories quotidiennes:</span>
                    <span class="font-black text-orange-400 text-lg">{{ calculations.dailyCalories | number:'1.0-0' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">Protéines:</span>
                    <span class="font-black text-blue-400 text-lg">{{ calculations.protein }}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">Glucides:</span>
                    <span class="font-black text-green-400 text-lg">{{ calculations.carbs }}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">Lipides:</span>
                    <span class="font-black text-yellow-400 text-lg">{{ calculations.fat }}g</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">Eau recommandée:</span>
                    <span class="font-black text-cyan-400 text-lg">{{ calculations.water }}L</span>
                  </div>
                </div>
              </div>

              <!-- Métriques corporelles -->
              <div class="card glow-secondary">
                <h2 class="text-xl font-bold mb-6 text-center">
                  <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    MÉTRIQUES CORPORELLES
                  </span>
                </h2>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">IMC:</span>
                    <span class="font-black text-orange-400 text-lg">{{ calculations.bmi }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray font-semibold uppercase text-sm">Poids idéal:</span>
                    <span class="font-black text-green-400 text-lg">{{ calculations.idealWeight | number:'1.1-1' }}kg</span>
                  </div>
                  <div class="flex justify-between" *ngIf="calculations.bodyFatMass > 0">
                    <span class="text-gray font-semibold uppercase text-sm">Masse grasse:</span>
                    <span class="font-black text-red-400 text-lg">{{ calculations.bodyFatMass | number:'1.1-1' }}kg</span>
                  </div>
                  <div class="flex justify-between" *ngIf="calculations.leanMass > 0">
                    <span class="text-gray font-semibold uppercase text-sm">Masse maigre:</span>
                    <span class="font-black text-blue-400 text-lg">{{ calculations.leanMass | number:'1.1-1' }}kg</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Conseils personnalisés -->
            <div class="card">
              <h2 class="text-2xl font-black mb-6 text-center">
                <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  CONSEILS PERSONNALISÉS
                </span>
              </h2>
              <div class="grid grid-2 gap-6">
                <div>
                  <h3 class="font-black mb-4 text-orange-400 text-lg uppercase tracking-wide">🍽️ Nutrition</h3>
                  <ul class="space-y-2 text-sm">
                    <li *ngFor="let tip of getNutritionTips()" class="flex items-start gap-2">
                      <span class="text-orange-400 mt-1 font-bold">▶</span>
                      <span class="text-gray-300">{{ tip }}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="font-black mb-4 text-cyan-400 text-lg uppercase tracking-wide">🏋️ Entraînement</h3>
                  <ul class="space-y-2 text-sm">
                    <li *ngFor="let tip of getWorkoutTips()" class="flex items-start gap-2">
                      <span class="text-cyan-400 mt-1 font-bold">▶</span>
                      <span class="text-gray-300">{{ tip }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu profil -->
      <div *ngIf="showProfilePopover" class="profile-menu" (click)="showProfilePopover = false">
        <div class="profile-menu-content" (click)="$event.stopPropagation()">
          <div class="profile-menu-item">
            <span>👤 {{ userProfile?.name }}</span>
          </div>
          <button class="profile-menu-item" (click)="resetProfile()">
            🔄 Nouveau profil
          </button>
          <button class="profile-menu-item" (click)="shareApp()">
            📤 Partager l'app
          </button>
          <button class="profile-menu-item" (click)="showProfilePopover = false">
            ✕ Fermer
          </button>
        </div>
      </div>
    </div>
  `
})
export class App {
  userProfile?: UserProfile;
  calculations?: NutritionCalculations;
  activeMainTab = 'dashboard';
  showProfilePopover = false;

  constructor(
    private nutritionService: NutritionCalculatorService,
    private storageService: StorageService
  ) {
    // Charger le profil existant s'il y en a un
    try {
      const existingProfile = this.storageService.getCurrentProfile();
      if (existingProfile) {
        this.userProfile = existingProfile;
        this.calculations = this.nutritionService.calculateNutrition(existingProfile);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  }

  onProfileSubmitted(profile: UserProfile) {
    try {
      this.userProfile = profile;
      this.calculations = this.nutritionService.calculateNutrition(profile);
      this.storageService.saveUserProfile(profile);
      this.activeMainTab = 'dashboard';
    } catch (error) {
      console.error('Erreur lors de la soumission du profil:', error);
    }
  }

  resetProfile() {
    if (confirm('Êtes-vous sûr de vouloir créer un nouveau profil ? Toutes les données actuelles seront perdues.')) {
      this.userProfile = undefined;
      this.calculations = undefined;
      this.activeMainTab = 'dashboard';
      this.showProfilePopover = false;
    }
  }

  showProfileMenu() {
    this.showProfilePopover = true;
  }

  async shareApp() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'FITNUTRI - Coach Nutrition & Musculation',
          text: 'Découvre FITNUTRI, l\'app qui calcule tes besoins nutritionnels et te propose des menus adaptés à tes objectifs fitness !',
          url: window.location.href
        });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API de partage
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papiers !');
      }
    } catch (error) {
      console.log('Partage annulé ou erreur:', error);
    }
    this.showProfilePopover = false;
  }

  getGoalLabel(goal: string): string {
    const labels = {
      'weight-loss': 'Perte de poids',
      'weight-gain': 'Prise de masse',
      'maintenance': 'Maintien'
    };
    return labels[goal as keyof typeof labels] || goal;
  }

  getNutritionTips(): string[] {
    if (!this.userProfile) return [];
    
    const tips = {
      'weight-loss': [
        'Privilégiez les protéines maigres à chaque repas',
        'Augmentez votre consommation de légumes verts',
        'Limitez les glucides raffinés et les sucres ajoutés',
        'Buvez beaucoup d\'eau avant les repas'
      ],
      'weight-gain': [
        'Mangez des repas plus fréquents et riches en calories',
        'Incorporez des graisses saines (avocat, noix, huiles)',
        'Consommez des glucides complexes après l\'entraînement',
        'Ne négligez pas les collations nutritives'
      ],
      'maintenance': [
        'Maintenez un équilibre entre les macronutriments',
        'Variez vos sources de protéines',
        'Écoutez vos signaux de faim et satiété',
        'Adoptez une approche flexible et durable'
      ]
    };

    return tips[this.userProfile.goal as keyof typeof tips] || [];
  }

  getWorkoutTips(): string[] {
    if (!this.userProfile) return [];
    
    const tips = {
      'weight-loss': [
        'Combinez cardio et musculation',
        'Privilégiez les exercices composés',
        'Augmentez progressivement l\'intensité',
        'Maintenez une routine régulière'
      ],
      'weight-gain': [
        'Concentrez-vous sur la musculation',
        'Travaillez avec des charges lourdes',
        'Accordez de l\'importance à la récupération',
        'Évitez le cardio excessif'
      ],
      'maintenance': [
        'Variez vos types d\'entraînement',
        'Maintenez votre niveau d\'activité actuel',
        'Écoutez votre corps',
        'Ajustez selon vos sensations'
      ]
    };

    return tips[this.userProfile.goal as keyof typeof tips] || [];
  }
}

// Bootstrap de l'application
bootstrapApplication(App, {
  providers: [
    NutritionCalculatorService,
    StorageService
  ]
}).catch(err => console.error(err));
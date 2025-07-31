import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile, NutritionCalculations } from '../models/user.model';
import { NutritionCalculatorService } from '../services/nutrition-calculator.service';

@Component({
  selector: 'app-nutrition-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card fade-in" *ngIf="calculations">
      <h2 class="text-3xl font-black mb-8 text-center">
        <span class="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          📊 ANALYSES NUTRITIONNELLES
        </span>
      </h2>
      
      <div class="grid grid-3 mb-8">
        <!-- Métriques de base -->
        <div class="fitness-metric glow-primary">
          <div class="metric-value">{{ calculations.bmr | number:'1.0-0' }}</div>
          <div class="metric-label">Métabolisme de Base</div>
          <div class="metric-description">Calories brûlées au repos</div>
        </div>
        
        <div class="fitness-metric glow-secondary">
          <div class="metric-value">{{ calculations.tdee | number:'1.0-0' }}</div>
          <div class="metric-label">Dépense Totale</div>
          <div class="metric-description">Calories quotidiennes totales</div>
        </div>
        
        <div class="fitness-metric" style="border-color: var(--accent);">
          <div class="metric-value" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            {{ calculations.dailyCalories | number:'1.0-0' }}
          </div>
          <div class="metric-label">Objectif Calorique</div>
          <div class="metric-description">Pour {{ getGoalDescription() }}</div>
        </div>
      </div>

      <!-- Répartition des macronutriments -->
      <div class="mb-8">
        <h3 class="text-2xl font-black mb-6 text-center">
          <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🥩 MACRONUTRIMENTS
          </span>
        </h3>
        <div class="grid grid-3">
          <div class="fitness-metric">
            <div class="metric-value" style="background: linear-gradient(135deg, #FF6B35 0%, #FF8F65 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              {{ calculations.protein }}g
            </div>
            <div class="metric-label">💪 Protéines</div>
            <div class="progress-bar mt-2">
              <div class="progress-fill" [style.width.%]="getProteinPercentage()"></div>
            </div>
            <div class="metric-description">{{ getProteinPercentage() | number:'1.0-0' }}% des calories</div>
          </div>
          
          <div class="fitness-metric">
            <div class="metric-value" style="background: linear-gradient(135deg, #00D4FF 0%, #33E0FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              {{ calculations.carbs }}g
            </div>
            <div class="metric-label">⚡ Glucides</div>
            <div class="progress-bar mt-2">
              <div class="progress-fill" [style.width.%]="getCarbsPercentage()" style="background: linear-gradient(90deg, #00D4FF 0%, #33E0FF 100%);"></div>
            </div>
            <div class="metric-description">{{ getCarbsPercentage() | number:'1.0-0' }}% des calories</div>
          </div>
          
          <div class="fitness-metric">
            <div class="metric-value" style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              {{ calculations.fat }}g
            </div>
            <div class="metric-label">🥑 Lipides</div>
            <div class="progress-bar mt-2">
              <div class="progress-fill" [style.width.%]="getFatPercentage()" style="background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);"></div>
            </div>
            <div class="metric-description">{{ getFatPercentage() | number:'1.0-0' }}% des calories</div>
          </div>
        </div>
      </div>

      <!-- Analyses corporelles -->
      <div class="grid grid-2">
        <div>
          <h3 class="text-xl font-black mb-4 text-orange-400 uppercase tracking-wide">
            🏋️ Composition Corporelle
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray font-semibold uppercase text-sm">IMC:</span>
              <div class="text-right">
                <span class="font-black text-lg">{{ calculations.bmi }}</span>
                <span class="badge ml-2" [ngClass]="getBMIBadgeClass()">
                  {{ getBMICategory().category }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray font-semibold uppercase text-sm">Poids idéal:</span>
              <span class="font-black text-green-400 text-lg">{{ calculations.idealWeight | number:'1.1-1' }} kg</span>
            </div>
            
            <div class="flex justify-between items-center" *ngIf="calculations.bodyFatMass > 0">
              <span class="text-gray font-semibold uppercase text-sm">Masse grasse:</span>
              <span class="font-black text-red-400 text-lg">{{ calculations.bodyFatMass | number:'1.1-1' }} kg</span>
            </div>
            
            <div class="flex justify-between items-center" *ngIf="calculations.leanMass > 0">
              <span class="text-gray font-semibold uppercase text-sm">Masse maigre:</span>
              <span class="font-black text-blue-400 text-lg">{{ calculations.leanMass | number:'1.1-1' }} kg</span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-black mb-4 text-cyan-400 uppercase tracking-wide">
            💡 Recommandations
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray font-semibold uppercase text-sm">Eau quotidienne:</span>
              <span class="font-black text-cyan-400 text-lg">{{ calculations.water }} L</span>
            </div>
            
            <div class="flex justify-between items-center">
              <span class="text-gray font-semibold uppercase text-sm">Repas par jour:</span>
              <span class="font-black text-yellow-400 text-lg">{{ getRecommendedMeals() }}</span>
            </div>
            
            <div class="flex justify-between items-center" *ngIf="userProfile.bodyFatPercentage">
              <span class="text-gray font-semibold uppercase text-sm">Catégorie masse grasse:</span>
              <span class="badge" [ngClass]="getBodyFatBadgeClass()">
                {{ getBodyFatCategory().category }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Explications détaillées -->
      <div class="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-orange-500/20">
        <h3 class="text-xl font-black mb-4 text-center">
          <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            📚 EXPLICATIONS DÉTAILLÉES
          </span>
        </h3>
        <div class="grid grid-2 gap-4 text-sm text-gray-300">
          <div>
            <p class="mb-2"><strong class="text-orange-400">BMR (Métabolisme de Base):</strong> Calories nécessaires pour maintenir les fonctions vitales au repos.</p>
            <p class="mb-2"><strong class="text-cyan-400">TDEE:</strong> Dépense énergétique totale incluant l'activité physique.</p>
          </div>
          <div>
            <p class="mb-2"><strong class="text-yellow-400">Objectif Calorique:</strong> {{ getGoalExplanation() }}</p>
            <p><strong class="text-green-400">Répartition:</strong> {{ getMacroExplanation() }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NutritionResultsComponent implements OnInit {
  @Input() userProfile!: UserProfile;
  calculations?: NutritionCalculations;

  constructor(private nutritionService: NutritionCalculatorService) {}

  ngOnInit() {
    if (this.userProfile) {
      this.calculations = this.nutritionService.calculateNutrition(this.userProfile);
    }
  }

  getGoalDescription(): string {
    const goals = {
      'weight-loss': 'perte de poids',
      'weight-gain': 'prise de masse',
      'maintenance': 'maintien'
    };
    return goals[this.userProfile.goal as keyof typeof goals] || '';
  }

  getProteinPercentage(): number {
    if (!this.calculations) return 0;
    return (this.calculations.protein * 4) / this.calculations.dailyCalories * 100;
  }

  getCarbsPercentage(): number {
    if (!this.calculations) return 0;
    return (this.calculations.carbs * 4) / this.calculations.dailyCalories * 100;
  }

  getFatPercentage(): number {
    if (!this.calculations) return 0;
    return (this.calculations.fat * 9) / this.calculations.dailyCalories * 100;
  }

  getBMICategory() {
    return this.nutritionService.getBMICategory(this.calculations?.bmi || 0);
  }

  getBMIBadgeClass(): string {
    const category = this.getBMICategory();
    if (category.color === 'var(--success)') return 'badge-success';
    if (category.color === 'var(--warning)') return 'badge-warning';
    return 'badge-error';
  }

  getBodyFatCategory() {
    if (!this.userProfile.bodyFatPercentage) return { category: '', color: '' };
    return this.nutritionService.getBodyFatCategory(
      this.userProfile.bodyFatPercentage, 
      this.userProfile.gender
    );
  }

  getBodyFatBadgeClass(): string {
    const category = this.getBodyFatCategory();
    if (category.color === 'var(--success)') return 'badge-success';
    if (category.color === 'var(--warning)') return 'badge-warning';
    return 'badge-error';
  }

  getRecommendedMeals(): string {
    switch (this.userProfile.goal) {
      case 'weight-loss':
        return '3 repas + 1 collation';
      case 'weight-gain':
        return '3 repas + 2-3 collations';
      default:
        return '3 repas + 1-2 collations';
    }
  }

  getGoalExplanation(): string {
    switch (this.userProfile.goal) {
      case 'weight-loss':
        return 'Déficit de 500 calories pour une perte d\'environ 0.5kg par semaine.';
      case 'weight-gain':
        return 'Surplus de 300 calories pour une prise de masse contrôlée.';
      default:
        return 'Maintien de l\'équilibre énergétique actuel.';
    }
  }

  getMacroExplanation(): string {
    switch (this.userProfile.goal) {
      case 'weight-loss':
        return 'Riche en protéines pour préserver la masse musculaire, modéré en glucides.';
      case 'weight-gain':
        return 'Équilibrée avec focus sur les glucides pour l\'énergie et la récupération.';
      default:
        return 'Répartition équilibrée pour un maintien optimal.';
    }
  }
}
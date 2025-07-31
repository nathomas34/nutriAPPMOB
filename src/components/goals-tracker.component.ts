import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal, UserProfile } from '../models/user.model';
import { GoalService } from '../services/goal.service';

@Component({
  selector: 'app-goals-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card fade-in">
      <h2 class="text-2xl font-bold mb-6 text-center">Suivi des Objectifs</h2>
      
      <!-- Navigation par onglets -->
      <div class="tab-container">
        <div class="tab-list">
          <button class="tab-button" [class.active]="activeTab === 'active'" 
                  (click)="activeTab = 'active'">
            Objectifs Actifs ({{ activeGoals.length }})
          </button>
          <button class="tab-button" [class.active]="activeTab === 'completed'" 
                  (click)="activeTab = 'completed'">
            Terminés ({{ completedGoals.length }})
          </button>
          <button class="tab-button" [class.active]="activeTab === 'add'" 
                  (click)="activeTab = 'add'">
            Ajouter un Objectif
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div [ngSwitch]="activeTab">
        <!-- Objectifs actifs -->
        <div *ngSwitchCase="'active'" class="slide-up">
          <div *ngIf="activeGoals.length === 0" class="text-center py-8 text-gray">
            <p>Aucun objectif actif. Créez votre premier objectif !</p>
            <button class="btn btn-primary mt-4" (click)="createDefaultGoals()">
              Créer des objectifs suggérés
            </button>
          </div>

          <div class="space-y-4" *ngIf="activeGoals.length > 0">
            <div *ngFor="let goal of activeGoals" class="card">
              <div class="flex justify-between items-start mb-3">
                <div style="flex: 1;">
                  <h3 class="text-lg font-semibold">{{ goal.title }}</h3>
                  <p class="text-sm text-gray mb-2">{{ goal.description }}</p>
                  
                  <div class="flex gap-2 mb-3">
                    <span class="badge badge-success">{{ getGoalTypeLabel(goal.type) }}</span>
                    <span class="badge" [ngClass]="getStatusBadgeClass(goal)">
                      {{ getGoalProgress(goal).status }}
                    </span>
                  </div>
                </div>
                
                <button class="btn btn-outline" style="padding: 0.5rem;" 
                        (click)="showUpdateModal(goal)">
                  ✏️
                </button>
              </div>

              <!-- Barre de progression -->
              <div class="mb-3">
                <div class="flex justify-between text-sm mb-1">
                  <span>Progression</span>
                  <span>{{ getGoalProgress(goal).percentage }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getGoalProgress(goal).percentage"></div>
                </div>
              </div>

              <!-- Détails -->
              <div class="grid grid-2 gap-4 text-sm">
                <div>
                  <div class="flex justify-between">
                    <span>Valeur actuelle:</span>
                    <span class="font-semibold">{{ goal.currentValue }} {{ goal.unit }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Objectif:</span>
                    <span class="font-semibold">{{ goal.targetValue }} {{ goal.unit }}</span>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between">
                    <span>Échéance:</span>
                    <span class="font-semibold">{{ goal.targetDate | date:'shortDate' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Jours restants:</span>
                    <span class="font-semibold" [class.text-warning]="getGoalProgress(goal).daysRemaining < 7">
                      {{ getGoalProgress(goal).daysRemaining }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions rapides -->
              <div class="flex gap-2 mt-4">
                <button class="btn btn-primary" (click)="quickUpdate(goal, 1)">
                  +1 {{ goal.unit }}
                </button>
                <button class="btn btn-outline" (click)="quickUpdate(goal, -1)">
                  -1 {{ goal.unit }}
                </button>
                <button class="btn btn-outline" style="margin-left: auto;" 
                        (click)="deleteGoal(goal.id)">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Objectifs terminés -->
        <div *ngSwitchCase="'completed'" class="slide-up">
          <div *ngIf="completedGoals.length === 0" class="text-center py-8 text-gray">
            <p>Aucun objectif terminé pour le moment.</p>
          </div>

          <div class="space-y-4" *ngIf="completedGoals.length > 0">
            <div *ngFor="let goal of completedGoals" class="card bg-green-50 border-green-200">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-lg font-semibold text-green-800">{{ goal.title }}</h3>
                  <p class="text-sm text-green-600">{{ goal.description }}</p>
                  <div class="flex gap-2 mt-2">
                    <span class="badge badge-success">Terminé ✓</span>
                    <span class="text-xs text-green-600">
                      {{ goal.targetValue }} {{ goal.unit }} atteint
                    </span>
                  </div>
                </div>
                <div class="text-2xl">🎉</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ajouter un objectif -->
        <div *ngSwitchCase="'add'" class="slide-up">
          <form (ngSubmit)="createGoal()" class="grid grid-2">
            <div class="form-group">
              <label class="form-label">Type d'objectif</label>
              <select [(ngModel)]="newGoal.type" name="type" class="form-select" required>
                <option value="">Sélectionner</option>
                <option value="weight">Poids corporel</option>
                <option value="body-fat">Pourcentage masse grasse</option>
                <option value="muscle-gain">Prise de masse musculaire</option>
                <option value="endurance">Endurance cardiovasculaire</option>
                <option value="strength">Force musculaire</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Titre</label>
              <input type="text" [(ngModel)]="newGoal.title" name="title" 
                     class="form-input" required placeholder="Ex: Perdre 5kg">
            </div>

            <div class="form-group" style="grid-column: 1 / -1;">
              <label class="form-label">Description</label>
              <textarea [(ngModel)]="newGoal.description" name="description" 
                        class="form-input" rows="2"
                        placeholder="Décrivez votre objectif en détail..."></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Valeur actuelle</label>
              <input type="number" [(ngModel)]="newGoal.currentValue" name="currentValue" 
                     class="form-input" step="0.1" required>
            </div>

            <div class="form-group">
              <label class="form-label">Valeur cible</label>
              <input type="number" [(ngModel)]="newGoal.targetValue" name="targetValue" 
                     class="form-input" step="0.1" required>
            </div>

            <div class="form-group">
              <label class="form-label">Unité</label>
              <input type="text" [(ngModel)]="newGoal.unit" name="unit" 
                     class="form-input" required placeholder="kg, %, minutes...">
            </div>

            <div class="form-group">
              <label class="form-label">Date limite</label>
              <input type="date" [(ngModel)]="newGoal.targetDate" name="targetDate" 
                     class="form-input" required>
            </div>

            <div style="grid-column: 1 / -1; text-center; margin-top: 1rem;">
              <button type="submit" class="btn btn-primary">
                Créer l'objectif
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de mise à jour -->
    <div *ngIf="updateGoal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         (click)="closeUpdateModal()">
      <div class="card max-w-md w-full" (click)="$event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Mettre à jour: {{ updateGoal.title }}</h2>
          <button class="btn btn-outline" (click)="closeUpdateModal()">✕</button>
        </div>
        
        <div class="form-group">
          <label class="form-label">Nouvelle valeur ({{ updateGoal.unit }})</label>
          <input type="number" [(ngModel)]="updateValue" class="form-input" 
                 step="0.1" [value]="updateGoal.currentValue">
        </div>
        
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary" (click)="saveUpdate()">
            Sauvegarder
          </button>
          <button class="btn btn-outline" (click)="closeUpdateModal()">
            Annuler
          </button>
        </div>
      </div>
    </div>
  `
})
export class GoalsTrackerComponent implements OnInit {
  @Input() userProfile!: UserProfile;

  activeTab = 'active';
  activeGoals: Goal[] = [];
  completedGoals: Goal[] = [];
  updateGoal?: Goal;
  updateValue = 0;

  newGoal = {
    type: '',
    title: '',
    description: '',
    currentValue: 0,
    targetValue: 0,
    unit: '',
    targetDate: ''
  };

  constructor(private goalService: GoalService) {}

  ngOnInit() {
    this.loadGoals();
  }

  loadGoals() {
    this.activeGoals = this.goalService.getActiveGoals(this.userProfile.id);
    this.completedGoals = this.goalService.getCompletedGoals(this.userProfile.id);
  }

  createDefaultGoals() {
    const defaultGoals = this.goalService.getDefaultGoals(this.userProfile);
    this.loadGoals();
  }

  createGoal() {
    if (this.isNewGoalValid()) {
      this.goalService.createGoal({
        userId: this.userProfile.id,
        type: this.newGoal.type as any,
        title: this.newGoal.title,
        description: this.newGoal.description,
        currentValue: this.newGoal.currentValue,
        targetValue: this.newGoal.targetValue,
        unit: this.newGoal.unit,
        targetDate: new Date(this.newGoal.targetDate)
      });

      this.resetNewGoal();
      this.loadGoals();
      this.activeTab = 'active';
    }
  }

  quickUpdate(goal: Goal, change: number) {
    const newValue = Math.max(0, goal.currentValue + change);
    this.goalService.updateGoal(goal.id, { currentValue: newValue });
    this.loadGoals();
  }

  showUpdateModal(goal: Goal) {
    this.updateGoal = goal;
    this.updateValue = goal.currentValue;
  }

  closeUpdateModal() {
    this.updateGoal = undefined;
    this.updateValue = 0;
  }

  saveUpdate() {
    if (this.updateGoal) {
      this.goalService.updateGoal(this.updateGoal.id, { 
        currentValue: this.updateValue 
      });
      this.closeUpdateModal();
      this.loadGoals();
    }
  }

  deleteGoal(goalId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      this.goalService.deleteGoal(goalId);
      this.loadGoals();
    }
  }

  getGoalProgress(goal: Goal) {
    return this.goalService.getGoalProgress(goal);
  }

  getGoalTypeLabel(type: string): string {
    const labels = {
      'weight': 'Poids',
      'body-fat': 'Masse grasse',
      'muscle-gain': 'Muscle',
      'endurance': 'Endurance',
      'strength': 'Force'
    };
    return labels[type as keyof typeof labels] || type;
  }

  getStatusBadgeClass(goal: Goal): string {
    const progress = this.getGoalProgress(goal);
    if (progress.status === 'Terminé') return 'badge-success';
    if (progress.status === 'En avance') return 'badge-success';
    if (progress.status === 'Retard' || progress.status === 'Échéance dépassée') return 'badge-error';
    return 'badge-warning';
  }

  private isNewGoalValid(): boolean {
    return !!(
      this.newGoal.type &&
      this.newGoal.title &&
      this.newGoal.targetValue > 0 &&
      this.newGoal.unit &&
      this.newGoal.targetDate
    );
  }

  private resetNewGoal() {
    this.newGoal = {
      type: '',
      title: '',
      description: '',
      currentValue: 0,
      targetValue: 0,
      unit: '',
      targetDate: ''
    };
  }
}
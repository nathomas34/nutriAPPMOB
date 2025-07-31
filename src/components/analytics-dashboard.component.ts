import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { UserProfile, Goal } from '../models/user.model';
import { StorageService, ProgressEntry } from '../services/storage.service';
import { GoalService } from '../services/goal.service';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card fade-in">
      <h2 class="text-3xl font-black mb-8 text-center">
        <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          📈 ANALYSES & ÉVOLUTION
        </span>
      </h2>

      <!-- Résumé des progrès -->
      <div class="grid grid-3 mb-8" *ngIf="progressSummary">
        <div class="fitness-metric glow-primary">
          <div class="metric-value">{{ progressSummary.totalEntries }}</div>
          <div class="metric-label">Mesures Enregistrées</div>
          <div class="metric-description">{{ progressSummary.daysTracked }} jours de suivi</div>
        </div>
        
        <div class="fitness-metric glow-secondary">
          <div class="metric-value" [class.text-success]="progressSummary.weightChange < 0" 
               [class.text-error]="progressSummary.weightChange > 0">
            {{ progressSummary.weightChange > 0 ? '+' : '' }}{{ progressSummary.weightChange | number:'1.1-1' }}kg
          </div>
          <div class="metric-label">Évolution Poids</div>
          <div class="metric-description">Depuis le début</div>
        </div>
        
        <div class="fitness-metric" *ngIf="progressSummary.bodyFatChange !== 0">
          <div class="metric-value" [class.text-success]="progressSummary.bodyFatChange < 0" 
               [class.text-error]="progressSummary.bodyFatChange > 0">
            {{ progressSummary.bodyFatChange > 0 ? '+' : '' }}{{ progressSummary.bodyFatChange | number:'1.1-1' }}%
          </div>
          <div class="metric-label">Évolution Masse Grasse</div>
          <div class="metric-description">Depuis le début</div>
        </div>
      </div>

      <!-- Navigation par onglets -->
      <div class="tab-container">
        <div class="tab-list">
          <button class="tab-button" [class.active]="activeTab === 'weight'" 
                  (click)="activeTab = 'weight'">
            Poids
          </button>
          <button class="tab-button" [class.active]="activeTab === 'bodyfat'" 
                  (click)="activeTab = 'bodyfat'" *ngIf="hasBodyFatData">
            Masse Grasse
          </button>
          <button class="tab-button" [class.active]="activeTab === 'goals'" 
                  (click)="activeTab = 'goals'">
            Objectifs
          </button>
          <button class="tab-button" [class.active]="activeTab === 'progress'" 
                  (click)="activeTab = 'progress'">
            Mesures
          </button>
        </div>
      </div>

      <!-- Contenu des onglets -->
      <div [ngSwitch]="activeTab" class="mt-4">
        <!-- Graphique évolution poids -->
        <div *ngSwitchCase="'weight'" class="slide-up">
          <div class="period-selector">
            <button class="btn" [class.btn-primary]="selectedPeriod === 7" 
                    [class.btn-outline]="selectedPeriod !== 7" 
                    (click)="selectedPeriod = 7; updateCharts()">7j</button>
            <button class="btn" [class.btn-primary]="selectedPeriod === 30" 
                    [class.btn-outline]="selectedPeriod !== 30" 
                    (click)="selectedPeriod = 30; updateCharts()">30j</button>
            <button class="btn" [class.btn-primary]="selectedPeriod === 90" 
                    [class.btn-outline]="selectedPeriod !== 90" 
                    (click)="selectedPeriod = 90; updateCharts()">90j</button>
            <button class="btn" [class.btn-primary]="selectedPeriod === 365" 
                    [class.btn-outline]="selectedPeriod !== 365" 
                    (click)="selectedPeriod = 365; updateCharts()">1an</button>
          </div>
          
          <div class="chart-container mt-4">
            <canvas #weightChart></canvas>
          </div>
          
          <div *ngIf="weightTrend.length > 1" class="card mt-4">
            <p class="text-center">Tendance moyenne: {{ getWeightTrend() }}</p>
          </div>
        </div>

        <!-- Graphique masse grasse -->
        <div *ngSwitchCase="'bodyfat'" class="slide-up">
          <div class="period-selector">
            <button class="btn" [class.btn-primary]="selectedPeriod === 7" 
                    [class.btn-outline]="selectedPeriod !== 7" 
                    (click)="selectedPeriod = 7; updateCharts()">7j</button>
            <button class="btn" [class.btn-primary]="selectedPeriod === 30" 
                    [class.btn-outline]="selectedPeriod !== 30" 
                    (click)="selectedPeriod = 30; updateCharts()">30j</button>
            <button class="btn" [class.btn-primary]="selectedPeriod === 90" 
                    [class.btn-outline]="selectedPeriod !== 90" 
                    (click)="selectedPeriod = 90; updateCharts()">90j</button>
          </div>
          
          <div class="chart-container mt-4">
            <canvas #bodyFatChart></canvas>
          </div>
        </div>

        <!-- Graphique objectifs -->
        <div *ngSwitchCase="'goals'" class="slide-up">
          <div class="chart-container">
            <canvas #goalsChart></canvas>
          </div>
          
          <div class="mt-4" *ngIf="goals.length > 0">
            <div *ngFor="let goal of goals" class="card mb-4">
              <h4 class="font-semibold mb-2">{{ goal.title }}</h4>
              <div class="progress-bar mb-2">
                <div class="progress-fill" [style.width.%]="goalService.getGoalProgress(goal).percentage"></div>
              </div>
              <div class="flex justify-between text-sm">
                <span>{{ goal.currentValue }} / {{ goal.targetValue }} {{ goal.unit }}</span>
                <span>{{ goalService.getGoalProgress(goal).percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Saisie de nouvelles mesures -->
        <div *ngSwitchCase="'progress'" class="slide-up">
          <div class="card">
            <h3 class="text-xl font-bold mb-4">📊 Nouvelles Mesures</h3>
            
            <form (ngSubmit)="addProgressEntry()">
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" [(ngModel)]="newEntry.date" name="date" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Poids (kg)</label>
                <input type="number" [(ngModel)]="newEntry.weight" name="weight" 
                       step="0.1" min="30" max="300" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">% Masse grasse (optionnel)</label>
                <input type="number" [(ngModel)]="newEntry.bodyFatPercentage" name="bodyFat" 
                       step="0.1" min="3" max="50" class="form-input">
              </div>
              
              <div class="form-group">
                <label class="form-label">Tour de taille (cm)</label>
                <input type="number" [(ngModel)]="newEntry.measurements.waist" name="waist" 
                       step="0.5" min="50" max="200" class="form-input">
              </div>
              
              <div class="form-group">
                <label class="form-label">Tour de poitrine (cm)</label>
                <input type="number" [(ngModel)]="newEntry.measurements.chest" name="chest" 
                       step="0.5" min="60" max="200" class="form-input">
              </div>
              
              <div class="form-group">
                <label class="form-label">Notes (optionnel)</label>
                <textarea [(ngModel)]="newEntry.notes" name="notes" 
                          placeholder="Commentaires sur votre forme, énergie, entraînement..." 
                          rows="3" class="form-input"></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary">
                💾 Enregistrer les mesures
              </button>
            </form>
          </div>
          
          <!-- Historique des mesures -->
          <div *ngIf="progressEntries.length > 0" class="card mt-4">
            <h3 class="text-xl font-bold mb-4">📈 Historique des mesures</h3>
            
            <div class="space-y-4">
              <div *ngFor="let entry of progressEntries.slice(0, 10)" class="border-b border-gray-700 pb-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold">{{ entry.date | date:'dd/MM/yyyy' }}</span>
                  <button class="btn btn-outline" style="padding: 0.5rem;" (click)="deleteEntry(entry.id)">
                    🗑️
                  </button>
                </div>
                <div class="grid grid-2 gap-2 text-sm">
                  <div>Poids: {{ entry.weight }}kg</div>
                  <div *ngIf="entry.bodyFatPercentage">Masse grasse: {{ entry.bodyFatPercentage }}%</div>
                  <div *ngIf="entry.measurements?.waist">Taille: {{ entry.measurements?.waist }}cm</div>
                  <div *ngIf="entry.measurements?.chest">Poitrine: {{ entry.measurements?.chest }}cm</div>
                </div>
                <p *ngIf="entry.notes" class="text-xs text-gray mt-2">{{ entry.notes }}</p>
              </div>
            </div>
          </div>
          
          <!-- Bouton de partage des progrès -->
          <button class="btn btn-outline mt-4" (click)="shareProgress()" 
                  *ngIf="progressSummary && progressSummary.totalEntries > 0">
            📤 Partager mes progrès
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 300px;
      background: var(--bg-tertiary);
      border-radius: 12px;
      padding: 1rem;
      border: 1px solid var(--border-primary);
    }
    
    .chart-container canvas {
      max-height: 100%;
    }
    
    .period-selector {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .period-selector .btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    
    .text-success {
      color: var(--success);
    }
    
    .text-error {
      color: var(--error);
    }
    
    .mt-4 {
      margin-top: 1rem;
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .border-b {
      border-bottom: 1px solid;
    }
    
    .border-gray-700 {
      border-color: #374151;
    }
    
    .pb-4 {
      padding-bottom: 1rem;
    }
    
    .space-y-4 > * + * {
      margin-top: 1rem;
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  @Input() userProfile!: UserProfile;
  @ViewChild('weightChart') weightChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bodyFatChart') bodyFatChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('goalsChart') goalsChartRef!: ElementRef<HTMLCanvasElement>;

  activeTab = 'weight';
  selectedPeriod = 30;
  
  progressEntries: ProgressEntry[] = [];
  progressSummary: any;
  weightTrend: { date: Date, weight: number }[] = [];
  bodyFatTrend: { date: Date, bodyFat: number }[] = [];
  hasBodyFatData = false;
  goals: Goal[] = [];
  
  weightChart?: Chart;
  bodyFatChart?: Chart;
  goalsChart?: Chart;

  newEntry = {
    date: new Date().toISOString().split('T')[0],
    weight: 70,
    bodyFatPercentage: undefined as number | undefined,
    measurements: {
      chest: undefined as number | undefined,
      waist: undefined as number | undefined,
      biceps: undefined as number | undefined
    },
    notes: '',
    photo: undefined as string | undefined
  };

  constructor(
    private storageService: StorageService,
    public goalService: GoalService,
  ) {}

  ngOnInit() {
    if (this.userProfile) {
      this.loadData();
      // Délai plus long pour s'assurer que le DOM est prêt
      setTimeout(() => this.updateCharts(), 500);
    }
  }

  ngOnDestroy() {
    this.destroyCharts();
  }

  async shareProgress() {
    const latestEntry = this.progressEntries[0];
    if (latestEntry) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Mes progrès FITNUTRI',
            text: `🏋️ Mes progrès FITNUTRI:\n💪 Poids: ${latestEntry.weight}kg\n${latestEntry.bodyFatPercentage ? `📊 Masse grasse: ${latestEntry.bodyFatPercentage}%\n` : ''}\n#FITNUTRI #Fitness #Nutrition`
          });
        } catch (error) {
          console.log('Partage annulé');
        }
      } else {
        const text = `🏋️ Mes progrès FITNUTRI:\n💪 Poids: ${latestEntry.weight}kg\n${latestEntry.bodyFatPercentage ? `📊 Masse grasse: ${latestEntry.bodyFatPercentage}%\n` : ''}\n#FITNUTRI #Fitness #Nutrition`;
        navigator.clipboard.writeText(text).then(() => {
          alert('Progrès copiés dans le presse-papiers !');
        });
      }
    }
  }

  loadData() {
    if (!this.userProfile) return;
    
    try {
      this.progressEntries = this.storageService.getProgressEntries(this.userProfile.id);
      this.progressSummary = this.storageService.getProgressSummary(this.userProfile.id);
      this.goals = this.storageService.getGoals(this.userProfile.id);
      
      this.updateTrendData();
      this.hasBodyFatData = this.bodyFatTrend.length > 0;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Initialiser avec des valeurs par défaut
      this.progressEntries = [];
      this.progressSummary = null;
      this.goals = [];
      this.hasBodyFatData = false;
    }
  }

  updateTrendData() {
    if (!this.userProfile) return;
    
    try {
      this.weightTrend = this.storageService.getWeightTrend(this.userProfile.id, this.selectedPeriod);
      this.bodyFatTrend = this.storageService.getBodyFatTrend(this.userProfile.id, this.selectedPeriod);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des tendances:', error);
      this.weightTrend = [];
      this.bodyFatTrend = [];
    }
  }


  updateCharts() {
    if (!this.userProfile) return;
    
    this.updateTrendData();
    
    setTimeout(() => {
      if (this.activeTab === 'weight') {
        this.createWeightChart();
      } else if (this.activeTab === 'bodyfat') {
        this.createBodyFatChart();
      } else if (this.activeTab === 'goals') {
        this.createGoalsChart();
      }
    }, 100);
  }

  createWeightChart() {
    if (this.weightChart) {
      this.weightChart.destroy();
    }

    if (!this.weightChartRef?.nativeElement || this.weightTrend.length === 0) return;

    const ctx = this.weightChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.weightTrend.map(point => point.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })),
        datasets: [{
          label: 'Poids (kg)',
          data: this.weightTrend.map(point => point.weight),
          borderColor: '#FF6B35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FF6B35',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#FFFFFF',
              font: { size: 14, weight: 'bold' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#B0B0B0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            ticks: { color: '#B0B0B0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  createBodyFatChart() {
    if (this.bodyFatChart) {
      this.bodyFatChart.destroy();
    }

    if (!this.bodyFatChartRef?.nativeElement || this.bodyFatTrend.length === 0) return;

    const ctx = this.bodyFatChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.bodyFatChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.bodyFatTrend.map(point => point.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })),
        datasets: [{
          label: 'Masse grasse (%)',
          data: this.bodyFatTrend.map(point => point.bodyFat),
          borderColor: '#00D4FF',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#00D4FF',
          pointBorderColor: '#FFFFFF',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#FFFFFF',
              font: { size: 14, weight: 'bold' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#B0B0B0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          },
          y: {
            ticks: { color: '#B0B0B0' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' }
          }
        }
      }
    });
  }

  createGoalsChart() {
    if (this.goalsChart) {
      this.goalsChart.destroy();
    }

    if (!this.goalsChartRef?.nativeElement || this.goals.length === 0) return;

    const ctx = this.goalsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const progressData = this.goals.map(goal => this.goalService.getGoalProgress(goal).percentage);
    const colors = ['#FF6B35', '#00D4FF', '#FFD700', '#00FF88', '#FF4757'];

    this.goalsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.goals.map(goal => goal.title),
        datasets: [{
          data: progressData,
          backgroundColor: colors.slice(0, this.goals.length),
          borderColor: '#1A1A1A',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#FFFFFF',
              font: { size: 12 },
              padding: 20
            }
          }
        }
      }
    });
  }

  async addProgressEntry() {
    if (!this.userProfile || !this.newEntry.weight) return;


    const entry = this.storageService.addProgressEntry({
      userId: this.userProfile.id,
      date: new Date(this.newEntry.date),
      weight: this.newEntry.weight,
      bodyFatPercentage: this.newEntry.bodyFatPercentage,
      measurements: {
        chest: this.newEntry.measurements.chest,
        waist: this.newEntry.measurements.waist,
        biceps: this.newEntry.measurements.biceps
      },
      notes: this.newEntry.notes || undefined,
    });

    // Reset form
    this.newEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: this.newEntry.weight,
      bodyFatPercentage: undefined,
      measurements: {
        chest: undefined,
        waist: undefined,
        biceps: undefined
      },
      notes: '',
      photo: undefined
    };

    this.loadData();
    this.updateCharts();
  }

  async deleteEntry(entryId: string) {
    const confirmed = confirm('Supprimer cette mesure ?');
    if (confirmed) {
      this.storageService.deleteProgressEntry(entryId);
      this.loadData();
      this.updateCharts();
    }
  }

  getWeightTrend(): string {
    if (this.weightTrend.length < 2) return 'Données insuffisantes';
    
    const first = this.weightTrend[0].weight;
    const last = this.weightTrend[this.weightTrend.length - 1].weight;
    const change = last - first;
    
    if (Math.abs(change) < 0.1) return 'Stable';
    return change > 0 ? `+${change.toFixed(1)}kg` : `${change.toFixed(1)}kg`;
  }

  private destroyCharts() {
    try {
      if (this.weightChart) {
        this.weightChart.destroy();
        this.weightChart = undefined;
      }
      if (this.bodyFatChart) {
        this.bodyFatChart.destroy();
        this.bodyFatChart = undefined;
      }
      if (this.goalsChart) {
        this.goalsChart.destroy();
        this.goalsChart = undefined;
      }
    } catch (error) {
      console.error('Erreur lors de la destruction des graphiques:', error);
    }
  }
}
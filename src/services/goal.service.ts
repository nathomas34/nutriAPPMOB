import { Injectable } from '@angular/core';
import { Goal } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  constructor(private storageService: StorageService) {}

  createGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: this.generateId(),
      progress: 0,
      isCompleted: false,
      createdAt: new Date()
    };
    
    const existingGoals = this.storageService.getGoals(goal.userId);
    existingGoals.push(newGoal);
    this.storageService.saveGoals(existingGoals);
    
    return newGoal;
  }

  updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
    const goals = this.getAllGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return null;

    goals[goalIndex] = { ...goals[goalIndex], ...updates };
    
    // Recalculer le progrès
    const goal = goals[goalIndex];
    goal.progress = this.calculateProgress(goal);
    goal.isCompleted = goal.progress >= 100;

    // Sauvegarder
    const userGoals = goals.filter(g => g.userId === goal.userId);
    this.storageService.saveGoals(userGoals);
    return goal;
  }

  getGoalsByUser(userId: string): Goal[] {
    return this.storageService.getGoals(userId);
  }

  getActiveGoals(userId: string): Goal[] {
    return this.storageService.getGoals(userId).filter(goal => !goal.isCompleted);
  }

  getCompletedGoals(userId: string): Goal[] {
    return this.storageService.getGoals(userId).filter(goal => goal.isCompleted);
  }

  deleteGoal(goalId: string): boolean {
    const goals = this.getAllGoals();
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return false;
    
    const userGoals = goals.filter(g => g.userId === goal.userId && g.id !== goalId);
    this.storageService.saveGoals(userGoals);
    return true;
  }

  private getAllGoals(): Goal[] {
    // Cette méthode est utilisée pour les opérations internes
    // En production, on devrait avoir une méthode plus efficace
    const allProfiles = this.storageService.getAllProfiles();
    const allGoals: Goal[] = [];
    allProfiles.forEach(profile => {
      allGoals.push(...this.storageService.getGoals(profile.id));
    });
    return allGoals;
  }

  private calculateProgress(goal: Goal): number {
    if (goal.targetValue === 0) return 0;
    
    const progress = (goal.currentValue / goal.targetValue) * 100;
    return Math.min(Math.max(progress, 0), 100); // Entre 0 et 100
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getGoalTypeDescription(type: string): string {
    const descriptions = {
      'weight': 'Objectif de poids corporel',
      'body-fat': 'Réduction du pourcentage de masse grasse',
      'muscle-gain': 'Prise de masse musculaire',
      'endurance': 'Amélioration de l\'endurance cardiovasculaire',
      'strength': 'Augmentation de la force musculaire'
    };
    
    return descriptions[type as keyof typeof descriptions] || 'Objectif personnalisé';
  }

  getDefaultGoals(userProfile: any): Goal[] {
    const userId = userProfile.id;
    const defaultGoals: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'isCompleted'>[] = [];

    // Objectifs basés sur le goal principal
    if (userProfile.goal === 'weight-loss') {
      const targetWeight = userProfile.weight * 0.9; // Perte de 10%
      defaultGoals.push({
        userId,
        type: 'weight',
        title: 'Perte de poids progressive',
        description: 'Perdre 10% du poids actuel de manière saine',
        targetValue: targetWeight,
        currentValue: userProfile.weight,
        unit: 'kg',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 mois
      });

      if (userProfile.bodyFatPercentage) {
        defaultGoals.push({
          userId,
          type: 'body-fat',
          title: 'Réduction masse grasse',
          description: 'Diminuer le pourcentage de masse grasse',
          targetValue: Math.max(userProfile.bodyFatPercentage - 5, 10),
          currentValue: userProfile.bodyFatPercentage,
          unit: '%',
          targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 4 mois
        });
      }
    }

    if (userProfile.goal === 'weight-gain') {
      const targetWeight = userProfile.weight * 1.1; // Prise de 10%
      defaultGoals.push({
        userId,
        type: 'weight',
        title: 'Prise de poids contrôlée',
        description: 'Augmenter le poids de 10% avec focus muscle',
        targetValue: targetWeight,
        currentValue: userProfile.weight,
        unit: 'kg',
        targetDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) // 4 mois
      });

      defaultGoals.push({
        userId,
        type: 'muscle-gain',
        title: 'Développement musculaire',
        description: 'Augmenter la masse musculaire maigre',
        targetValue: 5, // 5kg de muscle
        currentValue: 0,
        unit: 'kg',
        targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 mois
      });
    }

    // Objectifs universels
    defaultGoals.push({
      userId,
      type: 'endurance',
      title: 'Améliorer l\'endurance',
      description: 'Augmenter la capacité cardiovasculaire',
      targetValue: 30, // 30 minutes d'activité continue
      currentValue: 10,
      unit: 'minutes',
      targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 2 mois
    });

    return defaultGoals.map(goal => this.createGoal(goal));
  }

  getGoalProgress(goal: Goal): {
    percentage: number;
    status: string;
    daysRemaining: number;
    isOnTrack: boolean;
  } {
    const percentage = this.calculateProgress(goal);
    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const createdDate = new Date(goal.createdAt);
    
    const totalDays = Math.ceil((targetDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);
    
    const expectedProgress = (daysElapsed / totalDays) * 100;
    const isOnTrack = percentage >= expectedProgress * 0.8; // 80% du progrès attendu

    let status = 'En cours';
    if (goal.isCompleted) {
      status = 'Terminé';
    } else if (daysRemaining === 0 && percentage < 100) {
      status = 'Échéance dépassée';
    } else if (!isOnTrack && daysRemaining > 0) {
      status = 'Retard';
    } else if (isOnTrack && percentage > expectedProgress * 1.2) {
      status = 'En avance';
    }

    return {
      percentage: Math.round(percentage),
      status,
      daysRemaining,
      isOnTrack
    };
  }
}
import { Injectable } from '@angular/core';
import { UserProfile, NutritionCalculations } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class NutritionCalculatorService {

  calculateNutrition(profile: UserProfile): NutritionCalculations {
    const bmr = this.calculateBMR(profile);
    const tdee = this.calculateTDEE(bmr, profile.activityLevel);
    const dailyCalories = this.calculateDailyCalories(tdee, profile.goal);
    const macros = this.calculateMacros(dailyCalories, profile.goal);
    const bmi = this.calculateBMI(profile.weight, profile.height);
    const idealWeight = this.calculateIdealWeight(profile.height, profile.gender);
    const bodyFatMass = this.calculateBodyFatMass(profile.weight, profile.bodyFatPercentage || 0);
    const leanMass = profile.weight - bodyFatMass;

    return {
      bmr,
      tdee,
      dailyCalories,
      protein: macros.protein,
      carbs: macros.carbs,
      fat: macros.fat,
      water: this.calculateWaterNeeds(profile.weight),
      bmi,
      idealWeight,
      bodyFatMass,
      leanMass
    };
  }

  private calculateBMR(profile: UserProfile): number {
    // Formule de Harris-Benedict révisée
    if (profile.gender === 'male') {
      return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }
  }

  private calculateTDEE(bmr: number, activityLevel: string): number {
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    return bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2);
  }

  private calculateDailyCalories(tdee: number, goal: string): number {
    switch (goal) {
      case 'weight-loss':
        return tdee - 500; // Déficit de 500 calories pour perdre ~0.5kg/semaine
      case 'weight-gain':
        return tdee + 300; // Surplus de 300 calories pour prise de masse contrôlée
      case 'maintenance':
      default:
        return tdee;
    }
  }

  private calculateMacros(calories: number, goal: string) {
    let proteinRatio: number, carbRatio: number, fatRatio: number;

    switch (goal) {
      case 'weight-loss':
        proteinRatio = 0.35; // 35% protéines
        carbRatio = 0.30;    // 30% glucides
        fatRatio = 0.35;     // 35% lipides
        break;
      case 'weight-gain':
        proteinRatio = 0.25; // 25% protéines
        carbRatio = 0.50;    // 50% glucides
        fatRatio = 0.25;     // 25% lipides
        break;
      case 'maintenance':
      default:
        proteinRatio = 0.30; // 30% protéines
        carbRatio = 0.40;    // 40% glucides
        fatRatio = 0.30;     // 30% lipides
        break;
    }

    return {
      protein: Math.round((calories * proteinRatio) / 4), // 4 cal/g
      carbs: Math.round((calories * carbRatio) / 4),      // 4 cal/g
      fat: Math.round((calories * fatRatio) / 9)          // 9 cal/g
    };
  }

  private calculateBMI(weight: number, height: number): number {
    return Math.round((weight / Math.pow(height / 100, 2)) * 10) / 10;
  }

  private calculateIdealWeight(height: number, gender: string): number {
    // Formule de Lorentz
    if (gender === 'male') {
      return height - 100 - ((height - 150) / 4);
    } else {
      return height - 100 - ((height - 150) / 2.5);
    }
  }

  private calculateBodyFatMass(weight: number, bodyFatPercentage: number): number {
    return Math.round((weight * bodyFatPercentage / 100) * 10) / 10;
  }

  private calculateWaterNeeds(weight: number): number {
    return Math.round((weight * 0.035) * 10) / 10; // 35ml par kg de poids corporel
  }

  getBMICategory(bmi: number): { category: string, color: string } {
    if (bmi < 18.5) {
      return { category: 'Insuffisance pondérale', color: 'var(--warning)' };
    } else if (bmi < 25) {
      return { category: 'Poids normal', color: 'var(--success)' };
    } else if (bmi < 30) {
      return { category: 'Surpoids', color: 'var(--warning)' };
    } else {
      return { category: 'Obésité', color: 'var(--error)' };
    }
  }

  getBodyFatCategory(bodyFat: number, gender: string): { category: string, color: string } {
    if (gender === 'male') {
      if (bodyFat < 6) return { category: 'Essentiel', color: 'var(--warning)' };
      if (bodyFat < 14) return { category: 'Athlète', color: 'var(--success)' };
      if (bodyFat < 18) return { category: 'Bonne forme', color: 'var(--success)' };
      if (bodyFat < 25) return { category: 'Moyenne', color: 'var(--secondary)' };
      return { category: 'Élevé', color: 'var(--error)' };
    } else {
      if (bodyFat < 14) return { category: 'Essentiel', color: 'var(--warning)' };
      if (bodyFat < 21) return { category: 'Athlète', color: 'var(--success)' };
      if (bodyFat < 25) return { category: 'Bonne forme', color: 'var(--success)' };
      if (bodyFat < 32) return { category: 'Moyenne', color: 'var(--secondary)' };
      return { category: 'Élevé', color: 'var(--error)' };
    }
  }

  getActivityLevelDescription(level: string): string {
    const descriptions = {
      'sedentary': 'Sédentaire (bureau, peu d\'exercice)',
      'light': 'Légèrement actif (exercice léger 1-3 jours/semaine)',
      'moderate': 'Modérément actif (exercice modéré 3-5 jours/semaine)',
      'active': 'Très actif (exercice intense 6-7 jours/semaine)',
      'very-active': 'Extrêmement actif (exercice très intense, travail physique)'
    };
    
    return descriptions[level as keyof typeof descriptions] || 'Non défini';
  }
}
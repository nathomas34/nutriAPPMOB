export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // en cm
  weight: number; // en kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: 'weight-loss' | 'weight-gain' | 'maintenance';
  bodyFatPercentage?: number;
  medicalConditions?: string[];
  allergies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionCalculations {
  bmr: number; // Métabolisme de base
  tdee: number; // Dépense énergétique totale
  dailyCalories: number; // Calories journalières pour l'objectif
  protein: number; // grammes
  carbs: number; // grammes
  fat: number; // grammes
  water: number; // litres
  bmi: number;
  idealWeight: number;
  bodyFatMass: number;
  leanMass: number;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'weight' | 'body-fat' | 'muscle-gain' | 'endurance' | 'strength';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: Date;
  isCompleted: boolean;
  progress: number;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  goalType: 'weight-loss' | 'weight-gain' | 'maintenance';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  videoUrl?: string;
  tips?: string[];
  nutritionFacts?: {
    vitamins?: string[];
    minerals?: string[];
    benefits?: string[];
  };
}

export interface MealPlan {
  id: string;
  userId: string;
  date: Date;
  meals: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
    snacks: MenuItem[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
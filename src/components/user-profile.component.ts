import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card fade-in">
      <h2 class="text-2xl font-bold mb-6 text-center">Votre Profil Nutritionnel</h2>
      
      <form (ngSubmit)="onSubmit()" class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Nom</label>
          <input type="text" [(ngModel)]="profile.name" name="name" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label">Âge</label>
          <input type="number" [(ngModel)]="profile.age" name="age" class="form-input" min="16" max="100" required>
        </div>

        <div class="form-group">
          <label class="form-label">Sexe</label>
          <select [(ngModel)]="profile.gender" name="gender" class="form-select" required>
            <option value="">Sélectionner</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Taille (cm)</label>
          <input type="number" [(ngModel)]="profile.height" name="height" class="form-input" min="140" max="220" required>
        </div>

        <div class="form-group">
          <label class="form-label">Poids (kg)</label>
          <input type="number" [(ngModel)]="profile.weight" name="weight" class="form-input" min="40" max="200" step="0.1" required>
        </div>

        <div class="form-group">
          <label class="form-label">% Masse grasse (optionnel)</label>
          <input type="number" [(ngModel)]="profile.bodyFatPercentage" name="bodyFat" class="form-input" min="5" max="50" step="0.1">
        </div>

        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Niveau d'activité</label>
          <select [(ngModel)]="profile.activityLevel" name="activityLevel" class="form-select" required>
            <option value="">Sélectionner votre niveau</option>
            <option value="sedentary">Sédentaire (bureau, peu d'exercice)</option>
            <option value="light">Légèrement actif (exercice léger 1-3 jours/semaine)</option>
            <option value="moderate">Modérément actif (exercice modéré 3-5 jours/semaine)</option>
            <option value="active">Très actif (exercice intense 6-7 jours/semaine)</option>
            <option value="very-active">Extrêmement actif (exercice très intense, travail physique)</option>
          </select>
        </div>

        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Objectif principal</label>
          <select [(ngModel)]="profile.goal" name="goal" class="form-select" required>
            <option value="">Sélectionner votre objectif</option>
            <option value="weight-loss">Perte de poids (déficit calorique)</option>
            <option value="weight-gain">Prise de masse (surplus calorique)</option>
            <option value="maintenance">Maintien du poids actuel</option>
          </select>
        </div>

        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Allergies alimentaires (optionnel)</label>
          <input type="text" [(ngModel)]="allergiesText" name="allergies" class="form-input" 
                 placeholder="Ex: gluten, lactose, noix...">
          <small class="text-gray">Séparez par des virgules</small>
        </div>

        <div style="grid-column: 1 / -1; text-center; margin-top: 1rem;">
          <button type="submit" class="btn btn-primary" [disabled]="!isFormValid()">
            Calculer mes besoins nutritionnels
          </button>
        </div>
      </form>
    </div>
  `
})
export class UserProfileComponent {
  @Output() profileSubmitted = new EventEmitter<UserProfile>();
  
  profile: Partial<UserProfile> = {
    name: '',
    age: 25,
    gender: undefined,
    height: 170,
    weight: 70,
    activityLevel: undefined,
    goal: undefined,
    bodyFatPercentage: undefined
  };

  allergiesText = '';

  onSubmit() {
    if (this.isFormValid()) {
      const completeProfile: UserProfile = {
        ...this.profile as UserProfile,
        id: this.generateId(),
        allergies: this.allergiesText ? this.allergiesText.split(',').map(a => a.trim()) : [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.profileSubmitted.emit(completeProfile);
    }
  }

  isFormValid(): boolean {
    return !!(
      this.profile.name && 
      this.profile.age && 
      this.profile.gender && 
      this.profile.height && 
      this.profile.weight && 
      this.profile.activityLevel && 
      this.profile.goal
    );
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
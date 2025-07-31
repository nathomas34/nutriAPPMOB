import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MobileService } from '../services/mobile.service';

@Component({
  selector: 'app-mobile-progress-photo',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>📸 Photo de Progression</ion-card-title>
        <ion-card-subtitle>Suivez visuellement vos progrès</ion-card-subtitle>
      </ion-card-header>
      
      <ion-card-content>
        <div class="photo-container" *ngIf="currentPhoto">
          <img [src]="currentPhoto" alt="Photo de progression" class="progress-photo">
          <ion-button fill="clear" size="small" (click)="removePhoto()" class="remove-btn">
            <ion-icon name="close-circle" color="danger"></ion-icon>
          </ion-button>
        </div>
        
        <div class="photo-actions">
          <ion-button expand="block" fill="outline" (click)="takePhoto()" [disabled]="isLoading">
            <ion-icon name="camera" slot="start"></ion-icon>
            Prendre une photo
          </ion-button>
          
          <ion-button expand="block" fill="outline" (click)="selectFromGallery()" [disabled]="isLoading">
            <ion-icon name="images" slot="start"></ion-icon>
            Choisir depuis la galerie
          </ion-button>
        </div>
        
        <ion-progress-bar *ngIf="isLoading" type="indeterminate"></ion-progress-bar>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .photo-container {
      position: relative;
      margin-bottom: 1rem;
    }
    
    .progress-photo {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      border-radius: 8px;
    }
    
    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      --background: rgba(0, 0, 0, 0.5);
    }
    
    .photo-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `]
})
export class MobileProgressPhotoComponent {
  @Input() currentPhoto?: string;
  @Output() photoChanged = new EventEmitter<string | null>();
  
  isLoading = false;

  constructor(private mobileService: MobileService) {}

  async takePhoto() {
    this.isLoading = true;
    await this.mobileService.vibrate('light');
    
    try {
      const photo = await this.mobileService.takePicture();
      if (photo) {
        this.currentPhoto = photo;
        this.photoChanged.emit(photo);
        await this.mobileService.vibrate('medium');
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async selectFromGallery() {
    this.isLoading = true;
    await this.mobileService.vibrate('light');
    
    try {
      const photo = await this.mobileService.selectFromGallery();
      if (photo) {
        this.currentPhoto = photo;
        this.photoChanged.emit(photo);
        await this.mobileService.vibrate('medium');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de photo:', error);
    } finally {
      this.isLoading = false;
    }
  }

  removePhoto() {
    this.currentPhoto = undefined;
    this.photoChanged.emit(null);
  }
}
import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Share } from '@capacitor/share';

@Injectable({
  providedIn: 'root'
})
export class MobileService {
  private deviceInfo: any;

  constructor() {}

  async initializeApp() {
    try {
      // Obtenir les informations de l'appareil
      this.deviceInfo = await Device.getInfo();
      
      // Configurer la barre de statut
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0A0A0A' });
      
      // Masquer le splash screen après initialisation
      setTimeout(async () => {
        await SplashScreen.hide();
      }, 2000);
      
      console.log('Application mobile initialisée:', this.deviceInfo);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation mobile:', error);
    }
  }

  async takePicture(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      return null;
    }
  }

  async selectFromGallery(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl || null;
    } catch (error) {
      console.error('Erreur lors de la sélection de photo:', error);
      return null;
    }
  }

  async vibrate(style: 'light' | 'medium' | 'heavy' = 'medium') {
    try {
      const impactStyle = {
        'light': ImpactStyle.Light,
        'medium': ImpactStyle.Medium,
        'heavy': ImpactStyle.Heavy
      }[style];

      await Haptics.impact({ style: impactStyle });
    } catch (error) {
      console.error('Erreur lors de la vibration:', error);
    }
  }

  async shareApp() {
    try {
      await Share.share({
        title: 'FITNUTRI - Coach Nutrition & Musculation',
        text: 'Découvre FITNUTRI, l\'app qui calcule tes besoins nutritionnels et te propose des menus adaptés à tes objectifs fitness !',
        url: 'https://fitnutri.app',
        dialogTitle: 'Partager FITNUTRI'
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  }

  async shareProgress(data: { weight: number, bodyFat?: number, photo?: string }) {
    try {
      let text = `🏋️ Mes progrès FITNUTRI:\n`;
      text += `💪 Poids: ${data.weight}kg\n`;
      if (data.bodyFat) {
        text += `📊 Masse grasse: ${data.bodyFat}%\n`;
      }
      text += `\n#FITNUTRI #Fitness #Nutrition`;

      const shareData: any = {
        title: 'Mes progrès FITNUTRI',
        text: text
      };

      if (data.photo) {
        shareData.files = [data.photo];
      }

      await Share.share(shareData);
    } catch (error) {
      console.error('Erreur lors du partage des progrès:', error);
    }
  }

  getDeviceInfo() {
    return this.deviceInfo;
  }

  isMobile(): boolean {
    return this.deviceInfo?.platform !== 'web';
  }

  isIOS(): boolean {
    return this.deviceInfo?.platform === 'ios';
  }

  isAndroid(): boolean {
    return this.deviceInfo?.platform === 'android';
  }

  async showNotification(title: string, message: string) {
    // Pour les notifications locales, il faudrait ajouter @capacitor/local-notifications
    console.log('Notification:', title, message);
  }

  async requestPermissions() {
    try {
      // Demander les permissions nécessaires
      const cameraPermission = await Camera.requestPermissions();
      console.log('Permissions caméra:', cameraPermission);
      
      return {
        camera: cameraPermission.camera === 'granted',
        photos: cameraPermission.photos === 'granted'
      };
    } catch (error) {
      console.error('Erreur lors de la demande de permissions:', error);
      return { camera: false, photos: false };
    }
  }
}
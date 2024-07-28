// src/app/services/loading.service.ts
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoggingService } from './logging.service'; // Import LoggingService

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | undefined;

  constructor(
    private loadingController: LoadingController,
    private loggingService: LoggingService // Inject LoggingService
  ) {}

  async showLoading() {
    try {
      await this.loggingService.info('Showing loading indicator');
      this.loading = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'circles'
      });
      await this.loading.present();
    } catch (error) {
      await this.loggingService.error('Error showing loading indicator: ' + error);
    }
  }

  async hideLoading() {
    if (this.loading) {
      try {
        await this.loggingService.info('Hiding loading indicator');
        await this.loading.dismiss();
        this.loading = undefined;
      } catch (error) {
        await this.loggingService.error('Error hiding loading indicator: ' + error);
      }
    }
  }
}

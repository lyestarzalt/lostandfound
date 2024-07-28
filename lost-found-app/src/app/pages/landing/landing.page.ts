import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '@services/auth.service';
import { LoggingService } from '@services/logging.service'; // Import LoggingService

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private loggingService: LoggingService // Inject LoggingService
  ) { }

  async ngOnInit() {
    this.loggingService.info('LandingPage initialized');
    const user = await this.authService.getUserData();
    if (user && user.token) {
      this.loggingService.info('User is logged in, navigating to home page');
      this.navCtrl.navigateRoot('/tabs/home'); // Update this to your home page route
    }
  }

  navigateToLogin() {
    this.loggingService.info('Navigating to LoginPage');
    this.navCtrl.navigateForward('/login');
  }

  navigateToRegister() {
    this.loggingService.info('Navigating to RegisterPage');
    this.navCtrl.navigateForward('/register');
  }
}
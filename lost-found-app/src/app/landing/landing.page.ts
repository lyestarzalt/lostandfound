import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '@services/auth.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(private navCtrl: NavController, private authService: AuthService) { }

  async ngOnInit() {
    const user = await this.authService.getUserData();
    if (user && user.token) {
      this.navCtrl.navigateRoot('/home'); // Update this to your home page route
    }
  }

  navigateToLogin() {
    this.navCtrl.navigateForward('/login');
  }

  navigateToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}

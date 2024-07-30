import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { NavController } from '@ionic/angular';
import { LoggingService } from '@services/logging.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private loggingService: LoggingService 
  ) { }

  ngOnInit() {
    this.loggingService.info('LoginPage initialized');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.loggingService.info('Logging in with credentials: ' + JSON.stringify(credentials));
      this.authService.login(credentials).subscribe(
        () => {
          this.loggingService.info('User logged in successfully, navigating to home page');
          this.navCtrl.navigateRoot('/tabs'); 
        },
        (error) => {
          this.loggingService.error('Error logging in: ' + error);
        }
      );
    } else {
      this.loggingService.error('Login form is invalid');
    }
  }

  navigateToRegister() {
    this.loggingService.info('Navigating to RegisterPage');
    this.navCtrl.navigateForward('/register');
  }
}
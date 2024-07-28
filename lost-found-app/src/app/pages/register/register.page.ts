// src/app/pages/register/register.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '@services/auth.service';
import { NavController } from '@ionic/angular';
import { LoggingService } from '@services/logging.service'; // Import LoggingService

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private loggingService: LoggingService // Inject LoggingService
  ) { }

  ngOnInit() {
    this.loggingService.debug('RegisterPage initialized');
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const user: User = this.registerForm.value;
      this.loggingService.info('Register form is valid, submitting registration');
      this.authService.register(user).subscribe(
        () => {
          this.loggingService.info('User registered successfully, navigating to home page');
          this.navCtrl.navigateRoot('/home'); // Update this to your home page route
        },
        (error) => {
          this.loggingService.error('Error during registration: ' + error);
        }
      );
    } else {
      this.loggingService.info('Register form is invalid');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { AlertController } from '@ionic/angular';
import { LoggingService } from '@services/logging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit {
  user: any;
  accountForm!: FormGroup;
  fileName = 'No file chosen';
  imageUrl: string | ArrayBuffer | null = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private loggingService: LoggingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggingService.info('Initializing AccountSettingsPage');
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUser(true).subscribe(
      (res: any) => {
        this.user = res;
        this.imageUrl = this.user.picture;
        this.loggingService.info('User data retrieved successfully');
        this.initializeForm();
      },
      (error) => {
        this.loggingService.error('Error fetching user data: ' + error);
      }
    );
  }

  initializeForm() {
    this.accountForm = this.fb.group({
      name: [this.user?.name || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      phone_number: [this.user?.phone_number || ''],
      telegram_id: [this.user?.telegram_id || ''],
      picture: ['']
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.accountForm.patchValue({ picture: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result; 
      };
      reader.readAsDataURL(file);

      this.loggingService.info('File selected: ' + this.fileName);
    }
  }

  updateProfile() {
    if (this.accountForm.valid) {
      const formData = new FormData();
      Object.keys(this.accountForm.value).forEach(key => {
        formData.append(key, this.accountForm.value[key]);
      });

      this.authService.updateUser(formData).subscribe(
        () => {
          this.loggingService.info('Profile updated successfully');
          this.alertController.create({
            header: 'Success',
            message: 'Profile updated successfully.',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.refreshUserData();
        },
        (error) => {
          this.loggingService.error('Error updating profile: ' + error);
          this.alertController.create({
            header: 'Error',
            message: 'Failed to update profile. Please try again.',
            buttons: ['OK']
          }).then(alert => alert.present());
        }
      );
    }
  }

refreshUserData() {
  this.authService.getUser().subscribe(
    (res: any) => {
      this.user = res;
      this.imageUrl = this.user.picture;  
      this.loggingService.info('User data refreshed successfully');
      this.initializeForm();
    },
    (error) => {
      this.loggingService.error('Error refreshing user data: ' + error);
    },
    () => {
      this.authService.loadingService.hideLoading();
    }
  );
}

  logout() {
    this.loggingService.info('Logging out...');
    this.authService.logout().subscribe(
      () => {
        this.loggingService.info('User logged out successfully');
            this.router.navigate(['/landing']); 
      },
      (error) => {
        this.loggingService.error('Error logging out: ' + error);
      }
    );
  }
}

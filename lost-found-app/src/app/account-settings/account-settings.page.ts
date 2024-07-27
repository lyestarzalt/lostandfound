// src/app/pages/account-settings/account-settings.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage implements OnInit {
  user: any;
  accountForm!: FormGroup;
  fileName = 'No file chosen';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((res: any) => {
      this.user = res;
      this.initializeForm();
    });
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
    }
  }

  updateProfile() {
    if (this.accountForm.valid) {
      const formData = new FormData();
      Object.keys(this.accountForm.value).forEach(key => {
        formData.append(key, this.accountForm.value[key]);
      });

      this.authService.updateUser(formData).subscribe(() => {
        this.alertController.create({
          header: 'Success',
          message: 'Profile updated successfully.',
          buttons: ['OK']
        }).then(alert => alert.present());
      });
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      // Implement redirect to login page after logout
    });
  }

  getFullImageUrl(relativeUrl: string): string {
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${relativeUrl}`;
  }
}

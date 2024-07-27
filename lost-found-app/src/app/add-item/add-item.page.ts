// src/app/pages/add-item/add-item.page.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostItemService } from '@services/lost-item.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {
  addItemForm: FormGroup;
  picture!: string;

  constructor(private fb: FormBuilder, private lostItemService: LostItemService, private router: Router) {
    this.addItemForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      picture: [null]
    });
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.addItemForm.patchValue({
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude
    });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });
    this.picture = image.dataUrl as string;
    this.addItemForm.patchValue({ picture: this.picture });
  }

  onAddItem() {
    this.lostItemService.addItem(this.addItemForm.value).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}

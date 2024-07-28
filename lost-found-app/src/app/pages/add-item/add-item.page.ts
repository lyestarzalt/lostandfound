import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostItemService } from '@services/lost-item.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';
import { LoggingService } from '@services/logging.service'; // Import LoggingService

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {
  addItemForm!: FormGroup;
  latitude!: number;
  longitude!: number;
  map!: L.Map;
  marker!: L.Marker;
  fileName = 'No file chosen';

  constructor(
    private fb: FormBuilder,
    private lostItemService: LostItemService,
    private router: Router,
    private alertController: AlertController,
    private loggingService: LoggingService // Inject LoggingService
  ) {}

  ngOnInit() {
    this.addItemForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      latitude: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      picture: [null]
    });

    this.loggingService.info('Initializing AddItemPage');
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      this.addItemForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });
      this.loggingService.info('Current location retrieved');
      this.initializeMap();
    } catch (error) {
      this.loggingService.error('Error getting current location: ' + error);
    }
  }

  initializeMap() {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const defaultIcon = icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.marker = L.marker([this.latitude, this.longitude], { draggable: true, icon: defaultIcon })
      .addTo(this.map)
      .bindPopup('Drop pin to set location')
      .openPopup();

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.latitude = position.lat;
      this.longitude = position.lng;
      this.addItemForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });
      this.loggingService.info(`Marker dragged to new position: (${this.latitude}, ${this.longitude})`);
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;
      this.addItemForm.patchValue({
        latitude: this.latitude,
        longitude: this.longitude
      });

      if (!this.marker) {
        this.marker = L.marker([this.latitude, this.longitude], { draggable: true, icon: defaultIcon })
          .addTo(this.map)
          .bindPopup('Drop pin to set location')
          .openPopup();

        this.marker.on('dragend', () => {
          const position = this.marker.getLatLng();
          this.latitude = position.lat;
          this.longitude = position.lng;
          this.addItemForm.patchValue({
            latitude: this.latitude,
            longitude: this.longitude
          });
          this.loggingService.info(`Marker dragged to new position: (${this.latitude}, ${this.longitude})`);
        });
      } else {
        this.marker.setLatLng([this.latitude, this.longitude]);
        this.loggingService.info(`Marker set to new position: (${this.latitude}, ${this.longitude})`);
      }
    });
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
      });
      const fileBlob = await fetch(image.dataUrl!).then(r => r.blob());
      this.fileName = 'picture.jpg';
      this.addItemForm.patchValue({ picture: fileBlob });
      this.loggingService.info('Picture taken successfully');
    } catch (error) {
      this.loggingService.error('Error taking picture: ' + error);
    }
  }

  onAddItem() {
    if (this.addItemForm.valid) {
      const formData = new FormData();
      Object.entries(this.addItemForm.value).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value, this.fileName);
        } else {
          formData.append(key, value as string);
        }
      });

      this.lostItemService.addItem(formData).subscribe(
        () => {
          this.loggingService.info('Item added successfully');
          this.alertController.create({
            header: 'Success',
            message: 'Item added successfully.',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.router.navigate(['/home']);
        },
        (error) => {
          this.loggingService.error('Error adding item: ' + error);
          this.alertController.create({
            header: 'Error',
            message: 'Failed to add item. Please try again.',
            buttons: ['OK']
          }).then(alert => alert.present());
        }
      );
    }
  }
}

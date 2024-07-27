import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostItemService } from '@services/lost-item.service';
import { AlertController } from '@ionic/angular';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})
export class EditItemPage implements OnInit {
  editItemForm!: FormGroup;
  itemId!: number;
  item: any = {}; // Initialize item to an empty object to avoid undefined errors
  fileName = 'No file chosen';
  latitude!: number;
  longitude!: number;
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private lostItemService: LostItemService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.itemId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.editItemForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      picture: ['']
    });

    this.loadItemData();
  }

  loadItemData() {
    this.lostItemService.getItem(this.itemId).subscribe((res: any) => {
      this.item = res || {}; // Ensure res is not null or undefined
      this.editItemForm.patchValue({
        title: this.item.title,
        description: this.item.description,
        latitude: this.item.latitude,
        longitude: this.item.longitude
      });
      this.latitude = this.item.latitude;
      this.longitude = this.item.longitude;
      this.initializeMap();
    });
  }

  getFullImageUrl(relativeUrl: string): string {
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${relativeUrl}`;
  }

  initializeMap() {
    if (this.latitude && this.longitude) { // Ensure latitude and longitude are available
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
        .bindPopup(this.item.title || '') // Ensure title is available
        .openPopup();

      this.marker.on('dragend', () => {
        const position = this.marker.getLatLng();
        this.latitude = position.lat;
        this.longitude = position.lng;
        this.editItemForm.patchValue({
          latitude: this.latitude,
          longitude: this.longitude
        });
      });

      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.latitude = e.latlng.lat;
        this.longitude = e.latlng.lng;
        this.editItemForm.patchValue({
          latitude: this.latitude,
          longitude: this.longitude
        });

        if (!this.marker) {
          this.marker = L.marker([this.latitude, this.longitude], { draggable: true, icon: defaultIcon })
            .addTo(this.map)
            .bindPopup(this.item.title || '')
            .openPopup();

          this.marker.on('dragend', () => {
            const position = this.marker.getLatLng();
            this.latitude = position.lat;
            this.longitude = position.lng;
            this.editItemForm.patchValue({
              latitude: this.latitude,
              longitude: this.longitude
            });
          });
        } else {
          this.marker.setLatLng([this.latitude, this.longitude]);
        }
      });
    } else {
      console.error('Latitude and Longitude are not available');
    }
  }

  updateItem() {
    if (this.editItemForm.valid) {
      const updatedData = this.editItemForm.value;
      this.lostItemService.updateItem(this.itemId, updatedData).subscribe(() => {
        this.alertController.create({
          header: 'Success',
          message: 'Item updated successfully.',
          buttons: ['OK']
        }).then(alert => alert.present());
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.editItemForm.patchValue({ picture: file });
    }
  }
}

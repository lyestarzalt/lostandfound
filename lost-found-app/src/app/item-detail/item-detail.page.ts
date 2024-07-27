// src/app/pages/item-detail/item-detail.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LostItemService } from '@services/lost-item.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit {
  item: any;
  options: any;
  layers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private lostItemService: LostItemService
  ) { }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;

    if (id !== null) {
      this.lostItemService.getItem(id).subscribe((res: any) => {
        this.item = res;
        this.initializeMap();
      });
    } else {
      console.error('Invalid item ID');
    }
  }

  initializeMap() {
    if (this.item) {
      this.options = {
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
          })
        ],
        zoom: 13,
        center: L.latLng(this.item.latitude, this.item.longitude)
      };

      this.layers = [
        L.marker([this.item.latitude, this.item.longitude]).bindPopup(this.item.title)
      ];
    }
  }

  getFullImageUrl(relativeUrl: string): string {
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${relativeUrl}`;
  }
}

import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LostItemService } from '@services/lost-item.service';
import { LoggingService } from '@services/logging.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.page.html',
  styleUrls: ['./item-detail.page.scss'],
})
export class ItemDetailPage implements OnInit, AfterViewInit, OnDestroy {
  item: any;
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private lostItemService: LostItemService,
    private loggingService: LoggingService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loggingService.info('ItemDetailPage - ngOnInit called');
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;

    if (id !== null) {
      this.lostItemService.getItem(id).subscribe(
        (res: any) => {
          this.item = res;
          this.loggingService.info(`Item data loaded: ${JSON.stringify(res)}`);
          this.cdr.detectChanges(); // Trigger change detection manually to ensure view updates
          this.initializeMapWhenReady(); // Try to initialize the map
        },
        (error) => {
          this.loggingService.error(`Error fetching item: ${error}`);
        }
      );
    }
  }

  ngAfterViewInit() {
    this.loggingService.info('ItemDetailPage - ngAfterViewInit called');
    this.initializeMapWhenReady();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initializeMapWhenReady() {
    // Delay map initialization to ensure DOM updates
    setTimeout(() => {
      if (this.item && document.getElementById('map')) {
                this.loggingService.error('Mapid found');

        this.initializeMap();
      } else {
        this.loggingService.error('Map container not ready or item not loaded');
      }
    }, 0);
  }

   initializeMap() {
    try {
      // Define custom icon paths
      const customIcon = L.icon({
        iconUrl: 'assets/leaflet/marker-icon.png',
        iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      this.map = L.map('map', {
        center: [this.item.latitude, this.item.longitude],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.item.latitude, this.item.longitude], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(this.item.title || '')
        .openPopup();
      
      this.loggingService.info('Map successfully initialized');
    } catch (error) {
      this.loggingService.error(`Error initializing map: ${error}`);
    }
  }
}

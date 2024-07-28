// src/app/pages/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { LostItemService } from '@services/lost-item.service';
import { Router } from '@angular/router';
import { LoggingService } from '@services/logging.service'; // Import LoggingService

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  items: any[] = [];
  readonly baseUrl: string = 'http://localhost:8000';

  constructor(
    private lostItemService: LostItemService,
    private router: Router,
    private loggingService: LoggingService // Inject LoggingService
  ) {}

  ngOnInit() {
    this.loggingService.info('HomePage initialized');
    this.loadItems();
  }

  loadItems() {
    this.loggingService.info('Loading items...');
    this.lostItemService.getAllItems().subscribe(
      (res: any) => {
        this.items = res.map((item: any) => {
         
          return item;
        });
        this.loggingService.info('Items loaded successfully');
      },
      (error) => {
        this.loggingService.error('Error loading items: ' + error);
      }
    );
  }

  viewItem(item: any) {
    this.loggingService.info('Navigating to item detail for item ID: ' + item.id);
    this.router.navigate(['/item-detail', item.id]);
  }

  addItem() {
    this.loggingService.info('Navigating to add item page');
    this.router.navigate(['/add-item']);
  }
}

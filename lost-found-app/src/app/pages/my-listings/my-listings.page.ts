import { Component, OnInit } from '@angular/core';
import { LostItemService } from '@services/lost-item.service';
import { Router } from '@angular/router';
import { LoggingService } from '@services/logging.service'; // Import LoggingService

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {
  items: any[] = [];

  constructor(
    private lostItemService: LostItemService,
    private router: Router,
    private loggingService: LoggingService // Inject LoggingService
  ) {}

  ngOnInit() {
    this.loggingService.info('MyListingsPage initialized');
    this.loadMyItems();
  }

  loadMyItems() {
    this.loggingService.info('Loading my items...');
    this.lostItemService.getMyItems().subscribe(
      (res: any) => {
        this.items = res;
        this.loggingService.info('Items loaded successfully');
      },
      (error) => {
        this.loggingService.error('Error loading items: ' + error);
      }
    );
  }

  editItem(item: any) {
    this.loggingService.info('Navigating to edit item with id: ' + item.id);
    this.router.navigate(['/edit-item', item.id]);
  }

  deleteItem(itemId: number) {
    this.loggingService.info('Deleting item with id: ' + itemId);
    this.lostItemService.deleteItem(itemId).subscribe(
      () => {
        this.loggingService.info('Item deleted successfully');
        this.loadMyItems(); // Refresh the list after deletion
      },
      (error) => {
        this.loggingService.error('Error deleting item: ' + error);
      }
    );
  }

  getFullImageUrl(relativeUrl: string): string {
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${relativeUrl}`;
  }
}
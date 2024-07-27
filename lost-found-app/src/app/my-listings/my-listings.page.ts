// src/app/pages/my-listings/my-listings.page.ts
import { Component, OnInit } from '@angular/core';
import { LostItemService } from '@services/lost-item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.page.html',
  styleUrls: ['./my-listings.page.scss'],
})
export class MyListingsPage implements OnInit {
  items: any[] = [];

  constructor(
    private lostItemService: LostItemService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMyItems();
  }

  loadMyItems() {
    this.lostItemService.getMyItems().subscribe((res: any) => {
      this.items = res;
    });
  }

  editItem(item: any) {
    this.router.navigate(['/edit-item', item.id]);
  }

  deleteItem(itemId: number) {
    this.lostItemService.deleteItem(itemId).subscribe(() => {
      this.loadMyItems(); // Refresh the list after deletion
    });
  }

  getFullImageUrl(relativeUrl: string): string {
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${relativeUrl}`;
  }
}

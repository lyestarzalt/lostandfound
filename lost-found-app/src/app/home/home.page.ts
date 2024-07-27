// src/app/pages/home/home.page.ts
import { Component, OnInit } from '@angular/core';
import { LostItemService } from '@services/lost-item.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  items: any[] = [];
  readonly baseUrl: string = 'http://localhost:8000'; 

  constructor(private lostItemService: LostItemService, private router: Router) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.lostItemService.getAllItems().subscribe((res: any) => {
      this.items = res.map((item: any) => {
        item.picture = `${this.baseUrl}${item.picture}`;
        return item;
      });
    });
  }

  viewItem(item: any) {
    this.router.navigate(['/item-detail', item.id]);
  }

  addItem() {
    this.router.navigate(['/add-item']);
  }
}

// src/app/services/lost-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LostItemService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllItems() {
    return this.http.get(`${this.apiUrl}/found-items`);
  }

  getItem(id: number) {
    return this.http.get(`${this.apiUrl}/found-items/${id}`);
  }

  addItem(data: any) {
    return this.http.post(`${this.apiUrl}/found-items`, data);
  }

  getMyItems() {
    return this.http.get(`${this.apiUrl}/my-lost-items`);
  }

  updateItem(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/found-items/${id}`, data);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.apiUrl}/found-items/${id}`);
  }
}

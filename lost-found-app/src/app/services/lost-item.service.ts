// src/app/services/lost-item.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoadingService } from './loading.service';
import { LoggingService } from './logging.service'; // Import LoggingService
import { catchError, finalize, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LostItemService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private loggingService: LoggingService // Inject LoggingService
  ) {}

  getAllItems() {
    this.loadingService.showLoading();
    this.loggingService.info('Fetching all items...');
    return this.http.get(`${this.apiUrl}/found-items`).pipe(
      tap(() => this.loggingService.info('Fetched all items successfully.')),
      finalize(() => this.loadingService.hideLoading()),
      catchError(error => {
        this.loggingService.error('Error fetching all items: ' + error);
        return this.handleError(error);
      })
    );
  }

  getItem(id: number) {
    this.loadingService.showLoading();
    this.loggingService.info(`Fetching item with ID: ${id}...`);
    return this.http.get(`${this.apiUrl}/found-items/${id}`).pipe(
      tap(() => this.loggingService.info(`Fetched item with ID: ${id} successfully. `)),
      finalize(() => this.loadingService.hideLoading()),
      catchError(error => {
        this.loggingService.error(`Error fetching item with ID: ${id} - ` + error);
        return this.handleError(error);
      })
    );
  }

  addItem(data: any) {
    this.loadingService.showLoading();
    this.loggingService.info('Adding new item...');
    return this.http.post(`${this.apiUrl}/found-items`, data).pipe(
      tap(() => this.loggingService.info('Item added successfully.')),
      finalize(() => this.loadingService.hideLoading()),
      catchError(error => {
        this.loggingService.error('Error adding item: ' + error);
        return this.handleError(error);
      })
    );
  }

  getMyItems() {
    this.loadingService.showLoading();
    this.loggingService.info('Fetching my items...');
    return this.http.get(`${this.apiUrl}/my-lost-items`).pipe(
      tap(() => this.loggingService.info('Fetched my items successfully.')),
      finalize(() => this.loadingService.hideLoading()),
      catchError(error => {
        this.loggingService.error('Error fetching my items: ' + error);
        return this.handleError(error);
      })
    );
  }

  updateItem(id: number, data: any) {
    this.loadingService.showLoading();
    this.loggingService.info(`Updating item with ID: ${id}...`);
    return this.http.put(`${this.apiUrl}/found-items/${id}`, data).pipe(
      tap(() => this.loggingService.info(`Item with ID: ${id} updated successfully.`)),
      finalize(() => this.loadingService.hideLoading()),
      catchError(error => {
        this.loggingService.error(`Error updating item with ID: ${id} - ` + error);
        return this.handleError(error);
      })
    );
  }

  deleteItem(id: number) {
    this.loadingService.showLoading();
    this.loggingService.info(`Deleting item with ID: ${id}...`);
    return this.http.delete(`${this.apiUrl}/found-items/${id}`).pipe(
      tap(() => this.loggingService.info(`Item with ID: ${id} deleted successfully.`)),
      finalize(() => this.loadingService.hideLoading()),
      catchError(error => {
        this.loggingService.error(`Error deleting item with ID: ${id} - ` + error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: any) {
    this.loggingService.error('An error occurred: ' + error);
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}

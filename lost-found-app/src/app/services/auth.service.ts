import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { LoadingService } from './loading.service';
import { LoggingService } from './logging.service';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone_number?: string;
  telegram_id?: string;
  picture?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    public loadingService: LoadingService,
    private loggingService: LoggingService
  ) {}

  register(user: User): Observable<{ message: string; user: User; token: string }> {
    this.loadingService.showLoading();
    this.loggingService.info('Registering user...');
    return this.http.post<{ message: string; user: User; token: string }>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        this.saveUserData(response.user, response.token);
        this.loggingService.info('User registered successfully.');
      }),
      finalize(() => {
        this.loadingService.hideLoading();
        this.loggingService.info('Register request completed.');
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<{ message: string; token: string; user: User }> {
    this.loadingService.showLoading();
    this.loggingService.info('Logging in...');
    return this.http.post<{ message: string; token: string; user: User }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveUserData(response.user, response.token);
        this.loggingService.info('User logged in successfully.');
      }),
      finalize(() => {
        this.loadingService.hideLoading();
        this.loggingService.info('Login request completed.');
      })
    );
  }

  private async saveUserData(user: User, token: string): Promise<void> {
    user.token = token;
    await Preferences.set({ key: 'user', value: JSON.stringify(user) });
  }

  async getUserData(): Promise<User | null> {
    const { value } = await Preferences.get({ key: 'user' });
    return value ? JSON.parse(value) : null;
  }

  async removeUserData(): Promise<void> {
    await Preferences.remove({ key: 'user' });
  }

  getUser(showLoading = false): Observable<any> {
    if (showLoading) {
      this.loadingService.showLoading();
    }
    this.loggingService.info('Fetching user data...');
    return this.http.get(`${this.apiUrl}/user`).pipe(
      finalize(() => {
        if (showLoading) {
          this.loadingService.hideLoading();
        }
        this.loggingService.info('Get user request completed.');
      })
    );
  }

  updateUser(data: FormData): Observable<Object> {
    this.loadingService.showLoading();
    this.loggingService.info('Updating user data...');
    return this.http.post(`${this.apiUrl}/user/update`, data).pipe(
      tap(res => {
        console.info('Server response:', res);
        this.loggingService.info('User data updated successfully.');
      }),
      finalize(() => {
        this.loadingService.hideLoading();
        this.loggingService.info('Update user request completed.');
      })
    );
  }

  logout(): Observable<any> {
    this.loadingService.showLoading();
    this.loggingService.info('Logging out...');
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      finalize(() => {
        this.loadingService.hideLoading();
        this.loggingService.info('Logout request completed.');
      })
    );
  }
}

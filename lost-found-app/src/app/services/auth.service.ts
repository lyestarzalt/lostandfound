import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';

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

  constructor(private http: HttpClient) { }

  register(user: User): Observable<{ message: string; user: User; token: string }> {
    return this.http.post<{ message: string; user: User; token: string }>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        this.saveUserData(response.user, response.token);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<{ message: string; token: string; user: User }> {
    return this.http.post<{ message: string; token: string; user: User }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveUserData(response.user, response.token);
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
    getUser() {
    return this.http.get(`${this.apiUrl}/user`);
  }

  updateUser(data: FormData) {
    return this.http.post(`${this.apiUrl}/user/update`, data);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}

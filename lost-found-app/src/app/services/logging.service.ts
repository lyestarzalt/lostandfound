// src/app/services/logging.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  async log(message: string, level: 'INFO' | 'ERROR' | 'DEBUG') {
    const logEntry = `${new Date().toISOString()} [${level}] ${message}`;
    console.log(logEntry);

    // Store log in local storage
    const { value } = await Preferences.get({ key: 'logs' });
    const logs = value ? JSON.parse(value) : [];
    logs.push(logEntry);
    await Preferences.set({ key: 'logs', value: JSON.stringify(logs) });
  }

  async info(message: string) {
    await this.log(message, 'INFO');
  }

  async error(message: string) {
    await this.log(message, 'ERROR');
  }

  async debug(message: string) {
    await this.log(message, 'DEBUG');
  }
}

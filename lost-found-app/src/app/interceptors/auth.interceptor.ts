import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { LoggingService } from '@services/logging.service'; // Import LoggingService
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private loggingService: LoggingService, // Inject LoggingService
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loggingService.debug('Intercepting HTTP request...');
    return from(this.authService.getUserData()).pipe(
      mergeMap(user => {
        if (user && user.token) {
          this.loggingService.debug('User token found, adding Authorization header');
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        } else {
      this.router.navigate(['/landing']); // Redirect to login page after logout

          this.loggingService.debug('No user token found');
        }
        return next.handle(req);
      })
    );
  }
}

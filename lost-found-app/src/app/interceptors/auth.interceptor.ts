import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getUserData()).pipe(
      mergeMap(user => {
        if (user && user.token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
        }
        return next.handle(req);
      })
    );
  }
}

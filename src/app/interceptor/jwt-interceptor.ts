import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { environment } from '../environments/environment';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  constructor(private serviceAuth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let apiReq = req;

    const isAbsoluteUrl = req.url.startsWith('http://') || req.url.startsWith('https://');
    if (!isAbsoluteUrl) {
      apiReq = req.clone({
        url: `${environment.apiUrl}/${req.url}`
      });
    }

    const token = this.serviceAuth.getToken();
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }
    return next.handle(req);
  }
};

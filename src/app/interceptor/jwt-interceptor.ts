import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth-service';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  constructor(private serviceAuth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
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

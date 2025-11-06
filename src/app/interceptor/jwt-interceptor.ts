import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class jwtInterceptor implements HttpInterceptor {
  constructor(private serviceAuth: AuthService, private router: Router) {}

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
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('Interceptor 401');

          Swal.fire({
            icon: 'error',
            title: 'Sessão Expirada',
            text: 'Sua sessão expirou. Faça login novamente.',
            confirmButtonText: 'OK'
          });

          this.serviceAuth.logout();
          this.router.navigate(['/login']);

          return throwError(() => new Error('Sessão expirada. Redirecionando para login.'));
        }
        return throwError(() => error);
      })
    );
  }
};

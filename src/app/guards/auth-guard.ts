import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private serviceAuth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.serviceAuth.getUser();

    if (!this.serviceAuth.isAuthenticated() || !user) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.type)) {
        // console.warn(`Acesso negado: ${user.type} não pode acessar ${state.url}`);
        if (user.type === 'Student') {
          this.router.navigate(['/']);
        } else if (user.type === 'Coordinator') {
          this.router.navigate(['/alunos']);
        } else {
          this.router.navigate(['/login']);
        }
        return false;
      }
    }
    return true;
  }
}

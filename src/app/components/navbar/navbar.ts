import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  currentUrl: string = '';
  alunoNome: string = '';
  alunoRA: string = '';
  allowedRoutes: Route[] = [];
  disabled: boolean = false;

  constructor(private router: Router, private serviceAuth: AuthService) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit(): void {
    const user = this.serviceAuth.getUser();
    if (user) {
      this.setUserRoutes(user);
      this.disabled = true;
    }

    this.serviceAuth.userChanges().subscribe(aluno => {
      if (aluno) {
        this.setUserRoutes(aluno);
      } else {
        this.alunoNome = '';
        this.alunoRA = '';
        this.allowedRoutes = [];
      }
    });
  }

  // private setUserRoutes(user: any) {
  //   this.alunoNome = user.name;
  //   this.alunoRA = user.RA;

  //   this.allowedRoutes = this.router.config.filter(route => {
  //     if (!route.data || !route.data['roles']) return true;
  //     const roles: string[] = route.data['roles'];
  //     return roles.includes(user.type)
  //   });
  //   this.allowedRoutes = this.allowedRoutes.filter(route => route.path !== 'login');
  // }

  private setUserRoutes(user: any) {
  this.alunoNome = user.name;
  this.alunoRA = user.RA;

  const homeRoute = this.router.config.find(route => route.path === '');

  this.allowedRoutes = this.router.config.filter(route => {
    if (!route.data || !route.data['roles']) return true;
    const roles: string[] = route.data['roles'];
    return roles.includes(user.type);
  });

  if (homeRoute && !this.allowedRoutes.includes(homeRoute)) {
    this.allowedRoutes.unshift(homeRoute);
  }

  this.allowedRoutes = this.allowedRoutes.filter(route => route.path !== 'login');
  this.allowedRoutes = this.allowedRoutes.filter(route => route.path !== '**');
  this.allowedRoutes = this.allowedRoutes.filter(route => route.path !== 'cadastro-subprojeto');
  this.allowedRoutes = this.allowedRoutes.filter(route => route.path !== 'cadastro-aluno');

  this.allowedRoutes = this.allowedRoutes.map(route => ({
    ...route,
    data: { ...route.data, title: route.data?.['title'] || route.path || 'Início' }
  }));
}


  isActive(path: string): boolean {
    return this.currentUrl === path;
  }

  logout() {
    this.serviceAuth.logout();
    this.router.navigate(['/login']);
  }
}

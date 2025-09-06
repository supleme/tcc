import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private serviceAuth: AuthService) {
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  ngOnInit(): void {
    if (this.serviceAuth.isAuthenticated()) {
      this.serviceAuth.getMe().subscribe({
        next: (res: any) => {
          this.alunoNome = res.nome;
          this.alunoRA = res.RA;
        },
        error: (err: any) => {
          console.error('Erro ao buscar dados do aluno', err);
        }
      });
    }
  }

  isActive(path: string): boolean {
    return this.currentUrl === path;
  }

  logout() {
    this.serviceAuth.logout();
    this.router.navigate(['/login']);
  }
}

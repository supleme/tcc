import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: any;
  constructor(private fb: FormBuilder, private serviceAuth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    })
  }

  login(){
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.serviceAuth.login(email, password).subscribe({
        next: (res: any) => {
          console.log('res.access_token', res.access_token);
          this.serviceAuth.setToken(res.access_token);

          this.serviceAuth.getMe().subscribe({
            next: (res: any) => {
              this.serviceAuth.setUser(res);
              if (res.type === 'Student') {
                this.router.navigate(['']);
              } else if (res.type === 'Coordinator') {
                this.router.navigate(['alunos']);
              } else {
                this.router.navigate(['/login']);
              }
              Swal.fire({
                icon: 'success',
                title: 'Logado com sucesso!',
                text: 'Bem-vindo de volta ' + res.name,
                confirmButtonColor: '#16a34a'
              });
            },
            error: (err: any) => {
              console.error('Erro ao buscar dados do usuário', err);
            }
          });
        },
        error: (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: err.error?.message || 'Algo deu errado.',
            confirmButtonColor: '#dc2626'
          });
          return;
        }
      });
    } else {
      console.warn('Formulário inválido');
    }
  }
}

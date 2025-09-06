import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

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
          console.log('Login bem-sucedido', res);
          this.serviceAuth.setToken(res.access_token);
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          console.error('Erro no login', err);
        }
      });
    } else {
      console.warn('Formulário inválido');
    }
  }
}

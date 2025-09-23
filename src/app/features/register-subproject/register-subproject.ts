import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Subproject } from '../../services/subproject';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-subproject',
  standalone: false,
  templateUrl: './register-subproject.html',
  styleUrl: './register-subproject.css'
})
export class RegisterSubproject {
  subprojectForm: any;
  categoria: string = '';

  constructor(private fb: FormBuilder, private serviceSubproject: Subproject,private serviceAuth: AuthService) {}

  ngOnInit(): void {
    this.subprojectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      link_ref: ['']
    });
  }

  createSubproject(){
    if(this.serviceAuth.isAuthenticated()){
      if (this.subprojectForm.valid) {
        const formData = this.subprojectForm.value;

        this.serviceSubproject.registerSubproject(formData).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Apontamento criado!',
              text: response.message,
              confirmButtonColor: '#16a34a'
            });
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: error.error?.message || 'Algo deu errado.',
              confirmButtonColor: '#dc2626'
            });
          }
        })
      }
    }

  }
}

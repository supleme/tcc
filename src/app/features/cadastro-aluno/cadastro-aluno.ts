import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Student } from '../../services/student';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: false,
  templateUrl: './cadastro-aluno.html',
  styleUrl: './cadastro-aluno.css'
})
export class CadastroAluno {
  cadastroForm: any;

  constructor(private fb: FormBuilder, private serviceStudent: Student){}

  ngOnInit(): void {
    this.cadastroForm = this.fb.group({
      RA: [''],
      name: [''],
      course: [''],
      period: [''],
      birth_date: [''],
      address: [''],
      city: [''],
      telephone: [''],
      email: [''],
      CPF: [''],
      active: [true],
      hours_available: [''],
      password: ['']
    });
  }

  apontar(){
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;
      console.log('Dados do formulário:', formData);

      this.serviceStudent.registerStudent(formData).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Aluno criado!',
            text: response.message,
            confirmButtonColor: '#16a34a'
          });
          return;
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Algo deu errado ao criar aluno!',
            confirmButtonColor: '#dc2626'
          });
          return;
        }
      })
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Erro!',
        text: 'Formulário inconsistente!',
        confirmButtonColor: '#dc2626'
      });
      return;
    }
  }

}

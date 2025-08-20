import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Student } from '../../services/student';

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
      nome: [''],
      curso: [''],
      periodo: [''],
      data_nascimento: [''],
      endereco: [''],
      cidade: [''],
      telefone: [''],
      email: [''],
      CPF: [''],
      ativo: [true], // se quiser ter um campo ativo
    });
  }

  apontar(){
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;
      console.log('Dados do formulário:', formData);

      this.serviceStudent.registerStudent(formData).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    } else {
      console.warn('Formulário inválido');
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NodeTs } from '../../services/node.ts';
import { AuthService } from '../../services/auth-service.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apontamento',
  standalone: false,
  templateUrl: './apontamento.html',
  styleUrl: './apontamento.css'
})
export class Apontamento implements OnInit{
  apontamentoForm: any;
  categoria: string = '';

  constructor(private fb: FormBuilder, private serviceNode: NodeTs, private serviceAuth: AuthService) {}

  ngOnInit(): void {
    this.apontamentoForm = this.fb.group({
      categoria: ['Escolha a opção'],
      nomeCategoria: [''],
      tarefa: [{ value: '', disabled: true }],
      data_apontamento: [''],
      horas_trabalhadas: [''],
      descricao: [''],
      midia: [''],
    });

    this.apontamentoForm.get('categoria')?.valueChanges.subscribe((valor: string ) => {
      this.categoria = valor;

      const tarefaControl = this.apontamentoForm.get('tarefa');

      if (valor === 'Atividade') {
        tarefaControl?.disable();
        tarefaControl?.reset();
      } else if (valor === 'Subprojeto') {
        tarefaControl?.enable();
      }
    });
  }

  apontar(){
    if(this.serviceAuth.isAuthenticated()){
      let id_aluno = 0;
      this.serviceAuth.getMe().subscribe({
        next: (res: any) => {
          id_aluno = res.id_aluno;
        },
        error: (err: any) => {
          console.error('Erro ao buscar dados do aluno', err);
        }
      });
      if (this.apontamentoForm.valid) {
        const formData = this.apontamentoForm.value;
        console.log('Dados do formulário:', formData);

        formData.id_aluno = id_aluno;

        this.serviceNode.registerNode(formData).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Apontamento criado!',
              text: response.message,
              confirmButtonColor: '#16a34a'
            });
            console.log(response);
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: error.error?.message || 'Algo deu errado.',
              confirmButtonColor: '#dc2626' // vermelho Tailwind
            });
          }
        })
      } else {
        console.warn('Formulário inválido');
      }
    }

  }
}

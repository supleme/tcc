import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NodeTs } from '../../services/node.ts';
import { AuthService } from '../../services/auth-service.js';
import Swal from 'sweetalert2';
import { Subproject } from '../../services/subproject.js';
import { ISubproject } from '../../interfaces/iSubproject.js';

@Component({
  selector: 'app-apontamento',
  standalone: false,
  templateUrl: './apontamento.html',
  styleUrl: './apontamento.css'
})
export class Apontamento implements OnInit{
  apontamentoForm: any;
  categoria: string = '';
  id_aluno: number = 0;
  subprojects: ISubproject[] = [];

  constructor(private fb: FormBuilder,
              private serviceNode: NodeTs,
              private serviceAuth: AuthService,
              private serviceSubproject: Subproject) {}

  ngOnInit(): void {
    this.apontamentoForm = this.fb.group({
      categoria: ['Escolha a opção'],
      atividade: [''],
      id_subprojeto: [0],
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
    this.serviceAuth.getMe().subscribe({
      next: (res: any) => {
        this.id_aluno = res.id_usuario;
        this.serviceSubproject.getSubprojectByUser(this.id_aluno).subscribe({
          next: (response: any) => {
            console.log('Subprojetos:', response.subprojects);
            this.subprojects = response.subprojects;
          },
          error: (error: any) => {
            console.log(error);
          }
        })
      }
    });
  }

  apontar(){
    if (this.apontamentoForm.valid) {
      const formData = this.apontamentoForm.value;
      formData.id_usuario = this.id_aluno;

      if(formData.categoria === 'Atividade'){
        formData.id_subprojeto = 0;
        formData.tarefa = '';
      } else if (formData.categoria === 'Subprojeto') {
        formData.atividade = '';
        if (formData.id_subprojeto == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Selecione um subprojeto válido.',
            confirmButtonColor: '#dc2626'
          });
          return;
        }
      }

      this.serviceNode.registerNode(formData).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Apontamento criado!',
            text: response.message,
            confirmButtonColor: '#16a34a'
          });
          return;
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: error.error?.message || 'Algo deu errado.',
            confirmButtonColor: '#dc2626'
          });
          return;
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Formulário inválido!.',
        confirmButtonColor: '#dc2626'
      });
      return;
    }
  }
}

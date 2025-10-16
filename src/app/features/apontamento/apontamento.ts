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
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;


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


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(file);
    }
  }

  apontar(){
    if (!this.apontamentoForm.valid) {
      this.mostrarErro('Formulário inválido!');
      return;
    }

    const formData = new FormData();
    const formValues = this.apontamentoForm.value;
    for (const key in formValues) {
      if (key !== 'midia') {
          formData.append(key, formValues[key] === null ? '' : formValues[key]);
      }
    }

    formData.append('id_usuario', this.id_aluno.toString());

    if (this.selectedFile) {
        formData.append('midia', this.selectedFile, this.selectedFile.name);
    }

    const erro = this.validarForm(formData);
    if (erro) {
      this.mostrarErro(erro);
      return;
    }

    if (formValues.categoria === 'Atividade') {
      formData.set('id_subprojeto', '0');
      formData.set('tarefa', '');
    } else if (formValues.categoria === 'Subprojeto') {
      formData.set('atividade', '');
    }

    this.serviceNode.registerNode(formData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Apontamento criado!',
          text: response.message,
          confirmButtonColor: '#16a34a'
        });
      },
      error: (error: any) => {
        this.mostrarErro(error.error?.message || 'Algo deu errado.');
      }
    });
  }

  private validarForm(formData: any): string | null {
    if (formData.categoria === 'Escolha a opção') {
      return 'Selecione uma categoria válida.';
    }

    if (formData.categoria === 'Atividade') {
      if (formData.atividade.trim() === '') {
        return 'Preencha a atividade.';
      }
    }

    if (formData.categoria === 'Subprojeto') {
      if (formData.id_subprojeto == 0) {
        return 'Selecione um subprojeto válido.';
      }
      if (formData.tarefa.trim() === '') {
        return 'Preencha a tarefa.';
      }
    }

    return null;
  }

  private mostrarErro(mensagem: string) {
    Swal.fire({
      icon: 'error',
      title: 'Erro!',
      text: mensagem,
      confirmButtonColor: '#dc2626'
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NodeTs } from '../../services/node.ts';

@Component({
  selector: 'app-apontamento',
  standalone: false,
  templateUrl: './apontamento.html',
  styleUrl: './apontamento.css'
})
export class Apontamento implements OnInit{
  apontamentoForm: any;

  constructor(private fb: FormBuilder, private serviceNode: NodeTs) {}

  ngOnInit(): void {
    this.apontamentoForm = this.fb.group({
      categoria: [''],
      nomeAtividade: [''],
      tarefa: [''],
      data_apontamento: [''],
      horas_trabalhadas: [''],
      descricao: [''],
      midia: [''],
    });
  }

  apontar(){
    if (this.apontamentoForm.valid) {
      const formData = this.apontamentoForm.value;
      console.log('Dados do formulário:', formData);

      formData.id_aluno = 1;

      this.serviceNode.registerNode(formData).subscribe({
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

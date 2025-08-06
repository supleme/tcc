import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-apontamento',
  standalone: false,
  templateUrl: './apontamento.html',
  styleUrl: './apontamento.css'
})
export class Apontamento implements OnInit{
  apontamentoForm: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.apontamentoForm = this.fb.group({
      nomeAtividade: [''],
      tarefa: [''],
      data: [''],
      horas: [''],
      descricao: [''],
      midia: [''],
    });
  }

  apontar(){
    if (this.apontamentoForm.valid) {
      const formData = this.apontamentoForm.value;
      console.log('Dados do formulário:', formData);

      // Exemplo de uso:
      // this.servico.salvarApontamento(formData).subscribe(...)
    } else {
      console.warn('Formulário inválido');
    }
  }
}

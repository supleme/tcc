import { Component } from '@angular/core';

@Component({
  selector: 'app-alunos',
  standalone: false,
  templateUrl: './alunos.html',
  styleUrl: './alunos.css'
})
export class Alunos {
  alunoSelecionado: any = null;

  alunos = [
    { id: 1, nome: 'Cesar Abreu', RA: 2311240, curso: 'Sistemas para Internet' },
    { id: 2, nome: 'Joana Silva', RA: 234456, curso: 'Engenharia Civil' },
    { id: 3, nome: 'Lucas Costa', RA: 234567, curso: 'Engenharia Mecanica' },
    { id: 4, nome: 'Maria Oliveira', RA: 256789, curso: 'Engenharia Eletrica' },
  ];

  get num_alunos() {
    return this.alunos.length;
  }

  teste(aluno: any) {
    console.log(aluno);
  }

  mostrarInformacoes(aluno: any) {
    this.alunoSelecionado = aluno;
    const modal = document.getElementById('modalAluno');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  fecharModal() {
    const modal = document.getElementById('modalAluno');
    if (modal) {
      modal.classList.add('hidden');
    }
  }
}

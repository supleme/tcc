import { Component } from '@angular/core';
import { Student } from '../../services/student';

@Component({
  selector: 'app-alunos',
  standalone: false,
  templateUrl: './alunos.html',
  styleUrl: './alunos.css'
})
export class Alunos {
  studentSelect: any = null;
  students = [
  { id: 1, nome: 'Cesar Abreu', RA: 2311240, curso: 'Sistemas para Internet' },
  { id: 2, nome: 'Joana Silva', RA: 234456, curso: 'Engenharia Civil' },
  { id: 3, nome: 'Lucas Costa', RA: 234567, curso: 'Engenharia Mecanica' },
  { id: 4, nome: 'Maria Oliveira', RA: 256789, curso: 'Engenharia Eletrica' },
];

  /**
   * Inicializa o component, carregando a lista de alunos ao ser inicializado.
   * @param serviceStudent - Servi o respons vel por fornecer a lista de alunos.
   */
  constructor(private serviceStudent: Student){
    this.serviceStudent.getAlunos().subscribe({
      next: (response: any) => {
        this.students = response;
        console.log(response)
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }


  get num_students() {
    return this.students.length;
  }

  teste(aluno: any) {
    console.log(aluno);
  }

  showInformation(aluno: any) {
    this.studentSelect = aluno;
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

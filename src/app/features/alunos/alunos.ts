import { Component } from '@angular/core';
import { Student } from '../../services/student';
import { iStudent } from '../../interfaces/iStudent';
@Component({
  selector: 'app-alunos',
  standalone: false,
  templateUrl: './alunos.html',
  styleUrl: './alunos.css'
})
export class Alunos {
  studentSelect?: iStudent;
  students: iStudent[] = [];
  isModalInfOpen: boolean = false;
  isModalSubOpen: boolean = false;

  constructor(private serviceStudent: Student){
    this.serviceStudent.getAlunos().subscribe({
      next: (response: iStudent[]) => {
        this.students = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }


  get num_students() {
    return this.students.length;
  }

  showInformation(aluno: iStudent) {
    this.studentSelect = aluno;
    this.isModalInfOpen = true;
  }

  assignSubproject(aluno: iStudent) {
    this.studentSelect = aluno;
    this.isModalSubOpen = true;
  }

  fecharModalInf() {
    this.isModalInfOpen = false;
    this.studentSelect = undefined;
  }

  fecharModalSub(){
    this.isModalSubOpen = false;
    this.studentSelect = undefined;
  }
}

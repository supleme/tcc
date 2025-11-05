import { Component } from '@angular/core';
import { Student } from '../../services/student';
import { iStudent } from '../../interfaces/iStudent';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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

  constructor(private serviceStudent: Student, private router: Router){
    this.getStudents();
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

  createStudent(){
    this.router.navigate(['/cadastro-aluno']);
  }

  getStudents(){
    this.serviceStudent.getAlunos().subscribe({
      next: (response: iStudent[]) => {
        this.students = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  desativeStudent(student: iStudent){
     Swal.fire({
        title: "Desativar aluno?",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: "Sim",
        denyButtonText: `Não`
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Aluno desativado", student.id_usuario);
          this.serviceStudent.disableStudent(student.id_usuario).subscribe({
            next: (response: any) => {
              this.getStudents();
              Swal.fire("Aluno desativado!", "", "success");
            },
            error: (error: any) => {
              console.log(error);
              Swal.fire("Erro ao desativar aluno!", "", "error");
            }
          })
          // lógica de apagar subproject

        }
      });
  }

  activeStudent(student: iStudent){
     Swal.fire({
        title: "Ativar aluno?",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: "Sim",
        denyButtonText: `Não`
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Aluno ativado", student.id_usuario);
          this.serviceStudent.activeStudent(student.id_usuario).subscribe({
            next: (response: any) => {
              this.getStudents();
              Swal.fire("Aluno ativado!", "", "success");
            },
            error: (error: any) => {
              console.log(error);
              Swal.fire("Erro ao ativar aluno!", "", "error");
            }
          })
          // lógica de apagar subproject

        }
      });
  }
}

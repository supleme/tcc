import { Component, OnInit } from '@angular/core';
import { NodeTs } from '../../services/node.ts';
import { AuthService } from '../../services/auth-service.js';

@Component({
  selector: 'app-home-aluno',
  standalone: false,
  templateUrl: './home-aluno.html',
  styleUrl: './home-aluno.css'
})
export class HomeAluno implements OnInit{
  idStudent: number = 0;
  activities: any[] = [];
  subprojects: any[] = [];

  constructor(private serviceNode: NodeTs, private serviceAuth: AuthService) {

  }

  ngOnInit(){
    this.serviceAuth.getMe().subscribe({
      next: (res: any) => {
        this.idStudent = res.id_aluno;
        this.serviceNode.getNodeStudent(this.idStudent).subscribe({
        next: (response: any) => {
          this.activities = response.filter((activities: any) => activities.categoria === 'Atividade');
          this.subprojects = response.filter((subprojects: any) => subprojects.categoria === 'Subprojeto');
        },
        error: (error: any) => {
          console.log(error);
        }
      })
      },
      error: (error: any) => {
        console.log(error);
      }
    })


  }
}

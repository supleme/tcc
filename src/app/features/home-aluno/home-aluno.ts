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
  hoursAvailable: number = 0;
  monthlySummary: any[] = [];
  activities: any[] = [];
  subprojects: any[] = [];

  constructor(private serviceNode: NodeTs, private serviceAuth: AuthService) {

  }

  ngOnInit(){
    this.serviceAuth.getMe().subscribe({
      next: (res: any) => {
        this.idStudent = res.id_usuario;
        this.hoursAvailable = res.hours_available;
        this.serviceNode.getNodeStudent(this.idStudent).subscribe({
          next: (response: any) => {
            this.monthlySummary = response.summaryMonthly;
            this.activities = response.apontamentos.filter((activities: any) => activities.categoria === 'Atividade');
            const subprojects = response.apontamentos.filter((subprojects: any) => subprojects.categoria === 'Subprojeto');

            const map = new Map<number, any>();
            subprojects.forEach((subproject: any) => {
              if(!map.has(subproject.id_subprojeto)){
                map.set(subproject.id_subprojeto, subproject);
              }
            })
            this.subprojects = Array.from(map.values());
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

  getPercentage(hoursWorked: number): number {
    if (this.hoursAvailable > 0) {
      return Math.min(100, (hoursWorked / (this.hoursAvailable * 4)) * 100);
    }
    return 0;
  }
}

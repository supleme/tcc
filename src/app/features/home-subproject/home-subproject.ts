import { Component } from '@angular/core';
import { Subproject } from '../../services/subproject';
import { ISubproject } from '../../interfaces/iSubproject';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-subproject',
  standalone: false,
  templateUrl: './home-subproject.html',
  styleUrl: './home-subproject.css'
})
export class HomeSubproject {
  subprojects: ISubproject[] = [];
  isModalInfOpen: boolean = false;
  isModalSubOpen: boolean = false;

  constructor(private serviceSubroject: Subproject, private router: Router){
    this.getSubprojects();
  }

  getSubprojects(){
    this.serviceSubroject.getSubprojects().subscribe({
      next: (response: any) => {
        this.subprojects = response;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  get num_subprojects(){
    return this.subprojects.length;
  }

  deleteSubproject(subproject: ISubproject){
    Swal.fire({
      title: "Deseja apagar?",
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: `Não`
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Apagou subprojeto", subproject.id_subproject);
        let idSubproject = Number(subproject.id_subproject)
        this.serviceSubroject.deleteSubproject(idSubproject).subscribe({
          next: (response: any) => {
            this.getSubprojects();
            Swal.fire("Subprojeto apagado!", "", "success");
          },
          error: (error: any) => {
            console.log(error.error.message);
            Swal.fire("Erro ao apagar subprojeto!", error.error.message, "error");
          }
        })
      }
    });
  }

  createSubproject(){
    this.router.navigate(['/cadastro-subprojeto']);
  }
}

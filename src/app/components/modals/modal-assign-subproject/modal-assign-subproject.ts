import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iStudent } from '../../../interfaces/iStudent';
import { AuthService } from '../../../services/auth-service';
import { Subproject } from '../../../services/subproject';
import { ISubproject } from '../../../interfaces/iSubproject';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-assign-subproject',
  standalone: false,
  templateUrl: './modal-assign-subproject.html',
  styleUrl: './modal-assign-subproject.css'
})
export class ModalAssignSubproject {
  @Input() studentSelect?: iStudent
  @Output() fecharModal = new EventEmitter();
  subprojects: ISubproject[] = [];
  id_aluno: number = 0 ;
  loading = true;
  selectedSubprojectId: String | null = null;

  constructor(private serviceAuth: AuthService, private serviceSubproject: Subproject){
  }

  ngOnInit() {
    this.serviceSubproject.getSubprojects().subscribe({
      next: (response: any) => {
        this.subprojects = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
  onChangeSubproject(event: any) {
    this.selectedSubprojectId = event.target.value;
  }

  assignSubproject() {
    if(this.selectedSubprojectId === null || this.selectedSubprojectId === "Escolha um subprojeto") {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: "Selecione algum subprojeto!",
        confirmButtonColor: '#dc2626'
      });
      return;
    }
    this.id_aluno = this.studentSelect?.id_usuario || 0;

    this.serviceSubproject.assignSubproject(Number(this.selectedSubprojectId), this.id_aluno).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Apontamento criado!',
          text: response.message,
          confirmButtonColor: '#16a34a'
        });
        this.close();
        return;
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: "Não foi possível atribuir o subprojeto ao aluno!",
          confirmButtonColor: '#dc2626'
        });
        return;
      }
    })
  }

  close(){
    this.fecharModal.emit();
  }
}

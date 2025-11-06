import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Student } from '../../services/student';
import { FormBuilder } from '@angular/forms';
import { Apontamento } from '../../interfaces/iApontamento';
import Swal from 'sweetalert2';
import { NodeTs } from '../../services/node.ts';

@Component({
  selector: 'app-node-students',
  standalone: false,
  templateUrl: './node-students.html',
  styleUrl: './node-students.css'
})
export class NodeStudents {
  apontamentos: any[] = [];
  relatorioForm: any;
  id_aluno: number = 0;
  tipoUsuario: string = '';
  hours_available: number = 0;
  students: any[] = [];
  category: string = '';
  showModal = false;
  editForm: any;
  selectedApontamento: any = null;
  years: { value: string; label: string }[] = [];
  months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  constructor(private fb: FormBuilder, private serviceStudent: Student, private serviceAuth: AuthService, private serviceApontamento: NodeTs) {
    const currentYear = new Date().getFullYear();
    for (let i: number = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push({ value: i.toString(), label: i.toString() });
    }
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      horas_trabalhadas: [0],
      data_apontamento: ['']
    });
    const mesAtual = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const anoAtual = Number(new Date().getFullYear());

    this.relatorioForm = this.fb.group({
      category: ['Todas'],
      students: [''],
      month: [mesAtual],
      year: [anoAtual]
    });

    this.relatorioForm.get('category')?.valueChanges.subscribe((valor: string ) => {
      this.category = valor;
    });

    const user = this.serviceAuth.getUser();
    if (!user) {
      return;
    }

    this.id_aluno = user.id_usuario;
    this.tipoUsuario = user.type;
    this.hours_available = user.hours_available ?? 0;

    this.serviceStudent.getAlunos().subscribe({
      next: (response: any) => {
        if (this.tipoUsuario === 'Student') {
          const aluno = response.find((aluno: any) => aluno.id_usuario === this.id_aluno)
          this.students = [aluno];
          this.relatorioForm.patchValue({students: aluno.id_usuario});
        }
        else {
          this.students = response;
          this.relatorioForm.patchValue({students: 'Todos'});
        }
        const params = this.relatorioForm.value;
        this.loadApontamentos(params);
        const mesSelecionado = this.relatorioForm.get('month')?.value;
        const anoSelecionado = this.relatorioForm.get('year')?.value;

        this.relatorioForm.get('students')?.valueChanges.subscribe((idAlunoSelecionado: string | number) => {

          if (!idAlunoSelecionado || idAlunoSelecionado === 'Todos') {
            const params = {
              category: this.relatorioForm.get('category')?.value,
              students: 'Todos',
              month: mesSelecionado,
              year: anoSelecionado
            };
            this.loadApontamentos(params);
          } else {
            const params = {
              category: this.relatorioForm.get('category')?.value,
              students: idAlunoSelecionado,
              month: mesSelecionado,
              year: anoSelecionado
            };
            this.loadApontamentos(params);
          }
        });

        this.relatorioForm.get('category')?.valueChanges.subscribe((categoriaSelecionada: string) => {
          const idAlunoSelecionado = this.relatorioForm.get('students')?.value;
          const mesSelecionado = this.relatorioForm.get('month')?.value;

          const params = {
            category: categoriaSelecionada || 'Todas',
            students: !idAlunoSelecionado || idAlunoSelecionado === 'Todos' ? 'Todos' : idAlunoSelecionado,
            month: mesSelecionado,
            year: anoSelecionado
          };
          this.loadApontamentos(params);
        });

        this.relatorioForm.get('month')?.valueChanges.subscribe((mesSelecionado: string) => {
          const categoriaSelecionada = this.relatorioForm.get('category')?.value || 'Todas';
          const idAlunoSelecionado = this.relatorioForm.get('students')?.value;

          const params = {
            category: categoriaSelecionada,
            students: !idAlunoSelecionado || idAlunoSelecionado === 'Todos' ? 'Todos' : idAlunoSelecionado,
            month: mesSelecionado,
            year: anoSelecionado
          };

          this.loadApontamentos(params);
        });

        this.relatorioForm.get('year')?.valueChanges.subscribe((anoSelecionado: string) => {
          const categoriaSelecionada = this.relatorioForm.get('category')?.value || 'Todas';
          const idAlunoSelecionado = this.relatorioForm.get('students')?.value;

          const params = {
            category: categoriaSelecionada,
            students: !idAlunoSelecionado || idAlunoSelecionado === 'Todos' ? 'Todos' : idAlunoSelecionado,
            month: mesSelecionado,
            year: anoSelecionado
          };

          this.loadApontamentos(params);
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadApontamentos(params: any): void {
    this.serviceStudent.getNodeStudents(params).subscribe({
      next: (response: any) => {
        console.log('Apontamentos retornados:', response);
        this.apontamentos = response ? Object.values(response) : [];
      },
      error: (error: any) => {
        this.apontamentos = [];
        console.error('Erro ao carregar apontamentos:', error);
      }
    });


  }
  modifyNode(node: Apontamento) {
    this.selectedApontamento = node;
    this.editForm.patchValue({
      horas_trabalhadas: node.horas_trabalhadas || 0,
      data_apontamento: node.data_apontamento ? node.data_apontamento.split('T')[0] : ''
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedApontamento = null;
  }


  saveChanges() {
    const newHours = this.editForm.value.horas_trabalhadas;
    const newDateApontamento = this.editForm.value.data_apontamento;

    if (!this.selectedApontamento) return;

    const updated = {
      ...this.selectedApontamento,
      horas_trabalhadas: newHours,
    };

    const body = {
      id_apontamento: updated.id_apontamento,
      horas_trabalhadas: newHours,
      data_apontamento: newDateApontamento
    }
    console.log(" body", body);
    this.serviceApontamento.updateNode(body).subscribe({
      next: () => {
        const param = {
          category: this.relatorioForm.get('category')?.value,
          students: this.relatorioForm.get('students')?.value,
          month: this.relatorioForm.get('month')?.value,
          year: this.relatorioForm.get('year')?.value
        }
        this.loadApontamentos(param);
        Swal.fire("Sucesso", "Horas atualizadas com sucesso!", "success");
        this.closeModal();
      },
      error: (error) => {
        console.error(error);
        Swal.fire("Erro", "Não foi possível atualizar as horas.", "error");
      }
    });
  }

  deleteNode(node: Apontamento){
      Swal.fire({
        title: "Deseja apagar o apontamento?",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: "Sim",
        denyButtonText: `Não`
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Apagou apontamento", node.id_apontamento);
          this.serviceApontamento.deleteNode(node.id_apontamento).subscribe({
            next: (response: any) => {
              const param = {
                category: this.relatorioForm.get('category')?.value,
                students: this.relatorioForm.get('students')?.value,
                month: this.relatorioForm.get('month')?.value,
                year: this.relatorioForm.get('year')?.value
              }
              this.loadApontamentos(param);
              Swal.fire("Apontamento apagado!", "", "success");
            },
            error: (error: any) => {
              console.log(error.error.message);
              Swal.fire("Erro ao apagar apontamento!", error.error.message, "error");
            }
          })
        }
      });
    }
}

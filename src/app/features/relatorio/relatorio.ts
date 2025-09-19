import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Student } from '../../services/student';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ApexPlotOptions,
  ApexDataLabels,
  ApexLegend,
  ApexAxisChartSeries,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexFill,
  ApexMarkers,
  ApexAnnotations,
  ApexGrid,
  ApexStates,
  ApexNoData,

} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  annotations: ApexAnnotations;
  grid: ApexGrid;
  states: ApexStates;
  noData: ApexNoData;
};

interface Apontamento {
  id_apontamento: number;
  categoria: string;
  id_aluno: number;
  data_apontamento: string;
  horas_trabalhadas: number;
  midia?: string;
  id_subprojeto?: number | null;
  descricao?: string;
  data_criacao: string;
  aluno_nome?: string;
  subprojeto_nome?: string;
}

@Component({
  selector: 'app-relatorio',
  standalone: false,
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css'
})
export class Relatorio {
  @ViewChild("chart") chart!: ChartComponent;
  relatorioForm: any;
  category: string = '';
  students: any[] = [];
  id_aluno: number = 0;
  chartOptions: Partial<ChartOptions>;

  constructor(private fb: FormBuilder, private serviceStudent: Student, private serviceAuth: AuthService) {
    this.chartOptions = {
        series: [],
        chart: {
            height: 350,
            type: 'bar',
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
        colors: ['#00E396'],
        dataLabels: {
            formatter: function(val: any, opt: any) {
                const goals = opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex].goals;
                if (goals && goals.length) {
                    return `${val} / ${goals[0].value}`;
                }
                return val;
            }
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Atual', 'Esperado'],
            markers: {
                fillColors: ['#00E396', '#775DD0']
            }
        },
        xaxis: {}, // Inicialize com um objeto vazio
        yaxis: {}  // Inicialize com um objeto vazio
    };

  }

  ngOnInit(): void {
    this.relatorioForm = this.fb.group({
      category: ['Todas'],
      students: [''],
    });

    this.relatorioForm.get('category')?.valueChanges.subscribe((valor: string ) => {
      this.category = valor;
    });

    this.serviceAuth.getMe().subscribe({
      next: (response: any) => {
        this.id_aluno = response.id_aluno;
        this.serviceStudent.getAlunos().subscribe({
          next: (response: any) => {
            const usuario = this.serviceAuth.getMe();
            //if (usuario.tipo === 'Aluno') {
              const aluno = response.find((aluno: any) => aluno.id_aluno === this.id_aluno)
              this.students = [aluno];
              this.relatorioForm.patchValue({
                students: aluno.id_aluno
              });
            //}
            //else {
              // this.students = response;
              // this.relatorioForm.patchValue({
              //   students: 'Todos'
              //  });
            // }
            // this.students = response;
            // console.log(response)
            const params = this.relatorioForm.value;
            this.serviceStudent.getNodeStudents(params).subscribe({
              next: (response: any) => {
                console.log(response);
                const apontamentos: Apontamento[] = Object.values(response);
                this.chartOptions = {
                  ...this.chartOptions,
                  ...this.generateChartData(apontamentos)
                }
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
    })
  }

  generateChartData(apontamentos: Apontamento[]): Partial<ChartOptions> {
    const totalHorasAtividade = apontamentos
      .filter(ap => ap.categoria === 'Atividade')
      .reduce((sum, ap) => sum + (ap.horas_trabalhadas || 0), 0);

    const totalHorasSubprojeto = apontamentos
      .filter(ap => ap.categoria === 'Subprojeto')
      .reduce((sum, ap) => sum + (ap.horas_trabalhadas || 0), 0);

    const seriesData = [
      {
        x: 'Atividades',
        y: totalHorasAtividade,
        goals: [
          {
            name: 'Meta',
            value: 80,
            strokeWidth: 5,
            strokeHeight: 10,
            strokeColor: '#775DD0'
          }
        ]
      },
      {
        x: 'Subprojetos',
        y: totalHorasSubprojeto,
        goals: [
          {
            name: 'Meta',
            value: 120,
            strokeWidth: 5,
            strokeHeight: 10,
            strokeColor: '#775DD0'
          }
        ]
      }
    ];

    return {
      series: [
        {
          name: 'Realizado',
          data: seriesData
        }
      ]
    };
  }

  ExportExcel(){
    if(this.relatorioForm.valid){
      const params = this.relatorioForm.value;

      this.serviceStudent.getNodeStudents(params).subscribe({
        next: (response: any) => {
          const apontamentos: Apontamento[] = Object.values(response);

          let exportData: any[] = [];

          const alunosMap = new Map<string, Apontamento[]>();
          apontamentos.forEach(ap => {
            const alunoNome = ap.aluno_nome || 'Aluno Desconhecido';
            if (!alunosMap.has(alunoNome)) {
              alunosMap.set(alunoNome, []);
            }
            alunosMap.get(alunoNome)?.push(ap);
          });

          alunosMap.forEach((apontamentosAluno, alunoNome) => {
            exportData.push({ Aluno: alunoNome });

            const totalHorasAtividade = apontamentosAluno
              .filter(ap => ap.categoria === 'Atividade')
              .reduce((sum, ap) => sum + (ap.horas_trabalhadas || 0), 0);

            const totalHorasSubprojeto = apontamentosAluno
              .filter(ap => ap.categoria === 'Subprojeto')
              .reduce((sum, ap) => sum + (ap.horas_trabalhadas || 0), 0);

            const categorias = new Map<string, Apontamento[]>();
            apontamentosAluno.forEach(ap => {
              if (!categorias.has(ap.categoria)) {
                categorias.set(ap.categoria, []);
              }
              categorias.get(ap.categoria)?.push(ap);
            });

            categorias.forEach((aps, categoria) => {
              exportData.push({ Categoria: categoria });

              if (categoria === 'Subprojeto') {
                const subprojetosMap = new Map<any, Apontamento[]>();
                aps.forEach(ap => {
                  const subprojetoNome = ap.id_subprojeto || '---';
                  if (!subprojetosMap.has(subprojetoNome)) {
                    subprojetosMap.set(subprojetoNome, []);
                  }
                  subprojetosMap.get(subprojetoNome)?.push(ap);
                });

                subprojetosMap.forEach((subprojetoAps, subprojetoNome) => {
                  exportData.push({ Subprojeto: subprojetoNome });
                  subprojetoAps.forEach(ap => {
                    exportData.push({
                      Descrição: ap.descricao ?? '---',
                      "Horas": ap.horas_trabalhadas ?? 0
                    });
                  });
                });

              } else {
                aps.forEach(ap => {
                  exportData.push({
                    Descrição: ap.descricao ?? '---',
                    "Horas": ap.horas_trabalhadas ?? 0
                  });
                });
              }
              exportData.push({});
            });

            exportData.push({});
            exportData.push({ Categoria: 'Total de Horas', Descrição: 'Atividade', "Horas": totalHorasAtividade });
            exportData.push({ Categoria: 'Total de Horas', Descrição: 'Subprojeto', "Horas": totalHorasSubprojeto });
            exportData.push({});
          });

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: true });
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Relatório");

          const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, `Relatorio.xlsx`);
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }
  }
}

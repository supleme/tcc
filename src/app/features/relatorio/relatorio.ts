import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Student } from '../../services/student';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {ApexNonAxisChartSeries, ApexResponsive, ApexChart, ChartComponent, ApexPlotOptions, ApexDataLabels, ApexLegend, ApexAxisChartSeries, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ApexTitleSubtitle, ApexFill, ApexMarkers, ApexAnnotations, ApexGrid, ApexStates, ApexNoData } from "ng-apexcharts";
import { Apontamento } from '../../interfaces/iApontamento';
import { environment } from '../../environments/environment';

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
  tipoUsuario: string = '';
  hours_available: number = 0;
  chartOptions: Partial<ChartOptions>;
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
  private readonly API_BASE_URL = environment.storageBaseUrl;

  constructor(private fb: FormBuilder, private serviceStudent: Student, private serviceAuth: AuthService) {
    this.chartOptions = {
        series: [],
        chart: {
            height: 350,
            type: 'bar',
            toolbar: { show: false}
        },
        plotOptions: {
            bar: { horizontal: true }
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
            customLegendItems: ['Atual (Horas)', 'Esperado (Horas)'],
            markers: {
                fillColors: ['#00E396', '#775DD0']
            }
        },
        xaxis: {},
        yaxis: {}
    };
    const currentYear = new Date().getFullYear();
    for (let i: number = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push({ value: i.toString(), label: i.toString() });
    }
  }

  ngOnInit(): void {
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
        this.loadChartData(params);
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
            this.loadChartData(params);
          } else {
            const params = {
              category: this.relatorioForm.get('category')?.value,
              students: idAlunoSelecionado,
              month: mesSelecionado,
              year: anoSelecionado
            };
            this.loadChartData(params);
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
          this.loadChartData(params);
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

          this.loadChartData(params);
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

          this.loadChartData(params);
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  loadChartData(params: any) {
    this.serviceStudent.getNodeStudents(params).subscribe({
      next: (response: any) => {
        if(!response){
          this.chartOptions = {
            ...this.chartOptions,
            series: [],
            xaxis: { categories: [] },
            noData: { text: 'Sem dados' }
          };
          return;
        }
        const apontamentos: Apontamento[] = Object.values(response);
        this.chartOptions = {
          ...this.chartOptions,
          ...this.generateChartData(apontamentos)
        };
      },
      error: (error: any) => {
        console.error('Erro ao carregar dados:', error);
        this.chartOptions = {
          ...this.chartOptions,
          series: [],
          xaxis: { categories: [] },
          noData: { text: 'Sem dados' }
        };
      }
    });
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
        // goals: [
        //   {
        //     name: 'Meta',
        //     value: 10,
        //     strokeWidth: 5,
        //     strokeHeight: 10,
        //     strokeColor: '#775DD0'
        //   }
        // ]
      },
      {
        x: 'Subprojetos',
        y: totalHorasSubprojeto,
        // goals: [
        //   {
        //     name: 'Meta',
        //     value: 10,
        //     strokeWidth: 5,
        //     strokeHeight: 10,
        //     strokeColor: '#775DD0'
        //   }
        // ]
      },
      {
        x: 'Total',
        y: totalHorasAtividade + totalHorasSubprojeto,
        goals: [
          {
            name: 'Meta',
            value: this.hours_available * 4,
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

  ExportWord() {
    if (!this.relatorioForm.valid) {
      return;
    }
    const params = this.relatorioForm.value;

    this.serviceStudent.getNodeStudents(params).subscribe({
        next: (response: any) => {
            const apontamentos: Apontamento[] = Object.values(response);

            const htmlContent = this.generateHtmlForWord(apontamentos);

            const blob = new Blob(['\ufeff', htmlContent], {
                type: 'application/msword'
            });

            saveAs(blob, `Relatorio_Apontamentos.doc`);
        },
        error: (error: any) => {
            console.error('Erro ao carregar dados para exportação Word:', error);
        }
    });
  }

  generateHtmlForWord(apontamentos: Apontamento[]): string {
    const alunosMap = new Map<string, Apontamento[]>();
    const COLSPAN_COUNT = 3;
    apontamentos.forEach(ap => {
        const alunoNome = ap.aluno_nome || 'Aluno Desconhecido';
        if (!alunosMap.has(alunoNome)) {
            alunosMap.set(alunoNome, []);
        }
        alunosMap.get(alunoNome)?.push(ap);
    });

    let totalGeralAtividade = 0;
    let totalGeralSubprojeto = 0;

    let html = '<html><head><meta charset="utf-8"></head><body>';
    html += '<h1>Relatório de Apontamentos</h1>';

    alunosMap.forEach((apontamentosAluno, alunoNome) => {
        html += `<h2>Aluno: ${alunoNome}</h2>`;
        html += '<table border="1" style="width:100%; border-collapse: collapse;">';

        html += '<thead><tr><th>Categoria</th><th>Descrição</th><th>Horas</th></tr></thead><tbody>';

        const totalHorasAtividade = apontamentosAluno
            .filter(ap => ap.categoria === 'Atividade')
            .reduce((sum, ap) => sum + (ap.horas_trabalhadas || 0), 0);

        const totalHorasSubprojeto = apontamentosAluno
            .filter(ap => ap.categoria === 'Subprojeto')
            .reduce((sum, ap) => sum + (ap.horas_trabalhadas || 0), 0);

        totalGeralAtividade += totalHorasAtividade;
        totalGeralSubprojeto += totalHorasSubprojeto;

        apontamentosAluno.forEach(ap => {
            const mediaUrl = ap.midia ? `${this.API_BASE_URL}/${ap.midia}` : null;
            html += `
                <tr>
                    <td>${ap.categoria ?? '---'}</td>
                    <td>${ap.descricao ?? '---'}</td>
                    <td>${ap.horas_trabalhadas ?? 0}</td>
                </tr>
            `;

            if (mediaUrl) {
                const mediaContent = `
                    <a href="${mediaUrl}" target="_blank">Ver Mídia</a>
                    <br>
                    <img src="${mediaUrl}" alt="Mídia" style="max-width: 75px; height: auto;">
                `;
                html += `
                    <tr>
                        <td colspan="${COLSPAN_COUNT}" style="padding-left: 20px; background-color: #f9f9f9;">
                            <span style="font-weight: bold;">Mídia Anexada:</span> ${mediaContent}
                        </td>
                    </tr>
                `;
            }
        });

        html += `
            <tr>
                <td colspan="${COLSPAN_COUNT - 1}" style="text-align: right; font-weight: bold;">TOTAL ATIVIDADE:</td>
                <td style="font-weight: bold;">${totalHorasAtividade}</td>
            </tr>
            <tr>
                <td colspan="${COLSPAN_COUNT - 1}" style="text-align: right; font-weight: bold;">TOTAL SUBPROJETO:</td>
                <td style="font-weight: bold;">${totalHorasSubprojeto}</td>
            </tr>
            <tr>
                <td colspan="${COLSPAN_COUNT - 1}" style="text-align: right; font-weight: bold;">TOTAL GERAL DO ALUNO:</td>
                <td style="font-weight: bold;">${totalHorasAtividade + totalHorasSubprojeto}</td>
            </tr>
        `;

        html += '</tbody></table><br><br>';
    });

    const totalGeral = totalGeralAtividade + totalGeralSubprojeto;
    html += '<h2>RESUMO GERAL DO RELATÓRIO</h2>';
    html += '<table border="1" style="width:300px; border-collapse: collapse;"><tbody>';
    html += `<tr><td>TOTAL ATIVIDADE</td><td>${totalGeralAtividade}</td></tr>`;
    html += `<tr><td>TOTAL SUBPROJETO</td><td>${totalGeralSubprojeto}</td></tr>`;
    html += `<tr><td>TOTAL ACUMULADO</td><td>${totalGeral}</td></tr>`;
    html += '</tbody></table>';

    html += '</body></html>';
    return html;
}
}

export interface Apontamento {
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

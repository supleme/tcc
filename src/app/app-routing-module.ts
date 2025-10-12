import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAluno } from './features/home-aluno/home-aluno';
import { Apontamento } from './features/apontamento/apontamento';
import { Relatorio } from './features/relatorio/relatorio';
import { Alunos } from './features/alunos/alunos';
import { Login } from './components/login/login';
import { CadastroAluno } from './features/cadastro-aluno/cadastro-aluno';
import { AuthGuard } from './guards/auth-guard';
import { RegisterSubproject } from './features/register-subproject/register-subproject';

const routes: Routes = [
  {path: '', component: HomeAluno, canActivate: [AuthGuard], data: { roles: ['Student'], title: 'Home' } },
  {path: 'apontamento', component: Apontamento, canActivate: [AuthGuard], data: { roles: ['Student'] } },
  {path: 'relatorio', component: Relatorio , canActivate: [AuthGuard], title: 'Relatório' },
  {path: 'alunos', component: Alunos, canActivate: [AuthGuard], data: { roles: ['Coordinator'], title: 'Gerenciar Alunos' } },
  {path: 'login', component: Login},
  {path: 'cadastro-aluno', component: CadastroAluno, data: { roles: ['Coordinator'], title: 'Cadastrar Aluno' }},
  {path: 'cadastro-subprojeto', component: RegisterSubproject, canActivate: [AuthGuard], data: { roles: ['Coordinator'], title: 'Cadastrar Subprojeto'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

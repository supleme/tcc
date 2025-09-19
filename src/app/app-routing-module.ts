import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAluno } from './features/home-aluno/home-aluno';
import { Apontamento } from './features/apontamento/apontamento';
import { Relatorio } from './features/relatorio/relatorio';
import { Alunos } from './features/alunos/alunos';
import { Login } from './components/login/login';
import { CadastroAluno } from './features/cadastro-aluno/cadastro-aluno';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  {path: '', component: HomeAluno, canActivate: [AuthGuard]},
  {path: 'apontamento', component: Apontamento, canActivate: [AuthGuard]},
  {path: 'relatorio', component: Relatorio , canActivate: [AuthGuard]},
  {path: 'alunos', component: Alunos , canActivate: [AuthGuard]},
  {path: 'login', component: Login},
  {path: 'cadastro-aluno', component: CadastroAluno, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

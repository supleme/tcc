import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAluno } from './features/home-aluno/home-aluno';
import { Apontamento } from './features/apontamento/apontamento';
import { Relatorio } from './features/relatorio/relatorio';
import { Alunos } from './features/alunos/alunos';
import { Login } from './components/login/login';
import { CadastroAluno } from './features/cadastro-aluno/cadastro-aluno';

const routes: Routes = [
  {path: '', component: HomeAluno},
  {path: 'apontamento', component: Apontamento},
  {path: 'relatorio', component: Relatorio},
  {path: 'alunos', component: Alunos},
  {path: 'login', component: Login},
  {path: 'cadastro-aluno', component: CadastroAluno},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

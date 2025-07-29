import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeAluno } from './features/home-aluno/home-aluno';
import { Apontamento } from './features/apontamento/apontamento';

const routes: Routes = [
  {path: '', component: HomeAluno},
  {path: 'apontamento', component: Apontamento},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

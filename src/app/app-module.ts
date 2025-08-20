import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { HomeAluno } from './features/home-aluno/home-aluno';
import { Apontamento } from './features/apontamento/apontamento';
import { Relatorio } from './features/relatorio/relatorio';
import { Alunos } from './features/alunos/alunos';
import { Login } from './components/login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CadastroAluno } from './features/cadastro-aluno/cadastro-aluno';
@NgModule({
  declarations: [
    App,
    Navbar,
    HomeAluno,
    Apontamento,
    Relatorio,
    Alunos,
    Login,
    CadastroAluno,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }

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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CadastroAluno } from './features/cadastro-aluno/cadastro-aluno';
import { jwtInterceptor } from './interceptor/jwt-interceptor';
import { NgApexchartsModule } from "ng-apexcharts";
import { RegisterSubproject } from './features/register-subproject/register-subproject';
import { ModalInformationsStudent } from './components/modals/modal-informations-student/modal-informations-student';
import { ModalAssignSubproject } from './components/modals/modal-assign-subproject/modal-assign-subproject';

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
    RegisterSubproject,
    ModalInformationsStudent,
    ModalAssignSubproject,
  ],
  imports: [
    NgApexchartsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: jwtInterceptor, multi: true},
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }

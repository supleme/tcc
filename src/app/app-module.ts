import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { HomeAluno } from './features/home-aluno/home-aluno';
import { Apontamento } from './features/apontamento/apontamento';

@NgModule({
  declarations: [
    App,
    Navbar,
    HomeAluno,
    Apontamento
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }

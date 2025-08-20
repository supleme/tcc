import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Test {
  constructor( private http: HttpClient){
  }

  getAlunos(): any {
    return this.http.get('http://localhost:8000/alunos');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Student {

  apiUrl = 'http://localhost:8000/api/alunos';

  constructor( private http: HttpClient){}

  registerStudent(body: any) {
    return this.http.post(this.apiUrl, body);
  }


  getAlunos(): any {
    return this.http.get(this.apiUrl);
  }
}

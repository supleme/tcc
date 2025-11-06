import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface NodeStudents {
  category: string
  students: string
  month: string
  year: string
}

@Injectable({
  providedIn: 'root'
})
export class Student {

  apiUrl = `${environment.apiUrl}/alunos`;

  constructor( private http: HttpClient){}

  registerStudent(body: any) {
    return this.http.post(this.apiUrl, body);
  }

  getAlunos(): any {
    return this.http.get(this.apiUrl);
  }

  getNodeStudents(body: NodeStudents) {
    // console.log(`getNodeStudents ${this.apiUrl}/report/${body?.category}/${body?.students}/${body?.month}/${body?.year}`);
    return this.http.get(`${this.apiUrl}/report/${body?.category}/${body?.students}/${body?.month}/${body?.year}`);
  }

  disableStudent(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/disable`, null);
  }

  activeStudent(id: number) {
    return this.http.post(`${this.apiUrl}/${id}/active`, null);
  }
}

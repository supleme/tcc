import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeTs {
  apiUrl = `${environment.apiUrl}/apontamentos`;

  constructor( private http: HttpClient){}

  registerNode(body: FormData) {
    return this.http.post(this.apiUrl, body);
  }


  getNode(): any {
    return this.http.get(this.apiUrl);
  }

  getNodeStudent(id: number) {
    return this.http.get(`${this.apiUrl}/aluno/${id}`);
  }

  deleteNode(id: number){
    return this.http.post(`${this.apiUrl}/delete/${id}`, null);
  }

  updateNode(body: any) {
    return this.http.post(`${this.apiUrl}/update`, body);
  }
}

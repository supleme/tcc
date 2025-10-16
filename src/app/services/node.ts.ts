import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeTs {
  apiUrl = 'http://localhost:8000/api/apontamentos';

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
}

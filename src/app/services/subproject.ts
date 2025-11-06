import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISubproject } from '../interfaces/iSubproject';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Subproject {
  apiUrl = `${environment.apiUrl}/subprojects`;

  constructor( private http: HttpClient){}

  registerSubproject(body: ISubproject){
    return this.http.post(this.apiUrl, body);
  }

  getSubprojects(): any {
    return this.http.get(this.apiUrl);
  }

  assignSubproject(subprojectId: number | undefined, userId: any | undefined,){
    return this.http.post(`${this.apiUrl}/${subprojectId}/users/${userId}`, {});
  }

  getSubprojectByUser(id: number) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  deleteSubproject(id: number){
    return this.http.post(`${this.apiUrl}/delete/${id}`, null);
  }
}

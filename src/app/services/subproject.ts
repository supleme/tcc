import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISubproject } from '../interfaces/iSubproject';

@Injectable({
  providedIn: 'root'
})
export class Subproject {

  apiUrl = 'http://localhost:8000/api/subprojects';

  constructor( private http: HttpClient){}

  registerSubproject(body: ISubproject){
    return this.http.post(this.apiUrl, body);
  }
}

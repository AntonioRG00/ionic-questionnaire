import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idioma, Perfil } from '../interfaces/cuestionario';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  public getAllData(): Observable<Idioma[]>{
    return this.httpClient.get<Idioma[]>('https://questionnaire-spring-rest.herokuapp.com/rest/all');
  }
}

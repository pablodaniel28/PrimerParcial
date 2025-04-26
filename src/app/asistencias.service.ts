import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Asistencia } from './models/asistencias';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasService {

  private BASE_URL = "http://localhost:8080/asistencias";

  constructor(private http: HttpClient) { }

  async getAllAsistencia(token: string): Promise<Asistencia[]> {
    const url = `${this.BASE_URL}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const response = await this.http.get<Asistencia[]>(url, { headers }).toPromise();
    return response || [];
  }

}

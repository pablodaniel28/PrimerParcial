import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Grupos } from './models/grupos';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private BASE_URL = "http://localhost:8080/grupos";

  constructor(private http: HttpClient) { }

  async getAllGrupos(token: string): Promise<Grupos[]> {
    const url = `${this.BASE_URL}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const response = await this.http.get<Grupos[]>(url, { headers }).toPromise();
    return response || [];
  }

  async createGrupo(grupoData: {
    nombre: string;
    cupo: string;
    carrera: { id: number };
    gestion: { id: number };
    materia: { id: number };
    ourUsers: { id: number };
    sistemaacademico: { id: number };
    horario:{id: number}
  }, token: string): Promise<Grupos> {
    const url = `${this.BASE_URL}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.post<any>(url, grupoData, { headers }).toPromise();
      return response as Grupos;
    } catch (error) {
      console.error('Error creating grupo:', error);
      throw error;
    }
  }

  async updateGrupo(id: number, grupoData: {
    nombre: string;
    cupo: string;
    carrera: { id: number };
    gestion: { id: number };
    materia: { id: number };
    ourUsers: { id: number };
    sistemaacademico: { id: number };
    horario:{id: number}
  }, token: string): Promise<Grupos> {
    const url = `${this.BASE_URL}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.put<any>(url, grupoData, { headers }).toPromise();
      return response as Grupos;
    } catch (error) {
      console.error('Error updating grupo:', error);
      throw error;
    }
  }
}

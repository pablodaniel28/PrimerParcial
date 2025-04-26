import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Carreras } from './models/carreras';

@Injectable({
  providedIn: 'root'
})
export class CarrerasService {

  private BASE_URL = "http://localhost:8080/carreras";

  constructor(private http: HttpClient) { }

  async getAllCarreras(token: string): Promise<Carreras[]> {
    const url = `${this.BASE_URL}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const response = await this.http.get<Carreras[]>(url, { headers }).toPromise();
    return response || [];
  }

  async createCarrera(carreraData: { nro: string; nombre: string; facultad: { id: number}; }, token: string): Promise<Carreras> {
    const url = `${this.BASE_URL}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      // Realizar la solicitud POST para crear la carrera
      const response = await this.http.post<any>(url, carreraData, { headers }).toPromise();
      return response as Carreras; // Convertir la respuesta al tipo Carreras
    } catch (error) {
      console.error('Error creating carrera:', error);
      throw error;
    }
  }

  async updateCarrera(id: number, carreraData: { nro: string; nombre: string; facultad: { id: number}; }, token: string): Promise<Carreras> {
    const url = `${this.BASE_URL}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    try {
      const response = await this.http.put<any>(url, carreraData, { headers }).toPromise();
      return response as Carreras;
    } catch (error) {
      console.error('Error updating carrera:', error);
      throw error;
    }
  }

}

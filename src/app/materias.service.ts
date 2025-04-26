import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Materias } from './models/materias';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

async getAllMaterias(token: string): Promise<Materias[]> {
    const url = `${this.BASE_URL}/materias`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const response = await this.http.get<Materias[]>(url, { headers }).toPromise();
    return response || []; // Ensure the response is not undefined
  }

  async guardarMateria(materia: Materias, token: string): Promise<any> {
    const url = `${this.BASE_URL}/materias`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.post(url, materia, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async editarMateria(materia: Materias, token: string): Promise<any> {
    const url = `${this.BASE_URL}/materias/${materia.id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.put(url, materia, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async eliminarMateria(id: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/materias/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.delete(url, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  // Add this method
  async getMateriaById(id: number, token: string): Promise<Materias | null> {
    const url = `${this.BASE_URL}/materias/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.get<Materias>(url, { headers }).toPromise();
      return response || null;
    } catch (error) {
      console.error('Error fetching materia by ID:', error);
      return null;
    }
  }

}

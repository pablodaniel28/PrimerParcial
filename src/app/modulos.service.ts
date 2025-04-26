import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Modulos } from './models/modulos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async getAllModulos(token: string): Promise<Modulos[]> {
    const url = `${this.BASE_URL}/modulos`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const response = await this.http.get<Modulos[]>(url, { headers }).toPromise();
    return response || []; // Ensure the response is not undefined
  }

  async guardarModulo(modulo: Modulos, token: string): Promise<any> {
    const url = `${this.BASE_URL}/modulos`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.post(url, modulo, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async editarModulo(modulo: Modulos, token: string): Promise<any> {
    const url = `${this.BASE_URL}/modulos/${modulo.id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.put(url, modulo, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async eliminarModulo(id: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/modulos/${id}`;
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
  async getModuloById(id: number, token: string): Promise<Modulos | null> {
    const url = `${this.BASE_URL}/modulos/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.get<Modulos>(url, { headers }).toPromise();
      return response || null;
    } catch (error) {
      console.error('Error fetching modulo by ID:', error);
      return null;
    }
  }

}

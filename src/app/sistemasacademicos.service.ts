import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sistemasacademicos } from './models/sistemasacademicos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SistemasacademicosService {

  private BASE_URL = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  async getAllSistemasacademicos(token: string): Promise<Sistemasacademicos[]> {
    const url = `${this.BASE_URL}/sistemasacademicos`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const response = await this.http.get<Sistemasacademicos[]>(url, { headers }).toPromise();
    console.log('Sistemas academicos recibidos:', response); // Verificar los datos aquí
    return response || []; // Asegúrate de devolver un array vacío en caso de que la respuesta sea undefined
  }
  async guardarSistemaacademico(sistemaacademico: Sistemasacademicos, token: string): Promise<any> {
    const url = `${this.BASE_URL}/sistemasacademicos`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.post(url, sistemaacademico, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async editarSistemaacademico(sistemaacademico: Sistemasacademicos, token: string): Promise<any> {
    const url = `${this.BASE_URL}/sistemasacademicos/${sistemaacademico.id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.put(url, sistemaacademico, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async eliminarSistemaacademico(id: number, token: string): Promise<any> {
    const url = `${this.BASE_URL}/sistemasacademicos/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      return await this.http.delete(url, { headers }).toPromise();
    } catch (error) {
      throw error;
    }
  }

  async getSistemaacademicoById(id: number, token: string): Promise<Sistemasacademicos | null> {
    const url = `${this.BASE_URL}/sistemasacademicos/${id}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    try {
      const response = await this.http.get<Sistemasacademicos>(url, { headers }).toPromise();
      return response || null;
    } catch (error) {
      console.error('Error fetching sistemaacademico by ID:', error);
      return null;
    }
  }

}

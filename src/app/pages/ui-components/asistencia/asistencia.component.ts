import { Component } from '@angular/core';
import { AsistenciasService } from 'src/app/asistencias.service';
import { Asistencia } from 'src/app/models/asistencias';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.scss'
})
export class AsistenciaComponent {
  asistencia: Asistencia[] = [];

  constructor(private asistenciaService: AsistenciasService) { }

  ngOnInit(): void {
    this.loadAsistencia();
  }

  async loadAsistencia() {
    try {
      const token = localStorage.getItem('token') || '';
      this.asistencia = await this.asistenciaService.getAllAsistencia(token);
      console.log('Asistencias cargadas:', this.asistencia);
    } catch (error) {
      console.error('Error cargando asistencias:', error);
    }
  }
}

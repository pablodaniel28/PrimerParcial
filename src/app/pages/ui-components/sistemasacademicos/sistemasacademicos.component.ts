
import { Component, OnInit } from '@angular/core';
import { SistemasacademicosService } from 'src/app/sistemasacademicos.service';
import { Sistemasacademicos } from 'src/app/models/sistemasacademicos';

@Component({

  selector: 'app-sistemasacademicos',
  templateUrl: './sistemasacademicos.component.html',
})
export class SistemasacademicosComponent implements OnInit {
  Sistemaacademico: any;

  constructor(private sistemasacademicosService: SistemasacademicosService) { } // Inyecta el servicio

  ngOnInit(): void {
    this.loadSistemasacademicos(); // Llama al método para cargar los sistemas académicos al inicializar el componente
  }

  hidden = false;
  sistemasacademicos: Sistemasacademicos[] = []; // Variable para almacenar los sistemas académicos

  async loadSistemasacademicos() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.sistemasacademicos = await this.sistemasacademicosService.getAllSistemasacademicos(token); // Obtén los sistemas académicos desde el servicio
    } catch (error) {
      console.error('Error loading sistemas académicos:', error); // Maneja los errores
    }
  }

  async guardarSistemaacademico(sistemaacademico: Sistemasacademicos) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.sistemasacademicosService.guardarSistemaacademico(sistemaacademico, token); // Guarda el sistema académico utilizando el servicio
      // Vuelve a cargar los sistemas académicos después de guardar
      this.loadSistemasacademicos();
    } catch (error) {
      console.error('Error saving sistema académico:', error); // Maneja los errores
    }
  }

  async editarSistemaacademico(sistemaacademico: Sistemasacademicos) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.sistemasacademicosService.editarSistemaacademico(sistemaacademico, token); // Edita el sistema académico utilizando el servicio
      // Vuelve a cargar los sistemas académicos después de editar
      this.loadSistemasacademicos();
    } catch (error) {
      console.error('Error editing sistema académico:', error); // Maneja los errores
    }
  }

  async eliminarSistemaacademico(id: number) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.sistemasacademicosService.eliminarSistemaacademico(id, token); // Elimina el sistema académico utilizando el servicio
      // Vuelve a cargar los sistemas académicos después de eliminar
      this.loadSistemasacademicos();
    } catch (error) {
      console.error('Error deleting sistema académico:', error); // Maneja los errores
    }
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}


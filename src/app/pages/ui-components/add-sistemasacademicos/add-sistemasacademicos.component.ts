import { Component, OnInit } from '@angular/core';
import { SistemasacademicosService } from 'src/app/sistemasacademicos.service'; // Cambio de MateriasService a SistemasAcademicosService
import { Sistemasacademicos } from 'src/app/models/sistemasacademicos'; // Cambio de Materias a SistemasAcademicos
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-sistemasacademicos', // Cambio de 'app-add-materias' a 'app-add-sistemasacademicos'
  templateUrl: './add-sistemasacademicos.component.html',
  styleUrls: ['./add-sistemasacademicos.component.scss']
})
export class AddSistemasacademicosComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  sistemasAcademicos: Sistemasacademicos[] = []; // Cambio de materias a sistemasAcademicos

  constructor(private sistemasacademicosService: SistemasacademicosService, private location: Location) { }

  ngOnInit(): void {
    this.loadSistemasacademicos(); // Cambio de loadMaterias a loadSistemasAcademicos
  }

  async loadSistemasacademicos() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.sistemasAcademicos = await this.sistemasacademicosService.getAllSistemasacademicos(token); // Cambio de getAllMaterias a getAllSistemasAcademicos
    } catch (error) {
      console.error('Error loading sistemas academicos:', error); // Maneja los errores
    }
  }

  async guardarSistemaacademico() { // Cambio de guardarMateria a guardarSistemaAcademico
    try {
      const sistemaAcademico: Sistemasacademicos = { id: this.id, nombre: this.nombre };
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.sistemasacademicosService.guardarSistemaacademico(sistemaAcademico, token); // Cambio de guardarMateria a guardarSistemaAcademico
      // Vuelve a cargar los sistemas academicos después de guardar
      this.loadSistemasacademicos(); // Cambio de loadMaterias a loadSistemasAcademicos
      // Regresa a la vista anterior
      this.location.back();
    } catch (error) {
      console.error('Error saving sistema academico:', error); // Maneja los errores
    }
  }
}

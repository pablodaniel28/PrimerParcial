import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SistemasacademicosService } from 'src/app/sistemasacademicos.service'; // Cambio de MateriasService a SistemasacademicosService
import { Sistemasacademicos } from 'src/app/models/sistemasacademicos'; // Cambio de Materias a Sistemasacademicos
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-up-sistemasacademicos', // Cambio de 'app-up-materias' a 'app-up-sistemasacademicos'
  standalone: true,
  imports: [FormsModule],
  templateUrl: './up-sistemasacademicos.component.html', // Cambio de 'up-materias.component.html' a 'up-sistemasacademicos.component.html'
  styleUrls: ['./up-sistemasacademicos.component.scss'] // Cambio de 'up-materias.component.scss' a 'up-sistemasacademicos.component.scss'
})
export class UpSistemasacademicosComponent implements OnInit { // Cambio de UpMateriasComponent a UpSistemasacademicosComponent
  id: number = 0;
  nombre: string = '';

  constructor(
    private route: ActivatedRoute,
    private sistemasacademicosService: SistemasacademicosService, // Cambio de MateriasService a SistemasacademicosService
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'] || 0;
      this.loadSistemaAcademico(this.id); // Cambio de loadMateria a loadSistemaAcademico
    });
  }

  async loadSistemaAcademico(id: number) { // Cambio de loadMateria a loadSistemaAcademico
    try {
      const token = localStorage.getItem('token') || '';
      const sistemaAcademico = await this.sistemasacademicosService.getSistemaacademicoById(id, token); // Cambio de getMateriaById a getSistemaAcademicoById
      if (sistemaAcademico) {
        this.nombre = sistemaAcademico.nombre;
      } else {
        console.error('No se encontró el sistema académico con el ID especificado.'); // Cambio de mensaje de error
      }
    } catch (error) {
      console.error('Error loading sistema académico:', error); // Cambio de mensaje de error
    }
  }

  async editarSistemaAcademico() { // Cambio de editarMateria a editarSistemaAcademico
    try {
      const token = localStorage.getItem('token') || '';
      const sistemaAcademico: Sistemasacademicos = { id: this.id, nombre: this.nombre }; // Cambio de Materias a Sistemasacademicos
      await this.sistemasacademicosService.editarSistemaacademico(sistemaAcademico, token); // Cambio de editarMateria a editarSistemaAcademico
      this.location.back();
    } catch (error) {
      console.error('Error editing sistema académico:', error); // Cambio de mensaje de error
    }
  }
}

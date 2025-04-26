import { Component, OnInit } from '@angular/core';
import { MateriasService } from 'src/app/materias.service';
import { Materias } from 'src/app/models/materias';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-materias',
  templateUrl: './add-materias.component.html',
  styleUrls: ['./add-materias.component.scss']
})
export class AddMateriasComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  sigla: string = '';
  materias: Materias[] = []; // Variable para almacenar las materias

  constructor(private materiasService: MateriasService, private location: Location) { }

  ngOnInit(): void {
    this.loadMaterias(); // Llama al método para cargar las materias al inicializar el componente
  }

  async loadMaterias() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.materias = await this.materiasService.getAllMaterias(token); // Obtén las materias desde el servicio
    } catch (error) {
      console.error('Error loading materias:', error); // Maneja los errores
    }
  }

  async guardarMateria() {
    try {
      const materia: Materias = { id: this.id, nombre: this.nombre, sigla: this.sigla };
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.materiasService.guardarMateria(materia, token); // Guarda la materia utilizando el servicio
      // Vuelve a cargar las materias después de guardar
      this.loadMaterias();
      // Regresa a la vista anterior
      this.location.back();
    } catch (error) {
      console.error('Error saving materia:', error); // Maneja los errores
    }
  }
}



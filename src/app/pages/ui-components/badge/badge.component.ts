import { Component, OnInit } from '@angular/core';
import { MateriasService } from 'src/app/materias.service';
import { Materias } from 'src/app/models/materias';


@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})

export class AppBadgeComponent implements OnInit {
Materia: any;

  constructor(private materiasService: MateriasService) { } // Inyecta el servicio

  ngOnInit(): void {
    this.loadMaterias(); // Llama al método para cargar las materias al inicializar el componente
  }

  hidden = false;
  materias: Materias[] = []; // Variable para almacenar las materias

  async loadMaterias() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.materias = await this.materiasService.getAllMaterias(token); // Obtén las materias desde el servicio
    } catch (error) {
      console.error('Error loading materias:', error); // Maneja los errores
    }
  }


  async guardarMateria(materia: Materias) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.materiasService.guardarMateria(materia, token); // Guarda la materia utilizando el servicio
      // Vuelve a cargar las materias después de guardar
      this.loadMaterias();
    } catch (error) {
      console.error('Error saving materia:', error); // Maneja los errores
    }
  }
  async editarMateria(materia: Materias) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.materiasService.editarMateria(materia, token); // Edita la materia utilizando el servicio
      // Vuelve a cargar las materias después de editar
      this.loadMaterias();
    } catch (error) {
      console.error('Error editing materia:', error); // Maneja los errores
    }
  }

  async eliminarMateria(id: number) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.materiasService.eliminarMateria(id, token); // Elimina la materia utilizando el servicio
      // Vuelve a cargar las materias después de eliminar
      this.loadMaterias();
    } catch (error) {
      console.error('Error deleting materia:', error); // Maneja los errores
    }
  }
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

}

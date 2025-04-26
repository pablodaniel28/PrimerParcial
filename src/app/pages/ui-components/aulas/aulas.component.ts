import { Component, OnInit } from '@angular/core';
import { AulasService } from 'src/app/aulas.service';
import { Aulas } from 'src/app/models/aulas';
import { Aulas2 } from 'src/app/models/aulas2';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
})
export class AulasComponent implements OnInit {
  Aula: any;

  constructor(private aulasService: AulasService) { } // Inyecta el servicio

  ngOnInit(): void {
    this.loadAulas(); // Llama al método para cargar las aulas al inicializar el componente
  }

  hidden = false;
  aulas: Aulas[] = []; // Variable para almacenar las aulas
  aulas2: Aulas2[] = []; // Variable para almacenar las aulas
  nuevo: any[] = []; // Variable para almacenar las aulas

  async loadAulas() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.aulas2 = await this.aulasService.getAllAulas(token); // Obtén las aulas desde el servicio
    } catch (error) {
      console.error('Error loading aulas:', error); // Maneja los errores
    }
  }

  async guardarAula(aula: Aulas) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.aulasService.guardarAula(aula, token); // Guarda el aula utilizando el servicio
      // Vuelve a cargar las aulas después de guardar
      this.loadAulas();
    } catch (error) {
      console.error('Error saving aula:', error); // Maneja los errores
    }
  }

  async editarAula(aula: Aulas2) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.aulasService.editarAula(aula, token); // Edita el aula utilizando el servicio
      // Vuelve a cargar las aulas después de editar
      this.loadAulas();
    } catch (error) {
      console.error('Error editing aula:', error); // Maneja los errores
    }
  }

  async eliminarAula(id: number) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.aulasService.eliminarAula(id, token); // Elimina el aula utilizando el servicio
      // Vuelve a cargar las aulas después de eliminar
      this.loadAulas();
    } catch (error) {
      console.error('Error deleting aula:', error); // Maneja los errores
    }
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}

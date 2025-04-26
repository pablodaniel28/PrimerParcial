import { Component, OnInit } from '@angular/core';
import { ModulosService } from 'src/app/modulos.service';
import { Modulos } from 'src/app/models/modulos';
@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.scss'
})
export class ModulosComponent implements OnInit {
  Modulo: any;

  constructor(private modulosService: ModulosService) { } // Inyecta el servicio

  ngOnInit(): void {
    this.loadModulos(); // Llama al método para cargar los modulos al inicializar el componente
  }

  hidden = false;
  modulos: Modulos[] = []; // Variable para almacenar los modulos

  async loadModulos() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.modulos = await this.modulosService.getAllModulos(token); // Obtén los modulos desde el servicio
    } catch (error) {
      console.error('Error loading modulos:', error); // Maneja los errores
    }
  }

  async guardarModulo(modulo: Modulos) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.modulosService.guardarModulo(modulo, token); // Guarda el modulo utilizando el servicio
      // Vuelve a cargar los modulos después de guardar
      this.loadModulos();
    } catch (error) {
      console.error('Error saving modulo:', error); // Maneja los errores
    }
  }

  async editarModulo(modulo: Modulos) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.modulosService.editarModulo(modulo, token); // Edita el modulo utilizando el servicio
      // Vuelve a cargar los modulos después de editar
      this.loadModulos();
    } catch (error) {
      console.error('Error editing modulo:', error); // Maneja los errores
    }
  }

  async eliminarModulo(id: number) {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.modulosService.eliminarModulo(id, token); // Elimina el modulo utilizando el servicio
      // Vuelve a cargar los modulos después de eliminar
      this.loadModulos();
    } catch (error) {
      console.error('Error deleting modulo:', error); // Maneja los errores
    }
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}

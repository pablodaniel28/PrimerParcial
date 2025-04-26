import { Component, OnInit } from '@angular/core';
import { ModulosService } from 'src/app/modulos.service';
import { Modulos } from 'src/app/models/modulos';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-modulos',
  templateUrl: './add-modulos.component.html',
  styleUrls: ['./add-modulos.component.scss']
})
export class AddModulosComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  nro: string = '';
  modulos: Modulos[] = []; // Variable para almacenar los modulos

  constructor(private modulosService: ModulosService, private location: Location) { }

  ngOnInit(): void {
    this.loadModulos(); // Llama al método para cargar los modulos al inicializar el componente
  }

  async loadModulos() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.modulos = await this.modulosService.getAllModulos(token); // Obtén los modulos desde el servicio
    } catch (error) {
      console.error('Error loading modulos:', error); // Maneja los errores
    }
  }

  async guardarModulo() {
    try {
      const modulo: Modulos = { id: this.id, nombre: this.nombre, nro: this.nro };
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      await this.modulosService.guardarModulo(modulo, token); // Guarda el modulo utilizando el servicio
      // Vuelve a cargar los modulos después de guardar
      this.loadModulos();
      // Regresa a la vista anterior
      this.location.back();
    } catch (error) {
      console.error('Error saving modulo:', error); // Maneja los errores
    }
  }
}

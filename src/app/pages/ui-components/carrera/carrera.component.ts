// carrera.component.ts
import { Component, OnInit } from '@angular/core';
import { CarrerasService } from 'src/app/carreras.service';
import { Carreras } from 'src/app/models/carreras';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
})
export class CarreraComponent implements OnInit {
  carreras: Carreras[] = [];

  constructor(private carreraService: CarrerasService) { }

  ngOnInit(): void {
    this.loadCarreras();
  }

  async loadCarreras() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.carreras = await this.carreraService.getAllCarreras(token);
      console.log('Carreras cargadas:', this.carreras); // Muestra las carreras cargadas en la consola
    } catch (error) {
      console.error('Error cargando carreras:', error); // Maneja los errores al cargar las carreras
    }
  }

}

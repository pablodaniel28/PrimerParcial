// horario.component.ts

import { Component, OnInit } from '@angular/core';
import { HorariosService } from 'src/app/horarios.service';
import { Horario } from 'src/app/models/horario';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',

})
export class HorarioComponent implements OnInit {
  horarios: Horario[] = [];

  constructor(private horarioService: HorariosService) { }

  ngOnInit(): void {
    this.loadHorarios();
  }

  async loadHorarios() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.horarios = await this.horarioService.getAllHorarios(token);
      console.log('Horarios cargados:', this.horarios); // Muestra los horarios cargados en la consola
    } catch (error) {
      console.error('Error cargando Horarios:', error); // Maneja los errores al cargar los horarios
    }
  }

}

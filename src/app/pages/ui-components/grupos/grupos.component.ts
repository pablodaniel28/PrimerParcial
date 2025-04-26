import { Component, OnInit } from '@angular/core';
import { GruposService } from 'src/app/grupos.service';
import { Grupos } from 'src/app/models/grupos';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
})
export class GruposComponent implements OnInit {
  grupos: Grupos[] = [];

  constructor(private grupoService: GruposService) { }

  ngOnInit(): void {
    this.loadGrupos();
  }

  async loadGrupos() {
    try {
      const token = localStorage.getItem('token') || ''; // Obtén el token desde el localStorage
      this.grupos = await this.grupoService.getAllGrupos(token);
      console.log('Grupos cargados:', this.grupos); // Muestra los grupos cargados en la consola
    } catch (error) {
      console.error('Error cargando grupos:', error); // Maneja los errores al cargar los grupos
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CarrerasService } from 'src/app/carreras.service';
import { FacultadesService } from 'src/app/facultades.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs'; // Importa Observable
import { Facultad } from 'src/app/models/facultad';
import { Carreras } from 'src/app/models/carreras';

@Component({
  selector: 'app-add-carrera',
  templateUrl: './add-carrera.component.html',
})
export class AddCarreraComponent implements OnInit {
  nro: string = '';
  nombre: string = '';
  selectedFacultad: number | null = null;
  facultades: Facultad[] = [];

  constructor(
    private carreraService: CarrerasService,
    private facultadService: FacultadesService,
    private location: Location
  ) { }


  ngOnInit(): void {
    this.loadFacultades();
  }

  loadFacultades(): void {
    const token = localStorage.getItem('token') || '';
    this.facultadService.getAllFacultades(token).subscribe(
      (data: Facultad[]) => {
        this.facultades = data;
      },
      (error) => {
        console.error('Error loading facultades:', error);
      }
    );
  }
  async guardarCarrera(): Promise<void> {
    try {
      if (this.selectedFacultad !== null) {
        const carreraData = {
          nro: this.nro,
          nombre: this.nombre,
          facultad: {
            id: this.selectedFacultad
          }
        };
        const token = localStorage.getItem('token') || '';
        const response = await this.carreraService.createCarrera(carreraData, token);
        console.log('Carrera creada:', response);
        this.location.back(); // Regresa a la vista anterior después de guardar
      } else {
        console.error('Debe seleccionar una facultad');
      }
    } catch (error) {
      console.error('Error saving carrera:', error);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CarrerasService } from 'src/app/carreras.service';
import { FacultadesService } from 'src/app/facultades.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Facultad } from 'src/app/models/facultad';
import { Carreras } from 'src/app/models/carreras';

@Component({
  selector: 'app-up-carrera',
  templateUrl: './up-carrera.component.html',
})
export class UpCarreraComponent implements OnInit {
  nro: string = '';
  nombre: string = '';
  selectedFacultad: number | null = null;
  facultades: Facultad[] = [];
  carreraId: number | null = null;

  constructor(
    private carreraService: CarrerasService,
    private facultadService: FacultadesService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.carreraId = +this.route.snapshot.paramMap.get('id')!;
    this.loadFacultades();
    if (this.carreraId) {
      this.loadCarrera(this.carreraId);
    }
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

  loadCarrera(id: number): void {
    const token = localStorage.getItem('token') || '';
    this.carreraService.getAllCarreras(token).then(
      (carreras: Carreras[]) => {
        const carrera = carreras.find(c => c.id === id);
        if (carrera) {
          this.nro = carrera.nro;
          this.nombre = carrera.nombre;
          this.selectedFacultad = carrera.facultad.id;
        } else {
          console.error('Carrera not found');
        }
      },
      (error) => {
        console.error('Error loading carrera:', error);
      }
    );
  }

  async guardarCarrera(): Promise<void> {
    try {
      if (this.selectedFacultad !== null && this.carreraId !== null) {
        const carreraData = {
          nro: this.nro,
          nombre: this.nombre,
          facultad: { id: this.selectedFacultad }
        };
        const token = localStorage.getItem('token') || '';
        const response = await this.carreraService.updateCarrera(this.carreraId, carreraData, token);
        console.log('Carrera actualizada:', response);
        this.location.back(); // Regresa a la vista anterior después de guardar
      } else {
        console.error('Debe seleccionar una facultad y tener un ID de carrera válido');
      }
    } catch (error) {
      console.error('Error updating carrera:', error);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarrerasService } from 'src/app/carreras.service';
import { Carreras } from 'src/app/models/carreras';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-up-carreras',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './up-carreras.component.html',
  styleUrls: ['./up-carreras.component.scss']
})
export class UpCarrerasComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  nro: string = '';

  constructor(
    private route: ActivatedRoute,
    private carrerasService: CarrerasService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'] || 0;
      this.loadCarrera(this.id);
    });
  }

  async loadCarrera(id: number) {
    try {
      const token = localStorage.getItem('token') || '';
      const carrera = await this.carrerasService.getCarreraById(id, token);
      if (carrera) {
        this.nombre = carrera.nombre;
        this.nro = carrera.nro;
      } else {
        console.error('No se encontró la carrera con el ID especificado.');
      }
    } catch (error) {
      console.error('Error loading carrera:', error);
    }
  }

  async editarCarrera() {
   
  }
}

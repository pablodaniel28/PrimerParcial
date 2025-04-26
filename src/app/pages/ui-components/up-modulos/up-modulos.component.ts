import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModulosService } from 'src/app/modulos.service';
import { Modulos } from 'src/app/models/modulos';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-up-modulos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './up-modulos.component.html',
  styleUrls: ['./up-modulos.component.scss']
})
export class UpModulosComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  nro: string = '';

  constructor(
    private route: ActivatedRoute,
    private modulosService: ModulosService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'] || 0;
      this.loadModulo(this.id);
    });
  }

  async loadModulo(id: number) {
    try {
      const token = localStorage.getItem('token') || '';
      const modulo = await this.modulosService.getModuloById(id, token);
      if (modulo) {
        this.nombre = modulo.nombre;
        this.nro = modulo.nro;
      } else {
        console.error('No se encontró el modulo con el ID especificado.');
      }
    } catch (error) {
      console.error('Error loading modulo:', error);
    }
  }

  async editarModulo() {
    try {
      const token = localStorage.getItem('token') || '';
      const modulo: Modulos = { id: this.id, nombre: this.nombre, nro: this.nro };
      await this.modulosService.editarModulo(modulo, token);
      this.location.back();
    } catch (error) {
      console.error('Error editing modulo:', error);
    }
  }
}

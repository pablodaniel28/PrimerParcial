import { Component, OnInit } from '@angular/core';
import { FacultadesService } from 'src/app/facultades.service';
import { Location } from '@angular/common';
import { Facultad } from 'src/app/models/facultad';

@Component({
  selector: 'app-add-facultad',
  templateUrl: './add-facultad.component.html',
  styleUrls: ['./add-facultad.component.scss']
})
export class AddFacultadComponent implements OnInit {
  codigo: string = '';
  nombre: string = '';

  constructor(private facultadesService: FacultadesService, private location: Location) { }

  ngOnInit(): void {
    // Puedes inicializar datos adicionales si es necesario
  }

  guardarFacultad() {
    try {
      const token = localStorage.getItem('token') || '';
      const nuevaFacultad: Facultad = {
        codigo: this.codigo, nombre: this.nombre,
        id: 0
      };

      this.facultadesService.guardarFacultad(nuevaFacultad, token).subscribe({
        next: (facultad) => {
          console.log('Facultad creada:', facultad);
          // Aquí puedes añadir lógica adicional después de crear la facultad
          // Por ejemplo, redireccionar a otra página o mostrar un mensaje de éxito
          this.location.back(); // Regresa a la vista anterior
        },
        error: (error) => {
          console.error('Error al crear la facultad:', error);
          // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje al usuario
        }
      });
    } catch (error) {
      console.error('Error saving facultad:', error);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FacultadesService } from 'src/app/facultades.service';
import { Facultad } from 'src/app/models/facultad';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrls: ['./facultad.component.scss'] // Asegúrate de tener los estilos adecuados
})
export class FacultadComponent implements OnInit {
  facultades: Facultad[] = [];

  constructor(private facultadesService: FacultadesService, private router: Router) { }

  ngOnInit(): void {
    this.cargarFacultades();
  }

  cargarFacultades() {
    try {
      const token = localStorage.getItem('token') || '';
      this.facultadesService.getAllFacultades(token).subscribe({
        next: (facultades) => {
          this.facultades = facultades;
        },
        error: (error) => {
          console.error('Error cargando facultades:', error);
        }
      });
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }

  editarFacultad(id: number) {
    this.router.navigate(['/ui-components/upmaterias'], { queryParams: { id } });
    // Reemplaza '/ui-components/upmaterias' con la ruta correcta para editar una facultad
  }

  eliminarFacultad(id: number) {
    try {
      const token = localStorage.getItem('token') || '';
      this.facultadesService.eliminarFacultad(id, token).subscribe({
        next: () => {
          console.log('Facultad eliminada correctamente');
          // Actualizar la lista de facultades después de eliminar
          this.cargarFacultades();
        },
        error: (error) => {
          console.error('Error al eliminar facultad:', error);
        }
      });
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }
}

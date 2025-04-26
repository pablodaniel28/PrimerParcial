import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MateriasService } from 'src/app/materias.service';
import { Materias } from 'src/app/models/materias';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-up-materias',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './up-materias.component.html',
  styleUrls: ['./up-materias.component.scss']
})
export class UpMateriasComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  sigla: string = '';

  constructor(
    private route: ActivatedRoute,
    private materiasService: MateriasService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'] || 0;
      this.loadMateria(this.id);
    });
  }

  async loadMateria(id: number) {
    try {
      const token = localStorage.getItem('token') || '';
      const materia = await this.materiasService.getMateriaById(id, token);
      if (materia) {
        this.nombre = materia.nombre;
        this.sigla = materia.sigla;
      } else {
        console.error('No se encontró la materia con el ID especificado.');
      }
    } catch (error) {
      console.error('Error loading materia:', error);
    }
  }

  async editarMateria() {
    try {
      const token = localStorage.getItem('token') || '';
      const materia: Materias = { id: this.id, nombre: this.nombre, sigla: this.sigla };
      await this.materiasService.editarMateria(materia, token);
      this.location.back();
    } catch (error) {
      console.error('Error editing materia:', error);
    }
  }
}

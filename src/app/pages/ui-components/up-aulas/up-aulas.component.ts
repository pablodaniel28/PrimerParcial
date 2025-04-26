import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AulasService } from 'src/app/aulas.service'; // Cambio de ModulosService a AulasService
import { Aulas } from 'src/app/models/aulas'; // Cambio de Modulos a Aulas
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Aulas2 } from 'src/app/models/aulas2';
import { ModulosService } from 'src/app/modulos.service';
import { Modulos } from 'src/app/models/modulos';
@Component({
  selector: 'app-up-aulas', // Cambio de 'app-up-modulos' a 'app-up-aulas'
  standalone: true,
  imports: [FormsModule],
  templateUrl: './up-aulas.component.html',
  styleUrls: ['./up-aulas.component.scss']
})
export class UpAulasComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  modulos: Modulos[] = [];
  selectedModulo: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private aulasService: AulasService, // Cambio de modulosService a aulasService
    private location: Location,
    private modulosService: ModulosService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'] || 0;
      this.loadAula(this.id);
      console.log(this.id);
    });
    this.loadModulos();
  }
  async loadModulos() {
    try {
      const token = localStorage.getItem('token') || '';
      this.modulos = await this.modulosService.getAllModulos(token);
    } catch (error) {
      console.error('Error loading modulos:', error);
    }
  }
  async loadAula(id: number) { // Cambio de loadModulo a loadAula
    try {
      const token = localStorage.getItem('token') || '';
      const aula = await this.aulasService.getAulaById(id, token); // Cambio de getModuloById a getAulaById
      if (aula) {
        this.nombre = aula.nombre;

      } else {
        console.error('No se encontró el aula con el ID especificado.');
      }
    } catch (error) {
      console.error('Error loading aula:', error); // Cambio de Error loading modulo a Error loading aula
    }
  }

  async editarAula() { // Cambio de editarModulo a editarAula
    try {
      const token = localStorage.getItem('token') || '';
      const aula: Aulas2 = { id: this.id, nombre: this.nombre,modulo: { id: this.id }};
      await this.aulasService.editarAula(aula, token); // Cambio de editarModulo a editarAula y editarModulo a editarAula
      this.location.back();
    } catch (error) {
      console.error('Error editing aula:', error); // Cambio de Error editing modulo a Error editing aula
    }
  }


}

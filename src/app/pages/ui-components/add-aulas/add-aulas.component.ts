import { Component, OnInit } from '@angular/core';
import { AulasService } from 'src/app/aulas.service';
import { ModulosService } from 'src/app/modulos.service';
import { Aulas } from 'src/app/models/aulas';
import { Modulos } from 'src/app/models/modulos';
import { Location } from '@angular/common';
import { Aulas2 } from 'src/app/models/aulas2';

@Component({
  selector: 'app-add-aulas',
  templateUrl: './add-aulas.component.html',
  styleUrls: ['./add-aulas.component.scss']
})
export class AddAulasComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  aulas: Aulas[] = [];
  aulas2: Aulas2[] = [];
  modulos: Modulos[] = [];
  selectedModulo: number | null = null;

  constructor(private aulasService: AulasService, private modulosService: ModulosService, private location: Location) { }

  ngOnInit(): void {
    this.loadAulas();
    this.loadModulos();
  }

  async loadAulas() {
    try {
      const token = localStorage.getItem('token') || '';
      this.aulas2 = await this.aulasService.getAllAulas(token);
    } catch (error) {
      console.error('Error loading aulas:', error);
    }
  }

  async loadModulos() {
    try {
      const token = localStorage.getItem('token') || '';
      this.modulos = await this.modulosService.getAllModulos(token);
    } catch (error) {
      console.error('Error loading modulos:', error);
    }
  }

  async guardarAula() {
    try {
      if (this.selectedModulo !== null) { // Verifica si se seleccionó un módulo
        const aula: Aulas = { id: this.id, nombre: this.nombre ,moduloId: this.selectedModulo}; // Asigna selectedModulo a moduloId
        const token = localStorage.getItem('token') || '';
        await this.aulasService.guardarAula(aula, token); // Guarda el aula utilizando el servicio
        this.loadAulas(); // Vuelve a cargar las aulas después de guardar
        this.location.back(); // Regresa a la vista anterior
      } else {
        console.error('Debe seleccionar un módulo'); // Maneja el caso donde no se haya seleccionado un módulo
      }
    } catch (error) {
      console.error('Error saving aula:', error); // Maneja los errores
    }
  }

}

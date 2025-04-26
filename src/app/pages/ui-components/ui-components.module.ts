import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

// ui components

import { DiagramComponent } from './diagram/diagram.component'; // Ajusta la ruta según sea necesario
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AddMateriasComponent } from './add-materias/add-materias.component';
import {ModulosComponent  } from './modulos/modulos.component';
import { AddModulosComponent } from './add-modulos/add-modulos.component';
import { SistemasacademicosComponent } from './sistemasacademicos/sistemasacademicos.component';
import { AddSistemasacademicosComponent } from './add-sistemasacademicos/add-sistemasacademicos.component';
import {  AddAulasComponent } from './add-aulas/add-aulas.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { UpUsuarioComponent } from './up-usuario/up-usuario.component';
import { FacultadComponent } from './facultad/facultad.component';
import { AddFacultadComponent } from './add-facultad/add-facultad.component';
import { CarreraComponent } from './carrera/carrera.component';
import { AddCarreraComponent } from './add-carrera/add-carrera.component';
import { UpCarreraComponent } from './up-carrera/up-carrera.component';


import { GruposComponent } from './grupos/grupos.component';
import { UpGruposComponent } from './up-grupos/up-grupos.component';

import { AsistenciaComponent } from './asistencia/asistencia.component';
import { AddAsistenciaComponent } from './add-asistencia/add-asistencia.component';
import { AddHorarioComponent } from './add-horario/add-horario.component';
import { HorarioComponent } from './horario/horario.component';
import { AddGruposComponent } from './add-grupos/add-grupos.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UiComponentsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
  ],
  declarations: [
    AppBadgeComponent,
    DiagramComponent,
    AppChipsComponent,
    AppMenuComponent,
    AppTooltipsComponent,
    AddMateriasComponent,
    AddModulosComponent,
    ModulosComponent,
    SistemasacademicosComponent,
    AddSistemasacademicosComponent,
    AddAulasComponent,
    UsuarioComponent,
    UpUsuarioComponent,
    FacultadComponent,
    AddFacultadComponent,
    CarreraComponent,
    AddCarreraComponent,
    UpCarreraComponent,
    HorarioComponent,
    AddHorarioComponent,
    AsistenciaComponent,
    AddAsistenciaComponent,
    GruposComponent,

    AddGruposComponent,
    //UpGruposComponent,

    AsistenciaComponent,
    AddAsistenciaComponent,
    AddHorarioComponent,
    HorarioComponent,
    AddGruposComponent,
    UpUsuarioComponent,

  ],
})
export class UicomponentsModule {}

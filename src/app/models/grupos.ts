export interface Grupos {
  id: number;
  nombre: string;
  cupo: string;
  carrera: {
    id: number;
    nombre: string;
    nro: string;
  };
  gestion: {
    id: number;
    nombre: string;
  };
  materia: {
    id: number;
    nombre: string;
    sigla: string;
  };
  ourUsers: {
    id: number;
    name: string;
  };
  sistemaacademico: {
    id: number;
    nombre: string;
  };
  horario : {
    id: number;
    dia: string;
    horainicio: string;
    horafin: string;
  }

}

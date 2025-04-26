export interface Horario {
  id: number;
  dia: string;
  horainicio: string;
  horafin: string;
  aula: {
    id: number;
    nombre: string;
  };
}

export interface Asistencia {
  id: number;
  descripcion: string;
  hora: string;
  fecha: string;
  tiempo: string;
  estado: string;
  grupo: {
    id: number,
    nombre: string,
    materia: {
      id: number;
      nombre: string;
      sigla: string;
    };
  }
}

export interface Carreras {
  id: number;
  nro: string;
  nombre: string;
  facultad: {
    id: number;
    codigo: string;
    nombre: string;
  };
}

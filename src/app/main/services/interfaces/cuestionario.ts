import { NumberSymbol } from "@angular/common";

export interface Respuesta {
  id: number;
  respuesta: string;
}

export interface PreguntaRespuesta {
  puntuacion: number;
  respuesta: Respuesta;
}

export interface Pregunta {
  id: number;
  pregunta: string;
  recomendacion: string;
  puntuacionRecomendacion: number;
  respuestas: PreguntaRespuesta[];
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  explicacion: string;
  puntuacion: number;
  recomendacion: string;
  preguntas: Pregunta[];
}

export interface Area {
  id: number;
  nombre: string;
  categorias: Categoria[];
}

export interface Idioma {
  id: number;
  nombre: string;
  urlImagen: string;
  areas: Area[]
}


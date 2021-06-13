export class Respuesta {
  id: number;
  respuesta: string;
}

export class PreguntaRespuesta {
  puntuacion: number;
  respuesta: Respuesta;

  constructor(){
    this.puntuacion = 0;
    this.respuesta = new Respuesta;
  }
}

export class Pregunta {
  id: number;
  pregunta: string;
  recomendacion: string;
  puntuacionRecomendacion: number;
  perfil: Perfil;
  respuestaSeleccionada: PreguntaRespuesta;
  respuestas: PreguntaRespuesta[];
}

export class Perfil{
  id: number;
  perfil: string;
}

export class Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  explicacion: string;
  puntuacion: number;
  recomendacion: string;
  preguntas: Pregunta[];
  isChecked: boolean;
}

export class Area {
  id: number;
  nombre: string;
  categorias: Categoria[];
}

export class Idioma {
  id: number;
  nombre: string;
  urlImagen: string;
  areas: Area[];
  perfiles: Perfil[];
}


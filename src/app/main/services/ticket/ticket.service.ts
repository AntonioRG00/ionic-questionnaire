import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Idioma, Area, Categoria } from '../interfaces/cuestionario';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  /** Ticket con la información del proceso del usuario */
  ticketInformation = {
    explicacion: {
      idioma: ''
    },
    recoleccionDatos: {
      categoriasSeleccionadas: [] = new Array<Categoria>(),
      perfilUsuario: ''
    },
    cuestionario: {

    },
    recomendacion: {

    }
  };

  constructor() { }

  /** Filtro para los datos 'explicacion' del ticket (True si pasa el filtrado) */
  public checkTicketExplicacion(): boolean{
    let explicacion = this.ticketInformation.explicacion;
    
    if(!explicacion.idioma) return false;

    return true;
  }

  /** Filtro para los datos 'RecoleccionDatos' del ticket (True si pasa el filtrado) */
  public checkTicketRecoleccionDatos(): boolean{
    let explicacion = this.ticketInformation.explicacion;
    
    //TODO IMPLEMENTAR

    return;
  }

  /** Filtro para los datos 'Cuestionario' del ticket (True si pasa el filtrado) */
  public checkTicketCuestionario(): boolean{
    let explicacion = this.ticketInformation.explicacion;
    
     //TODO IMPLEMENTAR

    return;
  }

  /** Filtro para los datos 'Recomendacion' del ticket (True si pasa el filtrado) */
  public checkTicketRecomendacion(): boolean{
    let explicacion = this.ticketInformation.explicacion;
    
    //TODO IMPLEMENTAR

    return;
  }
}
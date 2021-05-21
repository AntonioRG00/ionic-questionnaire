import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Idioma, Area, Categoria } from '../interfaces/cuestionario';
import { RestService } from '../apirest/rest.service'

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  /** Ticket con la información del proceso del usuario */
  ticketInformation = {
    data: {
      allDataRest: [] = new Array<Idioma>()
    },
    explicacion: {
      idioma: ''
    },
    recoleccionDatos: {
      perfilUsuario: ''
    },
    cuestionario: {

    },
    recomendacion: {

    }
  };

  constructor(private restService: RestService) {
    restService.getAllData().subscribe((data) =>{
      if(data){
        this.ticketInformation.data.allDataRest = data;

        // If splash exists
        const splash = document.getElementById('splashscreen');
        if(splash){
          setTimeout(() => {
            //console.log('Splash existe');
            splash.remove();
          }, 5000);

        }
      }
    })
  }

  /** Filtro para los datos 'explicacion' del ticket (True si pasa el filtrado) */
  public checkTicketExplicacion(): boolean{
    let explicacion = this.ticketInformation.explicacion;

    if(!explicacion.idioma) return false;

    return true;
  }

  /** Filtro para los datos 'RecoleccionDatos' del ticket (True si pasa el filtrado) */
  public checkTicketRecoleccionDatos(): boolean{
    let recoleccionDatos = this.ticketInformation.recoleccionDatos;

    if(!recoleccionDatos.perfilUsuario.length) return false;

    let algunaCategoriaSeleccionada = false;
    this.ticketInformation.data.allDataRest.forEach(x => x.areas.forEach(y =>
      y.categorias.forEach(z => z.isChecked ? algunaCategoriaSeleccionada=true:"")))
    if(!algunaCategoriaSeleccionada) return false;

    return true;
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

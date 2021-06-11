import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Idioma, Area, Categoria, Perfil } from '../interfaces/cuestionario';
import { RestService } from '../apirest/rest.service'

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  /** Ticket con la información del proceso del usuario */
  ticketInformation = {
    data: {
      allDataRest: [] = new Array<Idioma>(),
      idiomasDisponibles: [] = new Array<String>()
    },
    explicacion: {
      idiomaSeleccionado: new Object as Idioma
    },
    recoleccionDatos: {
      perfilUsuario: '',
      idiomaFiltradoCheckedPerfil: new Object as Idioma
    }
  };

  constructor(private restService: RestService) {
    restService.getAllData().subscribe((data) =>{
      if(data){
        this.ticketInformation.data.allDataRest = data;

        // Sacamos los idiomas disponibles
        this.ticketInformation.data.idiomasDisponibles = this.ticketInformation.data.allDataRest.map((idioma) => idioma['nombre'])
        console.log("Idiomas cargados: " + this.ticketInformation.data.idiomasDisponibles)

        this.splashScreen();
      }
    })
  }

  public splashScreen(){
    const splash = document.getElementById('splashscreen');
    if(splash){
      setTimeout(() => {
        splash.remove();
      }, 4000);
    }
  }

  /** Filtro para los datos 'explicacion' del ticket (True si pasa el filtrado) */
  public checkTicketExplicacion(): boolean{
    let explicacion = this.ticketInformation.explicacion;

    return explicacion.idiomaSeleccionado.id != null;
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
    if(this.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas == null){
      return false;
    }
    
    return !this.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.some(area => area.categorias.some(categoria => 
      categoria.preguntas.some(pregunta => pregunta.respuestaSeleccionada == null)
    ))
  }
}

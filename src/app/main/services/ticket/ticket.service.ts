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
      idiomasDisponibles: [] = new Array<String>(),
      perfilesDisponibles: [] = new Array<Perfil>()
    },
    explicacion: {
      idiomaSeleccionado: new Object as Idioma
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

        // Sacamos los idiomas disponibles
        this.ticketInformation.data.idiomasDisponibles = this.ticketInformation.data.allDataRest.map((idioma) => idioma['nombre'])
        console.log("Idiomas cargados: " + this.ticketInformation.data.idiomasDisponibles)

        // Sacamos los perfiles disponibles
        restService.getAllPerfiles().subscribe((perfiles) =>{
          if(perfiles) {
            this.ticketInformation.data.perfilesDisponibles = perfiles
            this.splashScreen();
          }
        })
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
    let noHayDatosNulos = true;

    if(this.ticketInformation.explicacion.idiomaSeleccionado.areas == null) return false;
    this.ticketInformation.explicacion.idiomaSeleccionado.areas.forEach(area => 
      area.categorias.forEach(categoria => categoria.preguntas.forEach(pregunta => {
          if(categoria.isChecked){
            if(pregunta.perfil.perfil === this.ticketInformation.recoleccionDatos.perfilUsuario){
              if(pregunta.respuestaSeleccionada == null){
                noHayDatosNulos = false;
              }
            }
          }
        })))
        
    return noHayDatosNulos;
  }

  /** Filtro para los datos 'Recomendacion' del ticket (True si pasa el filtrado) */
  public checkTicketRecomendacion(): boolean{
    let explicacion = this.ticketInformation.explicacion;

    //TODO IMPLEMENTAR

    return;
  }
}

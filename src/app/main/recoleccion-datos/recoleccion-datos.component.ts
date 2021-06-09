import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { RestService } from '../services/apirest/rest.service'
import { Idioma, Area, Categoria } from '../services/interfaces/cuestionario';

@Component({
  selector: 'app-recoleccion-datos',
  templateUrl: './recoleccion-datos.component.html',
  styleUrls: ['./recoleccion-datos.component.scss'],
})
export class RecoleccionDatosComponent {

  /** Contiene las areas y categorías disponibles para el perfil seleccionado */
  public areasCandidatas: Area[] = new Array<Area>();

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController, private restService: RestService) {

    // Volver de proceso ya que no ha pasado el filtro
    if(!ticketService.checkTicketExplicacion()){
      this.router.navigate(['explicacion'])
    }

    // Sacamos las categorías seleccionadas anteriormente
    console.log("Selected Categorias:" + this.ticketService.ticketInformation.data.allDataRest
      .map((idioma) => idioma['areas'].map((area) => area['categorias'].map((categoria) =>
        categoria.isChecked ? categoria.nombre:"").join(" ")).join("")).join(""));
    
    // Cargamos los datos asociados al perfil seleccionado
    this.perfilChange(ticketService.ticketInformation.recoleccionDatos.perfilUsuario)
  }

  public onNextPage(){
    if(this.ticketService.checkTicketRecoleccionDatos()){
      
      // Clonamos los datos
      this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil = 
        JSON.parse(JSON.stringify(this.ticketService.ticketInformation.explicacion.idiomaSeleccionado))

      // Filtramos los datos por categoría checked y preguntas para el perfil seleccionado
      let copiaDatos = this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas;
      this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.forEach((area, indexArea, areas) => {
        if(area.categorias.some(categoria => categoria.isChecked)) {
          area.categorias.forEach((categoria, indexCategoria, categorias) => {
            console.log("sd"+categoria.nombre)
            if(categoria.isChecked == null || !categoria.isChecked) {
              categorias.splice(indexCategoria, 1);
              console.log("borrando: " + categoria.nombre)
            } else {
              console.log("dejo: " + categoria.nombre)
              categoria.preguntas.forEach((pregunta, indexPregunta, preguntas) => {
                if(pregunta.perfil.perfil != this.ticketService.ticketInformation.recoleccionDatos.perfilUsuario){
                  preguntas.splice(indexPregunta, 1);
                }
              })
            }
          })
        } else {
          areas.splice(indexArea, 1)
        }
      })

      console.log("Redirect to: cuestionario")
      this.router.navigate(['cuestionario'])
    } else {
      console.log("Unasigned required attributes, not redirecting")
    }
  }

  public onBackPage(){
    console.log("Redirect to: explicacion")
    this.router.navigate(['explicacion'])
  }

  public perfilChange(perfilSeleccionado: string){
    this.ticketService.ticketInformation.recoleccionDatos.perfilUsuario = perfilSeleccionado;

    this.areasCandidatas = new Array<Area>();
    this.ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas.forEach(area => {
      if(area.categorias.some(categoria => categoria.preguntas.some(pregunta => pregunta.perfil.perfil == perfilSeleccionado))){
        let areaAux = new Object as Area;

        areaAux.categorias = area.categorias.filter(categoria => 
          categoria.preguntas.filter(pregunta => pregunta.perfil.perfil == perfilSeleccionado).length != 0)
        areaAux.nombre = area.nombre
        areaAux.id = area.id

        console.log("Pushed Area: " + areaAux)
        this.areasCandidatas.push(areaAux)
      }
    })
  }
}


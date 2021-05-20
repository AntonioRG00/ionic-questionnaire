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

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController, private restService: RestService) {

    // Volver de proceso ya que no ha pasado el filtro
    if(!ticketService.checkTicketExplicacion()){
      this.router.navigate(['explicacion'])
    }

    // Sacamos las categorías seleccionadas anteriormente
    console.log("Selected Categorias:" + this.ticketService.ticketInformation.data.allDataRest
      .map((idioma) => idioma['areas'].map((area) => area['categorias'].map((categoria) =>
        categoria.isChecked ? categoria.nombre:"").join(" ")).join("")).join(""))
  }

  public onNextPage(){
    if(this.ticketService.checkTicketRecoleccionDatos()){
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

  public hideLoader(): void{
    document.getElementById('loading').style.display = 'none';
  }
}


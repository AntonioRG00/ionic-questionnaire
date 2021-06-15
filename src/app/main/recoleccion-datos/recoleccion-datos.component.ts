import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { RestService } from '../services/apirest/rest.service'
import { Idioma, Area, Categoria } from '../services/interfaces/cuestionario';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recoleccion-datos',
  templateUrl: './recoleccion-datos.component.html',
  styleUrls: ['./recoleccion-datos.component.scss'],
})
export class RecoleccionDatosComponent {

  /** Contiene las areas y categorías disponibles para el perfil seleccionado */
  public areasCandidatas: Area[] = new Array<Area>();

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController, private restService: RestService,
    public translateService: TranslateService) {

    // Volver de proceso ya que no ha pasado el filtro
    if(!ticketService.checkTicketExplicacion()){
      this.router.navigate(['explicacion'])
    }

    // Sacamos las categorías seleccionadas anteriormente
    // console.log("Selected Categorias:" + this.ticketService.ticketInformation.data.allDataRest
      .map((idioma) => idioma['areas'].map((area) => area['categorias'].map((categoria) =>
        categoria.isChecked ? categoria.nombre:"").join(" ")).join("")).join(""));
    
    // Cargamos los datos asociados al perfil seleccionado
    this.perfilChange(ticketService.ticketInformation.recoleccionDatos.perfilUsuario)
  }

  public async onNextPage(){
    if(this.ticketService.checkTicketRecoleccionDatos()){
      // console.log("Redirect to: cuestionario")
      this.router.navigate(['cuestionario'])
    } else {
      // console.log("Unasigned required attributes, not redirecting")
      const alert = await this.alertController.create({
        header: 'Error!',
        message: this.getMensajeError(),
        buttons: ['OK']
      });

      await alert.present();
    }

    
  }

  public onBackPage(){
    // console.log("Redirect to: explicacion")
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

        // console.log("Pushed Area: " + areaAux)
        this.areasCandidatas.push(areaAux)
      }
    })
  }

  public getMensajeError(): string{
    let mensaje;
    this.translateService.stream("ERR_SELECT_PROF").subscribe(
      res => mensaje = res
    );
    return mensaje;
  }
}


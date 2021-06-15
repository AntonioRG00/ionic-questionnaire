import { Component, Inject, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-explicacion',
  templateUrl: './explicacion.component.html',
  styleUrls: ['./explicacion.component.scss'],
})
export class ExplicacionComponent implements OnInit {

  public langs: string [] = [];
  public anim: Animation;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController,private translateService: TranslateService) { 
      this.langs = this.translateService.getLangs();
    }

  ngOnInit() {}

  async onNextPage(){
    if(this.ticketService.checkTicketExplicacion()){
      //console.log("Redirect to: recoleccionDatos")
      this.router.navigate(['recoleccionDatos'])
    } else {
      //console.log("Unasigned required attributes, not redirecting")

      // TODO UN ALERT EN CADA INPUT ESTÁ MEJOR
      const alert = await this.alertController.create({
        header: 'Error!',
        message: this.getMensajeError(),
        buttons: ['OK']
      });


      await alert.present();
    }
  }

  public onIdiomaSelectChange(languaje: string){
    // console.log("Languaje selected: " + languaje)

    // Guardamos el idioma seleccionado en el ticket
    this.ticketService.ticketInformation.explicacion.idiomaSeleccionado = 
      this.ticketService.ticketInformation.data.allDataRest.find(x => x.nombre.toLowerCase() == languaje.toLowerCase())

    // Ponemos todas las categorías de los demás idiomas deseleccionadas
    this.ticketService.ticketInformation.data.allDataRest.filter(x => x.nombre !== languaje)
      .forEach(idioma => idioma.areas.forEach(area => area.categorias.forEach(categoria => categoria.isChecked = false)))
  }

  public changeLang(event){
    this.translateService.use(event.detail.value);
  }

  // Si no se selecciona un idioma para filtrar los datos muestra el mensaje
  public getMensajeError(): string{
    let mensaje;
    this.translateService.stream("ERR_SELECT_LANG").subscribe(
      res => mensaje = res
    );
    return mensaje;
  }
}

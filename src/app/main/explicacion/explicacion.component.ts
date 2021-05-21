import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-explicacion',
  templateUrl: './explicacion.component.html',
  styleUrls: ['./explicacion.component.scss'],
})
export class ExplicacionComponent implements OnInit {

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController) { }

  ngOnInit() {}

  async onNextPage(){
    if(this.ticketService.checkTicketExplicacion()){
      console.log("Redirect to: recoleccionDatos")
      this.router.navigate(['recoleccionDatos'])
    } else {
      console.log("Unasigned required attributes, not redirecting")

      // TODO UN ALERT EN CADA INPUT ESTÁ MEJOR
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Seleccione un idioma',
        buttons: ['OK']
      });


      await alert.present();
    }
  }

  public onIdiomaSelectChange(languaje: string){
    console.log("Languaje selected: " + languaje)

    this.ticketService.ticketInformation.explicacion.idiomaSeleccionado = 
      this.ticketService.ticketInformation.data.allDataRest.find(x => x.nombre.toLowerCase() == languaje.toLowerCase())  

    console.log("Idioma seleccionado: " + this.ticketService.ticketInformation.explicacion.idiomaSeleccionado.nombre)
  }
}

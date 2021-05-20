import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.scss'],
})
export class CuestionarioComponent implements OnInit {

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController) { 

      // Volver de proceso ya que no ha pasado el filtro
      if(!ticketService.checkTicketRecoleccionDatos()){
        // this.router.navigate(['recoleccionDatos'])
      }
    }

  ngOnInit() {}

  public onNextPage(){
    if(this.ticketService.checkTicketCuestionario()){
      console.log("Redirect to: recomendacion") 
      this.router.navigate(['recomendacion'])
    } else {
      console.log("Unasigned required attributes, not redirecting")
    }
  }
  
  public onBackPage(){
    console.log("Redirect to: recoleccionDatos")
    this.router.navigate(['recoleccionDatos'])
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { Area, Categoria, Pregunta } from '../services/interfaces/cuestionario';
import {ProgressBarModule} from 'primeng/progressbar';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.scss'],
})
export class CuestionarioComponent implements OnInit {

  public barraProgreso = 0;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController) {

      // Volver de proceso ya que no ha pasado el filtro
      if(!ticketService.checkTicketRecoleccionDatos()){
         this.router.navigate(['recoleccionDatos'])
      }
    }

  ngOnInit() {
    console.log('Numero de preguntas')
    console.log()
  }

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

  public recalcularProgressBar(){

    // Sacamos el total de preguntas
    let totalPreguntas = 0, totalPreguntasRespondidas = 0;
    this.ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas.forEach(area => area.categorias.forEach(categoria => categoria.preguntas.forEach(pregunta => {
      totalPreguntas++;
      if(pregunta.respuestaSeleccionada != null){
        totalPreguntasRespondidas++;
      }
    })))

    // Recalculamos el valor de la barra de progreso
    this.barraProgreso = Math.round((100/totalPreguntas)*totalPreguntasRespondidas);
    console.log(`TotalPreguntas ${totalPreguntas}, Respondidas ${totalPreguntasRespondidas}, Progreso ${this.barraProgreso}`)
  }
}

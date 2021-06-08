import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { Categoria } from '../services/interfaces/cuestionario';
import {ProgressBarModule} from 'primeng/progressbar';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.scss'],
})
export class CuestionarioComponent implements OnInit {

  value = 0;

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

  /** Comprueba que la categoría este seleccionada y tenga preguntas del perfil seleccionado */
  public comprobarCategoria(categoria: Categoria): boolean {
    return categoria.preguntas.some(x => x.perfil.perfil == this.ticketService.ticketInformation.recoleccionDatos.perfilUsuario) && categoria.isChecked;
  }

  public sumProgress(event){
    console.log(event);
    if(true){// no habia sido seleccionada
      this.value++;
    }
    
  }
}

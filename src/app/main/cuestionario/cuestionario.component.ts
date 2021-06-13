import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { Idioma, PreguntaRespuesta, Respuesta } from '../services/interfaces/cuestionario';

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
    if (!ticketService.checkTicketRecoleccionDatos()) {
      this.router.navigate(['recoleccionDatos'])
    }

    // Clonamos y combinamos los datos
    let datoClonado: Idioma = JSON.parse(JSON.stringify(this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil));
    
    this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil =
    JSON.parse(JSON.stringify(this.ticketService.ticketInformation.explicacion.idiomaSeleccionado))
    
    this.filtrarDatosQuestionario();

    let copiaDatos = this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil;
    for (let i = 0; i < copiaDatos.areas.length; i++) {
      let copyArea = datoClonado.areas?.find(x => x.id == copiaDatos.areas[i].id)
      if(copyArea != null){
        for (let j = 0; j < copiaDatos.areas[i].categorias.length; j++) {
          let copyCategoria = copyArea.categorias.find(x => x.id == copiaDatos.areas[i].categorias[j].id)
          if(copyCategoria != null){
            for (let k = 0; k < copiaDatos.areas[i].categorias[j].preguntas.length; k++) {
              let copyPregunta = copyCategoria.preguntas.find(x => x.id == copiaDatos.areas[i].categorias[j].preguntas[k].id)
              let indexRespuesta = copyPregunta.respuestas.findIndex(x => x?.respuesta?.id == copyPregunta.respuestaSeleccionada?.respuesta?.id)
              if(indexRespuesta != null && indexRespuesta != -1){
                copiaDatos.areas[i].categorias[j].preguntas[k].respuestaSeleccionada = copiaDatos.areas[i].categorias[j].preguntas[k].respuestas[indexRespuesta];
              }
            }
          }
        }
      }
    }

    this.recalcularProgressBar();
  }

  public filtrarDatosQuestionario() {
    this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.forEach((area, indexArea, areas) => {
      if (area.categorias.some(categoria => categoria.isChecked)) {
        area.categorias.forEach((categoria, indexCategoria, categorias) => {
          if (categoria.isChecked == null || !categoria.isChecked) {
            categorias.splice(indexCategoria, 1);
            this.filtrarDatosQuestionario();
          } else {
            categoria.preguntas.forEach((pregunta, indexPregunta, preguntas) => {
              if (pregunta.perfil.perfil != this.ticketService.ticketInformation.recoleccionDatos.perfilUsuario) {
                preguntas.splice(indexPregunta, 1);
                this.filtrarDatosQuestionario();
              }
            })
          }
        })
      } else {
        areas.splice(indexArea, 1);
        this.filtrarDatosQuestionario();
      }
    })
  }

  ngOnInit() { }

  public onNextPage() {
    if (this.ticketService.checkTicketCuestionario()) {
      console.log("Redirect to: recomendacion")
      this.router.navigate(['recomendacion'])
    } else {
      console.log("Unasigned required attributes, not redirecting")
    }
  }

  public onBackPage() {
    console.log("Redirect to: recoleccionDatos")
    this.router.navigate(['recoleccionDatos'])
  }

  public recalcularProgressBar() {

    // Sacamos el total de preguntas
    let totalPreguntas = 0, totalPreguntasRespondidas = 0;
    this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.forEach(area => area.categorias.forEach(categoria => categoria.preguntas.forEach(pregunta => {
      totalPreguntas++;
      if (pregunta.respuestaSeleccionada != null) {
        totalPreguntasRespondidas++;
      }
    })))

    // Recalculamos el valor de la barra de progreso
    this.barraProgreso = Math.round((100 / totalPreguntas) * totalPreguntasRespondidas);
    console.log(`TotalPreguntas ${totalPreguntas}, Respondidas ${totalPreguntasRespondidas}, Progreso ${this.barraProgreso}`)
  }
}

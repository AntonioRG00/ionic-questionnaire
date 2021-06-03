import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Categoria } from '../services/interfaces/cuestionario';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styleUrls: ['./recomendacion.component.scss'],
})
export class RecomendacionComponent implements OnInit {

  pdfObject = null;

  areasConRecomendacion: any;
  basicData: any;
  basicOptions: any;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController) {

      // Volver de proceso ya que no ha pasado el filtro
      if(!ticketService.checkTicketCuestionario()){
        this.router.navigate(['cuestionario'])
      }

      // Obtenemos los nombres de las categorías seleccionadas
      let categoriasChecked = new Array<Categoria>();
      ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas
        .forEach(area => area.categorias.filter(categoria => categoria.isChecked)
        .forEach(categoriaChecked => categoriasChecked.push(categoriaChecked))) 
      console.log("Categorías checked: " + categoriasChecked);

      // Obtenemos la puntuación total de cada categoría
      let puntuacionCategoriasChecked = new Array<number>(categoriasChecked.length);
      categoriasChecked.forEach((categoria, index) => {
        puntuacionCategoriasChecked[index]=0;
        categoria.preguntas.forEach(pregunta => {
          puntuacionCategoriasChecked[index]+=pregunta.respuestaSeleccionada.puntuacion;
        })
      })
      console.log("Puntuación total por categoría: " + puntuacionCategoriasChecked)

      // Obtenemos la puntuación máxima posible por categorías seleccionadas
      let puntuacionMaximaPorCategoria = new Array<number>(categoriasChecked.length);
      categoriasChecked.forEach((categoria, index) => {
        puntuacionMaximaPorCategoria[index]=0;
        categoria.preguntas.forEach(pregunta => {
          puntuacionMaximaPorCategoria[index]+=pregunta.respuestas[pregunta.respuestas.length-1].puntuacion;
        })
      })
      console.log("Puntuaciones máximas posibles por categoría: " + puntuacionMaximaPorCategoria)

      let puntuacionMaxima = Math.max.apply(null, puntuacionMaximaPorCategoria);
      console.log("Puntuación máxima: " + puntuacionMaxima)

      // Recalculamos las demás puntuaciones en base a la más alta
      for(let i=0 ; i<puntuacionCategoriasChecked.length ; i++){
        let proporcion = puntuacionMaximaPorCategoria[i] / puntuacionCategoriasChecked[i];
        let puntuacionFinal = puntuacionMaxima / proporcion;
        puntuacionCategoriasChecked[i] = puntuacionFinal;
      }

      this.basicData = {
        // Los labels no esta terminado
        labels: categoriasChecked.map(categoriaChecked => categoriaChecked['nombre']),
        datasets: [
            {
              backgroundColor: '#42A5F5',
              data: puntuacionCategoriasChecked
            }
        ]
    };

    this.basicOptions = {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
            ticks: {
              fontColor: '#495057'
            }
        }],
        yAxes: [{
          ticks: {
            fontColor: '#495057',
            min: 0,
            max: puntuacionMaxima
          }
        }]
      }
    };
  }

  ngOnInit() {}

  public downloadPDF(){
    //Download pdf
    const docDef = {
      content: [
        {text: 'Cuestionario', style: 'header'},
        '',
        {text: 'Esto sera cada una de las areas selecionadas', style: 'subheader'},
        '',
        {text: 'Esto sera cada una de las categorias', style: 'subsubheader'}
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        subsubheader:{
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      }
    }

    this.pdfObject = pdfMake.createPdf(docDef);

    this.pdfObject.download('demo.pdf');
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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
      let categoriasChecked = ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas
        .map(area => area['categorias'].filter(categoria => categoria.isChecked))[0];

      // Obtenemos la puntuación total de cada categoría
      let puntuacionCategoriasChecked = new Array<number>(categoriasChecked.length);
      categoriasChecked.forEach((categoria, index) => {
        puntuacionCategoriasChecked[index]=0;
        categoria.preguntas.forEach(pregunta => {
          puntuacionCategoriasChecked[index]+=pregunta.respuestaSeleccionada.puntuacion;
        })
      })

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
          labels: {
              fontColor: '#495057'
          }
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
                  min: 0
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

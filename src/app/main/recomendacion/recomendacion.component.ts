import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController, Platform } from '@ionic/angular';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as htmlToText from 'html-to-pdfmake';
import { Area, Categoria, Idioma } from '../services/interfaces/cuestionario';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styleUrls: ['./recomendacion.component.scss'],
})
export class RecomendacionComponent implements OnInit {

  public datosAreas: Area[];
  public indexTabPanel = 0;
  
  public pdfObject = null;
  
  public areasConRecomendacion: any;
  
  //Chart
  public basicData: any;
  public basicOptions: any;
  public static image: string;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController,
    public platform: Platform,
    public fileOpener: FileOpener,
    public translateService: TranslateService) {

    // Volver de proceso ya que no ha pasado el filtro
    if (!ticketService.checkTicketCuestionario()) {
      this.router.navigate(['cuestionario'])
    }

    // Obtenemos la puntuación total de cada categoría y la puntuación máxima posible por categorías seleccionadas
    let puntuacionCategoriasChecked = new Array<number>();
    let puntuacionMaximaPorCategoria = new Array<number>();

    this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.forEach((area, index) => {
      puntuacionCategoriasChecked.push(0)
      puntuacionMaximaPorCategoria.push(0)
      area.categorias.forEach(categoria => categoria.preguntas.forEach(pregunta => {
        puntuacionCategoriasChecked[index] += pregunta.respuestaSeleccionada.puntuacion;
        puntuacionMaximaPorCategoria[index] += pregunta.respuestas[pregunta.respuestas.length - 1].puntuacion
      }))
    })
    // console.log("Puntuación total por categoría: " + puntuacionCategoriasChecked)
    // console.log("Puntuaciones máximas posibles por categoría: " + puntuacionMaximaPorCategoria)

    let puntuacionMaxima = Math.max.apply(null, puntuacionMaximaPorCategoria);
    // console.log("Puntuación máxima: " + puntuacionMaxima)

    // Recalculamos las demás puntuaciones en base a la más alta
    for (let i = 0; i < puntuacionCategoriasChecked.length; i++) {
      let proporcion = puntuacionMaximaPorCategoria[i] / puntuacionCategoriasChecked[i];
      let puntuacionFinal = puntuacionMaxima / proporcion;
      puntuacionCategoriasChecked[i] = puntuacionFinal;
    }

    this.basicData = {
      // Los labels no esta terminado
      labels: this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.map(area => area['nombre']),
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
      animation: {
        onComplete: function () {
          RecomendacionComponent.image = this.toBase64Image();
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
            min: 0,
            max: puntuacionMaxima
          }
        }]
      }
    };
  }

  ngOnInit() { }

  public downloadPDF() {
    //Download pdf
    const docDef = {
      content: [
        { text: this.getTextoPdf("PDF_QUESTIONNAIRE"), style: 'header' },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 500, y2: 0,
              lineWidth: 1
            }
          ]
        },
        { text: '', margin: [0, 5, 0, 5] },
        { type: 'none', ul: this.generateCategoriasDataPDF(), margin: [-12, 0, 0, 0] }
        //{image: this.image}
      ],
      defaultStyle: {
        //Font size etc
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        listheader: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 5],
          alignment: 'center',
          decoration: 'underline'
        },
        subsubheader: {
          fontSize: 16,
          bold: true,
          margin: [4, 10, 0, 5]
        }
      }
    }

    this.pdfObject = pdfMake.createPdf(docDef);

    let date: Date = new Date();

    let pdfName = 'Results_' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '.pdf';


    if (this.platform.is('cordova')) {
      // console.log('this platform is cordova')
      this.pdfObject.getBase64(async (data) => {
        try {
          let path = `pdf/Results_${Date.now()}.pdf`;

          const result = await Filesystem.writeFile({
            path,
            data,
            directory: FilesystemDirectory.Documents,
            recursive: true
          })
          this.fileOpener.open(`${result.uri}`, 'application/pdf');

        } catch (e) {
          console.error('Unable to write file', e);
        }
      });
    } else {
      // console.log('this platform is desktop')
      this.pdfObject.download(pdfName);
    }

  }

  public generateCategoriasDataPDF(): Array<EstructuraPDF> {

    let datosAreas = new Array<EstructuraPDF>();

    // Generamos las Áreas -> Categorías -> Preguntas -> Respuesta
    this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.forEach(area => {
      // Introducimos el nombre del área
      datosAreas.push({ text: area.nombre, type: 'none', style: 'listheader' })

      area.categorias.forEach(categoria => {
        // Introducimos el nombre de la categoría
        datosAreas.push({ ul: [categoria.nombre], style: 'subsubheader' })

        datosAreas.push({ text: categoria.explicacion, margin: [0, 0, 0, 10], alignment: 'justify'})

        categoria.preguntas.forEach(pregunta => {
          // Introducimos el nombre de la pregunta
          datosAreas.push({ text: pregunta.pregunta, margin: [0, 5], alignment: 'justify' })

          // Introducimos la respuesta seleccionada
          datosAreas.push({text: [{text: this.getTextoPdf("PDF_YOUR_ANSWER"), bold: true}, {text: pregunta.respuestaSeleccionada.respuesta.respuesta}], })
        })
      })
    })
    datosAreas.push({text: '', pageBreak: 'after'})

    // Mostramos las recomendaciones agrupadas por área
    datosAreas.push({ text: this.getTextoPdf("PDF_YOUR_RESULTS"), style: 'header' })
    datosAreas.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 1 }] })
    this.ticketService.ticketInformation.recoleccionDatos.idiomaFiltradoCheckedPerfil.areas.forEach(area => {
      // Introducimos el nombre del área
      datosAreas.push({ text: area.nombre, type: 'none', style: 'listheader' })

      area.categorias.forEach(categoria => {
        // Introducimos el nombre de la categoría
        datosAreas.push({ul: [categoria.nombre], style: 'subsubheader' })
        
        // Sacamos las recomendaciones
        let arrayRecomendaciones = new Array<String>();
        if(this.comprobarRecomendacionCategoria(categoria)) arrayRecomendaciones.push(categoria.recomendacion);
        categoria.preguntas.forEach(pregunta => {
          if(pregunta.respuestaSeleccionada.puntuacion <= pregunta.puntuacionRecomendacion){
            arrayRecomendaciones.push(pregunta.recomendacion);
          }
        })

        // Introducimos las recomendaciones
        arrayRecomendaciones.forEach((x, i) => datosAreas.push({text: htmlToText(`<span>${i+1}. </span>`+x), margin: [0, 5], alignment: 'justify'}))
      })
    })

    // Introducimos el chart
    datosAreas.push({ text: this.getTextoPdf("PDF_CHART"), fontSize: 20, bold: true, margin: [0, 20, 0, 10]})
    datosAreas.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 1 }] })
    datosAreas.push({ text: this.getTextoPdf("PDF_CHART_EXPL"), margin: [0, 10, 0, 10]})
    datosAreas.push({width: 500,image: RecomendacionComponent.image})

    return datosAreas;
  }

  public comprobarRecomendacionCategoria(categoria: Categoria): boolean {
    let puntuacionRespuestas = 0;
    categoria.preguntas.forEach(x => {
      puntuacionRespuestas += x.respuestaSeleccionada.puntuacion;
    })

    return puntuacionRespuestas <= categoria.puntuacion;
  }

  public getTextoPdf(key){
    let cuestionario;
    this.translateService.stream(key).subscribe(
      res => cuestionario = res
    );
    return cuestionario;
  }


}

class EstructuraPDF {
  type?: string
  text?: any //aqui habia un string
  ol?: Array<String>
  ul?: Array<String>
  style?: string
  margin?: Array<Number>
  canvas?: any
  pageBreak?: string
  image?: string
  width?: number
  fontSize?: number
  bold?: boolean
  any?: any
  alignment?: string

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController, Platform } from '@ionic/angular';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Area, Categoria } from '../services/interfaces/cuestionario';
import { attachView } from '@ionic/angular/providers/angular-delegate';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { FilesystemDirectory, Plugins } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileOpener } from '@ionic-native/file-opener/ngx';



@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styleUrls: ['./recomendacion.component.scss'],
})
export class RecomendacionComponent implements OnInit {

  public datosAreas: Area[];

  pdfObject = null;

  areasConRecomendacion: any;

  //Chart
  basicData: any;
  basicOptions: any;
  image: string;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController,
    public platform: Platform,
    public fileOpener: FileOpener) {

      // Volver de proceso ya que no ha pasado el filtro
      if(!ticketService.checkTicketCuestionario()){
        this.router.navigate(['cuestionario'])
      }

      // Cargamos los datos
      this.datosAreas = this.generarDatosRecomendaciones();

      // Obtenemos los nombres de las categorías seleccionadas
      let categoriasChecked = new Array<Categoria>();
      ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas
        .forEach(area => area.categorias.filter(categoria => categoria.isChecked)
        .forEach(categoriaChecked => categoriasChecked.push(categoriaChecked))) 
      console.log("Categorías checked: " + categoriasChecked);

      // Obtenemos la puntuación total de cada categoría y la puntuación máxima posible por categorías seleccionadas
      let puntuacionCategoriasChecked = new Array<number>(categoriasChecked.length);
      let puntuacionMaximaPorCategoria = new Array<number>(categoriasChecked.length);
      categoriasChecked.forEach((categoria, index) => {
        puntuacionCategoriasChecked[index]=0;
        puntuacionMaximaPorCategoria[index]=0;
        categoria.preguntas.filter(pregunta => pregunta.perfil.perfil == ticketService.ticketInformation.recoleccionDatos.perfilUsuario)
          .forEach(pregunta => {
            puntuacionCategoriasChecked[index]+=pregunta.respuestaSeleccionada.puntuacion;
            puntuacionMaximaPorCategoria[index]+=pregunta.respuestas[pregunta.respuestas.length-1].puntuacion;
          })
      })
      console.log("Puntuación total por categoría: " + puntuacionCategoriasChecked)
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
      animation:{
        onComplete: function(){
          this.image = this.toBase64Image();
          //console.log('image converted to base 64');
          //console.log(this.image.length);
          //console.log(this.image);
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

  ngOnInit() {}

  public downloadPDF(){
    //Download pdf
    const docDef = {
      content: [
        {text: 'Questionnaire', style: 'header'},
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
        {text: '', margin: [0, 5, 0, 5]},
        {type: 'none', ul: this.generateCategoriasDataPDF()}
        //{image: this.image}
      ],
      defaultStyle:{
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
          margin: [0, 10, 0, 5]
        },
        subsubheader:{
          fontSize: 16,
          bold: true,
          margin: [4, 10, 0, 5]
        }
      }
    }

    this.pdfObject = pdfMake.createPdf(docDef);

    let date: Date = new Date();
    
    let pdfName = 'Results_'+date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+'.pdf';


    if (this.platform.is('cordova')){
      console.log('this platform is cordova')
      this.pdfObject.getBase64(async (data) => {
        try{
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
      console.log('this platform is desktop')
      this.pdfObject.download(pdfName);
    }
    
  }

  public getAreasConCategoriasSeleccionadas(): {nombre: string, categorias: Categoria[]}[]{

    let areas = new Array<{nombre: string, categorias: Categoria[]}>();

    this.ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas
      .forEach(area => {
        // Si en el área hay alguna categoría seleccionada la añadimos
        if(area.categorias.some(categoria => categoria.isChecked)){
          let length = areas.push({nombre: area.nombre, categorias: []})
          
          area.categorias.filter(categoria => categoria.isChecked)
            .forEach(categoriaSeleccionada => areas[length-1].categorias.push(categoriaSeleccionada))
        }
      })
    return areas;
  }

  public generateCategoriasDataPDF(): [{text: string, style: string},{type: string, ol: Array<String>, style: string}][] {
    let datosAreas = new Array<[{text: string, style: string},{type: string, ol: Array<String>, style: string}]>();
    let areas = this.getAreasConCategoriasSeleccionadas();

    areas.forEach(area => {
      datosAreas.push([
        {text: area.nombre, style: 'listheader'},
        {type: 'lower-alpha',ol: area.categorias.map(categoria => categoria['nombre']),style: 'subsubheader'}
      ])
    })
    return datosAreas;
  }

  public generarDatosRecomendaciones(): Area[]{

    let areas = this.ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas.filter(area => 
      area.categorias.some(categoria => categoria.isChecked)
    )

    areas.forEach(area => console.log("AAAAAA: " + area.nombre))

    return areas;
  }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';
import { RestService } from '../services/apirest/rest.service'
import { Idioma, Area, Categoria } from '../services/interfaces/cuestionario';

@Component({
  selector: 'app-recoleccion-datos',
  templateUrl: './recoleccion-datos.component.html',
  styleUrls: ['./recoleccion-datos.component.scss'],
})
export class RecoleccionDatosComponent implements AfterViewInit {

  public allDataRest: Idioma[];

  /** Copia por referencia de las categorias seleccionadas del ticket */
  public categoriasSeleccionadas = this.ticketService.ticketInformation.recoleccionDatos.categoriasSeleccionadas;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController, private restService: RestService) {
    // Volver de proceso ya que no ha pasado el filtro
    if(!ticketService.checkTicketExplicacion()){
      this.router.navigate(['explicacion'])
    }

    console.log(this.categoriasSeleccionadas.map((item) => " " + item['nombre']))

    // Traemos los datos de la api (Llamada asíncrona)
    restService.getAllData().subscribe((data) => {
      if(data){
        this.hideLoader()
        this.allDataRest = data;
        console.log("Languajes retrieved:" + this.allDataRest.map((item) => " " + item['nombre']))
      }
    })
  }

  ngAfterViewInit(): void {
    //Marcamos los checkbox seleccionados del ticket
    const checkboxes = document.getElementsByTagName('ion-checkbox');
    console.log("viewinit: " + checkboxes.length)
    this.categoriasSeleccionadas.forEach(x => {
      console.log("checkbox length: " + checkboxes.length)
      for(let i=0 ; i<checkboxes.length ; i++){
        console.log("noencontrado")
        if(checkboxes[i].id.toString() === x.id.toString()){
          console.log("encontrado")
          checkboxes[i].setAttribute("checked","true");
        }
      }
      //console.log(elemento[0].setAttribute("checked","true"))
    })
  }

  public onCheckboxChange(categoriaSeleccionada: Categoria, event: any){
    let seHaSeleccionado = (event.target as Element).attributes.getNamedItem("aria-checked").textContent
    console.log("Selected categoría: " + categoriaSeleccionada.nombre + ", Att: " + seHaSeleccionado);

    // Los valores True/False están invertidos porque el ionChange se lanza antes
    if(seHaSeleccionado !== "true"){
      this.categoriasSeleccionadas.push(categoriaSeleccionada)
    } else {
      this.categoriasSeleccionadas.splice(this.categoriasSeleccionadas.indexOf(categoriaSeleccionada), 1)
    }
  }

  public onNextPage(){
    console.log("Saving ticket with selected categorias: " + this.categoriasSeleccionadas.map((item) => " " + item['nombre']))

    if(this.ticketService.checkTicketRecoleccionDatos()){
      console.log("Redirect to: cuestionario")
      this.router.navigate(['cuestionario'])
    } else {
      console.log("Unasigned required attributes, not redirecting")
    }
  }

  public onBackPage(){
    console.log("Redirect to: explicacion")
    this.router.navigate(['explicacion'])
  }

  public onPerfilSelectChange(profile: string){
    console.log("Profile selected: " + profile)
    this.ticketService.ticketInformation.recoleccionDatos.perfilUsuario = profile
  }

  /** Comprueba si la categoría está asignada en el ticket para marcar su checkbox */
  public comprobarEnTicket(categoria: Categoria): boolean{
    console.log("comprobarEnTicket: Categoría seleccionada: " + categoria.nombre)
    let seHaEncontrado = false
    this.categoriasSeleccionadas.forEach(y => {
        if(y.id === categoria.id){
          seHaEncontrado = true
        }
      })
      return seHaEncontrado;
  }

  public hideLoader(): void{
    document.getElementById('loading').style.display = 'none';
  }
}

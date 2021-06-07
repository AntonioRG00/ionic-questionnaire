import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  public explicacion;
  public menuPorPasos: MenuItem[];
  public menuPorPasosMovil: MenuItem[];

  constructor(private translateService: TranslateService) {
    let recoleccion;
    
    console.log(this.explicacion);
  }

  ngOnInit() {
    this.menuPorPasos = [
      {label: this.getExplicacion(), routerLink: '/explicacion'},
      {label: this.getRecoleccion(), routerLink: '/recoleccionDatos'},
      {label: this.getCuestionario(), routerLink: '/cuestionario'},
      {label: this.getResultados(), routerLink: '/recomendacion'}
    ];
    
    this.menuPorPasosMovil = [
      {label: '', routerLink: '/explicacion'},
      {label: '', routerLink: '/recoleccionDatos'},
      {label: '', routerLink: '/cuestionario'},
      {label: '', routerLink: '/recomendacion'}
    ];
  }

  public getExplicacion(): string{
    console.log('Calling getExplicacion')
    let explicacion;
    this.translateService.stream("STEP_1").subscribe(
      res => explicacion = res
    );
    return explicacion;
  }

  public getRecoleccion(): string{
    let recoleccion;
    this.translateService.stream("STEP_2").subscribe(
      res => recoleccion = res
    );
    return recoleccion;
  }

  public getCuestionario(): string{
    let cuestionario;
    this.translateService.stream("STEP_3").subscribe(
      res => cuestionario = res
    );
    return cuestionario;
  }

  public getResultados() : string{
    let resultado;
    this.translateService.stream("STEP_4").subscribe(
      res => resultado = res
    );
    return resultado;
  }
  

}

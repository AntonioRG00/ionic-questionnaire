import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  //propiedad = 7;

  public explicacion;
  public menuPorPasos: MenuItem[];
  public menuPorPasosMovil: MenuItem[];

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.menuPorPasos = [
      {label: "Explanation", routerLink: '/explicacion'},
      {label: "Data collection", routerLink: '/recoleccionDatos'},
      {label: "Questionnaire", routerLink: '/cuestionario'},
      {label: "Results", routerLink: '/recomendacion'}
    ];
    
    this.menuPorPasosMovil = [
      {label: '', routerLink: '/explicacion'},
      {label: '', routerLink: '/recoleccionDatos'},
      {label: '', routerLink: '/cuestionario'},
      {label: '', routerLink: '/recomendacion'}
    ];
  }

  public getExplicacion(): string{
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

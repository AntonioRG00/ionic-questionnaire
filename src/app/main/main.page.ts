import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  public menuPorPasos: MenuItem[];
  public menuPorPasosMovil: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.menuPorPasos = [
      {label: 'Explicación', routerLink: '/explicacion'},
      {label: 'Recolección de datos', routerLink: '/recoleccionDatos'},
      {label: 'Cuestionario', routerLink: '/cuestionario'},
      {label: 'Resultados', routerLink: '/recomendacion'}
    ];
    
    this.menuPorPasosMovil = [
      {label: '', routerLink: '/explicacion'},
      {label: '', routerLink: '/recoleccionDatos'},
      {label: '', routerLink: '/cuestionario'},
      {label: '', routerLink: '/recomendacion'}
    ];
  }

}

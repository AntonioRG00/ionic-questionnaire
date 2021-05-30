import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket/ticket.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styleUrls: ['./recomendacion.component.scss'],
})
export class RecomendacionComponent implements OnInit {

  basicData: any;
  basicOptions: any;

  constructor(public ticketService: TicketService, private router: Router,
    public alertController: AlertController) {

      // Volver de proceso ya que no ha pasado el filtro
      if(!ticketService.checkTicketCuestionario()){
        this.router.navigate(['cuestionario'])
      }
      this.basicData = {
        // Los labels no esta terminado
        labels: ticketService.ticketInformation.explicacion.idiomaSeleccionado.areas,
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: '#FFA726',
                data: [28, 48, 40, 19, 86, 27, 90]
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
                  fontColor: '#495057'
              }
          }]
      }
  };

    }

  ngOnInit() {}

}

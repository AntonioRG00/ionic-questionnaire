import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private primengConfig: PrimeNGConfig,
    private translateService: TranslateService) {
      this.initTranslateService() 
    }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  public initTranslateService(){
    this.translateService.setDefaultLang('English');
    this.translateService.addLangs(['English', 'Italian', 'Spanish']);
  }
}

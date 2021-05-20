import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
})
export class SplashComponent implements OnInit {

  windowWidth: string;
  showSplash = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.windowWidth = '-' + window.innerWidth + 'px';

      setTimeout(() => {
        this.showSplash = !this.showSplash;
      }, 1500);
    }, 3000);
  }

}

import { MenuController } from '@ionic/angular';
import { GetmenusService } from './services/getmenus.service';
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Observable } from 'rxjs';
import { Interfaces } from './interfaces/interfaces.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  menuComponents:Interfaces[];
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private allMenuComponents:GetmenusService,
    private menu:MenuController
  ) {
    this.initializeApp();
  }
  ngOnInit(): void {
    this.menuComponents=this.allMenuComponents.getMenusOptions();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  closeFirst() {
    this.menu.enable(true, 'first');
    this.menu.close('first');
  }


  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

}

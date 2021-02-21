import { HttpsService } from "./services/https.service";
import { MenuController } from "@ionic/angular";
import { GetmenusService } from "./services/getmenus.service";
import { Component, OnInit } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Observable } from "rxjs";
import { Interfaces, tokengenerated } from "./interfaces/interfaces.interface";
import { Storage } from "@ionic/storage";
//decoding jwt
import jwt_decode from "jwt-decode";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "./globalReducer.reducer";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  menuComponents: Interfaces[];
  token: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private allMenuComponents: GetmenusService,
    private menu: MenuController,
    private httpServices: HttpsService,
    private tokenStorage: Storage,
    private stateStore: Store<GlobalAppState>
  ) {
    this.initializeApp();
  }
  async ngOnInit() {
    this.stateFetcher();
    this.stateStore.select('authReducers').subscribe(data=>{
      console.log(data.dedToken);
      
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  async openFirst() {
    await this.stateFetcher();
    this.menu.open("first");
  } //abriendo menu lateral de id first

  closeFirst() {
    // this.menu.enable(true, "first");
    this.menu.close("first");
  } //fucnion para cerrar  menu lateral de id first

  async logOut() {
    let token = await this.token;
    await this.httpServices.logOutUser().then(() => {
      this.closeFirst();
    });
  } //log out user

  stateFetcher() {
    this.stateStore.select("authReducers").subscribe((data) => {
      let authoritiesOfUser: string[] = ["NO_ROLE"];
      //se establece una variable que supliria la no existencia de authoridad en el
      //redux por un valor para que no se de null
     
      if (data.dedToken) {
        
        authoritiesOfUser = data.dedToken.authorities;
      }
      //establecindose una condicion que demarca que se cogeria el valore que
      //traiga la data referente al token decodificado especificamente el apartado
      //de authorities [NO_ROLE] en la variable authoritiesOfUser,

      this.menuComponents = this.allMenuComponents.getMenusOptions(
        data.userAuth,
        authoritiesOfUser
      );
      //se le asigna a la variable menuComponents cualesquiera el valor que traiga
      //el metodo del servicio getMenusOptions, pasando como parametros los elementos
      //traidos desde el Store redux como son el userIsauth y la variable authoritiesOfUser
      //emulando los authorities del token decodificado del redux on en el caso contrario
      //el valor previamente demarcado[NO_ROLE]
    });
  }
  //metodo encargado de filtrar el menu segun el usuario logeado y su authridad.Para ello se le pasa
  //al metodo de susbcripcion de  al redux , buscando especificamente el isAuth asi como lo referente
  //al token decodificado para de e;l accedera las autoridades
}

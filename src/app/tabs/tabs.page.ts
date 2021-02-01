import { HttpsService } from "./../services/https.service";
import { GetmenusService } from "./../services/getmenus.service";
import { Component } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "../globalReducer.reducer";
import { UserStatusCombo } from "../interfaces/interfaces.interface";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  userCombostatus: UserStatusCombo;
  boolean:boolean;
  constructor(
    private menu: MenuController,
    private stateStore: Store<GlobalAppState>,
    private tabsService: GetmenusService,
    private httpService: HttpsService
  ) {}

  async ngOnInit() {
    this.getStateAndAuthoritie();
    await this.httpService.authDetection.subscribe((data) => {
      this.userCombostatus.user_auth = this.getStateAndAuthoritie().user_auth;
      this.userCombostatus.user_authoritie= this.getStateAndAuthoritie().user_authoritie;
      this.boolean=!this.boolean
    });
  }

  openFirst() {
    this.menu.open("first");
  }
  //metodo que demarca la apertura del del menu desde cualquier tab que se encuentre el
  //usuario

  getStateAndAuthoritie() {
    this.stateStore.select("authReducers").subscribe((data) => {
      let authoritiesOfUser: string = "no_role";
      //se establece una variable que supliria la no existencia de authoridad en el
      //redux por un valor para que no se de null

      let comboUser: any;

      if (data.dedToken) {
        authoritiesOfUser = data.dedToken.authorities[0];
      }
      //establecindose una condicion que demarca que se cogeria el valore que
      //traiga la data referente al token decodificado especificamente el apartado
      //de authorities [NO_ROLE] en la variable authoritiesOfUser,

      comboUser = this.tabsService.getStateAndAuthoritie(
        data.userAuth,
        authoritiesOfUser
      );
      this.userCombostatus = comboUser;
      console.log(this.userCombostatus);
      console.log("click");
    });
    return this.userCombostatus;
  }
}

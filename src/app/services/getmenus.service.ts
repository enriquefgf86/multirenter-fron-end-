import { HttpsService } from "./https.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Interfaces } from "../interfaces/interfaces.interface";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "../globalReducer.reducer";

@Injectable({
  providedIn: "root",
})
export class GetmenusService {

  userCombostatus:any;
  components: Interfaces[] = [
    { src: "../../assets/home.svg", title: "Home", url: "/tabs/tab1" },
    // {
    //   src: "../../assets/rentProduct.svg",
    //   title: "Products",
    //   url: "/tabs/tab2",
    // },
    {
      src: "../../assets/dashboard.svg",
      title: "My Dashboard",
      url: "/tabs/tab3",
    },
    {
      src: "../../assets/admin.svg",
      title: "Admin Dashboard",
      url: "/tabs/tab4",
    },
    { src: "../../assets/about.svg", title: "About Me", url: "/tabs/tab5" },
    {
      src: "../../assets/login.svg",
      title: "Login",
      url: "/tabs/tab6",
    },
    {
      src: "../../assets/signUp.svg",
      title: "Register",
      url: "/tabs/tab7",
    },
    
    // {
    //   src: "../../assets/logout.svg",
    //   title: "Log Out",
    // },
   
  ];

  constructor(
    private httpServices: HttpsService,
    private stateStore: Store<GlobalAppState>
  ) {}

  getMenusOptions(userAuth: any, authorities: string[]) {
    console.log(userAuth);

    let arrayComponents: Interfaces[];

    if (
      userAuth == null ||
      authorities[0] == "NO_RENTER" ||
      userAuth == undefined ||
      (userAuth == null && authorities[0] == "NO_RENTER")
    ) {
      arrayComponents = this.components.filter((components) => {
        return (
          components.title != "Admin Dashboard" &&
          components.title != "My Dashboard"
        );
      });
    }
    //filtro que establece que si no hay usario registrado no se muestran 
    //los items de dashboard para user y usuario 

    if (
      userAuth == true ||
      authorities[0] == "NO_RENTER" ||
      (userAuth == true && authorities[0] == "NO_RENTER")
    ) {
      arrayComponents = this.components.filter((components) => {
        return (
          components.title != "Admin Dashboard" &&
          components.title != "My Dashboard"
        );
      });
    }
    //filtro que establece que si no hay usario registrado no se muestran 
    //los items de dashboard para user y usuario , o que si esta autenticado 
    //pero por algun motivo en sus  roles dice NO_RENTER

    if (userAuth == true && authorities[0] == "ROLE_RENTER") {
      arrayComponents = this.components.filter((components) => {
        return (
          components.title != "Admin Dashboard" &&
          components.title != "Login" &&
          components.title != "Register"
        );
      });
    }
    //Mostrando los items autorizados segun el usuario rentado con su role , en este caso 
    //teniendo el role de ROLE_RENTER

    if (userAuth == true && authorities[0] == "ROLE_ADMIN") {

      arrayComponents = this.components.filter((components) => {
        return (
          components.title != "My Dashboard" &&
          components.title != "Login" &&
          components.title != "Register"
        );
      });
     //Mostrando los items autorizados segun el usuario rentado con su role , en este caso 
    //teniendo el role de ROLE_ADMIN

    }
    return arrayComponents;
  }
  //retronando todos los compomentes del menu segun condiciones pasadas en el parametro
  //como un boolenao que demarca si el usuario esta autenticado o no  y un array de string
  //que enmarca las authorizaciones del usuario autentcado

  getStateAndAuthoritie(userAuth: boolean, authorities: string) {

    let authoritie: string  = "no_role";

    let userAuthState: boolean = false;

    if (!userAuth) {
      userAuthState = false;
    }
    if (userAuth) {
      userAuthState = true;
    }
    // if (authorities==undefined) {
    //   authoritie = "no_role";
    // }
    // if (authorities==null) {
    //   authoritie = "no_role";
    // }

    return [{user_auth:userAuth},{user_authoritie:authorities}];
  }

}

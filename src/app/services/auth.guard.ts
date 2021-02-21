import { tap } from "rxjs/operators";
import { StorageService } from "./storage.service";
import { HttpsService } from "./https.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";
import { Store } from "@ngrx/store";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private routering: Router,
    private httpServices: HttpsService,
    private storage: StorageService,
    private stateStore: Store
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    
    return  this.httpServices.renewToken()
    .pipe(
      tap((isAuth) => {
        console.log(isAuth);

        if (!isAuth) {
          this.routering.navigate(["/tabs/tab6"]);
        }
      })
    ); 
    // return this.httpServices.isAuth().pipe(
    //   tap((state) => {
    //     console.log(state);

    //     if (!state) {
    //       this.routering.navigate(["/tabs/tab6"]);
    //     }
    //   })
    // );
  }
  //Este guardian accederia al servicio y en el a una de los metodos
  //encargados de derminar si el usuario esta autenticado o no , verificando su estado
  //que a su vez es posible detectar a traves de otro metodo dentro del servicio
  //que accede al state del Redux en donde se determina si hay usuario o no
  //si es null o falso entonces a traves del metodo pipe , y dentro de el  a traves del
  //tap , se procederia a establecer una condicion que verifique dicho estado booleano ,
  //en donde de ser negativo se procederia  a routerizar la aplicacion hacia u landpage .
  //es necesario poer este guardian en cada una de las subrutas de los pages que
  //queremos sean vigilados
}

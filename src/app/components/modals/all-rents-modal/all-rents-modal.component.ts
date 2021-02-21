import { Component, Input, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ModalController, LoadingController, PopoverController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { RenterRents } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";
import { RentSelectedModalComponent } from "../rent-selected-modal/rent-selected-modal.component";

@Component({
  selector: "app-all-rents-modal",
  templateUrl: "./all-rents-modal.component.html",
  styleUrls: ["./all-rents-modal.component.scss"],
})
export class AllRentsModalComponent implements OnInit {
  allRents: RenterRents[] = [];
  constructor(
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private pop:PopoverController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController
  ) {}
  ngOnInit() {
    this.stateStore.select("renterReducers").subscribe((data) => {
      this.allRents = Object.keys(data.openRents).map((key) => {
        return data.openRents[key];
      });
      console.log(data.openRents);
    });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.mdlCtrl.dismiss({
      dismissed: true,
    });
  }

  async goToRent(event) {
    console.log(event);
    var target =
      (await event.target) ||
      (await event.srcElement) ||
      (await event.currentTarget);
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    console.log(target.id);
    let id: number = Number(target.id);
    this.showRentSelected(id);
  }
  //Mostrando el editor o madal para la imagen seleccionada una vez clickado el card
  //correspondiente al cual se le asigna por valor el id de la imagen

  async showRentSelected(rentId: number) {
    const modal = await this.pop.create({
      component: RentSelectedModalComponent,
      cssClass: 'popover',
      componentProps: {
        rentId,
      },
    });
    return await modal.present();
  }
  //Abriendo el modal que edita las imagenes haciendo referencia al componente
  // EditImageSelectedComponent
}

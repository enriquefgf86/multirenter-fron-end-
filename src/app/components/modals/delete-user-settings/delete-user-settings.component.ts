import { DeleteUserSelectedComponent } from "./delete-user-selected/delete-user-selected.component";
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ModalController, LoadingController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { HttpsService } from "src/app/services/https.service";
import { AllRenter } from "src/app/interfaces/interfaces.interface";

@Component({
  selector: "app-delete-user-settings",
  templateUrl: "./delete-user-settings.component.html",
  styleUrls: ["./delete-user-settings.component.scss"],
})
export class DeleteUserSettingsComponent implements OnInit {
  allUsers: AllRenter[]=[];
  constructor(
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.getAllUsersArray()
  }

  async goToUser(event) {
    //console.log(event);
    var target =
      (await event.target) ||
      (await event.srcElement) ||
      (await event.currentTarget);
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    //console.log(target.id);
    let id: number = Number(target.id);
    this.showUserSelected(id);
  }
  //Mostrando el editor o madal para la imagen seleccionada una vez clickado el card
  //correspondiente al cual se le asigna por valor el id de la imagen

  async getAllUsersArray() {
    await this.httpService.getAllRenters();
    await this.stateStore.select("renterReducers").subscribe((data) => {
      if (data.renterArray) {
        this.allUsers = Object.keys(data.renterArray).map((key) => {
          return data.renterArray[key];
        });
      }
    });
    //console.log(this.allUsers);
  }
  async showUserSelected(userId: number) {
    const modal = await this.mdlCtrl.create({
      component: DeleteUserSelectedComponent,
      componentProps: {
        userId,
      },
    });
    return await modal.present();
  }
  //Abriendo el modal que edita las imagenes haciendo referencia al componente
  // EditImageSelectedComponent

  dismiss() {
    this.mdlCtrl.dismiss();
  }
  //cerrando el moal existente
}

import { EditImageSelectedComponent } from "./edit-image-selected/edit-image-selected.component";
import { AllImage } from "./../../../interfaces/interfaces.interface";
import { Component, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ModalController, LoadingController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-edit-image-settings",
  templateUrl: "./edit-image-settings.component.html",
  styleUrls: ["./edit-image-settings.component.scss"],
})
export class EditImageSettingsComponent implements OnInit {
  allImages: AllImage[] = [];

  constructor(
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.getAllImagesArray();
  }

  async getAllImagesArray() {
    await this.httpService.getAllimgSubTypes();
    await this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.allImgSubType) {
        this.allImages = Object.keys(data.allImgSubType).map((key) => {
          return data.allImgSubType[key];
        });
      }
    });
    console.log(this.allImages);
  }

  async goToImage(event) {
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
    this.showSelectedImgEditselected(id)
  }
    //Mostrando el editor o madal para la imagen seleccionada una vez clickado el card
    //correspondiente al cual se le asigna por valor el id de la imagen 

  async showSelectedImgEditselected(imageId: number) {
    const modal = await this.mdlCtrl.create({
      component: EditImageSelectedComponent,
      componentProps: {
        imageId,
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

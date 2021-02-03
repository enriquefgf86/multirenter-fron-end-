import { EditProductTypeSelectedComponent } from './edit-product-type-selected/edit-product-type-selected.component';
import { ModalController } from "@ionic/angular";
import { AllProductsType } from "src/app/interfaces/interfaces.interface";
import { Component, OnInit, Renderer2 } from "@angular/core";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-edit-product-type",
  templateUrl: "./edit-product-type.component.html",
  styleUrls: ["./edit-product-type.component.scss"],
})
export class EditProductTypeComponent implements OnInit {
  allProductsTypes: AllProductsType[] = [];

  constructor(
    private renderer: Renderer2,
    private httpService: HttpsService,
    private stateStore: Store<GlobalAppState>,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getAllProductsTypes()
  }

  async editProdType(event) {
    var target =
      (await event.target) ||
      (await event.srcElement) ||
      (await event.currentTarget);
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    console.log(target.id);
    let id: number = Number(target.id);

    this.showSelectedProdTypeToEditModal(id) 
  }

  getAllProductsTypes() {
    this.httpService.getAllProdtypes().then(() => {
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProductsType) {
          this.allProductsTypes = Object.keys(data.allProductsType).map(
            (key) => {
              return data.allProductsType[key];
            }
          );
          console.log(this.allProductsTypes);
        }
      });
    });
    //trayendo desde el store el complemento de subtipos de productos , convirtiendolos
    //a a rray para luego asignarlos al variable allProdSubTypes
  }

  async showSelectedProdTypeToEditModal(productTypeId: number) {
    const modal = await this.modalController.create({
      component: EditProductTypeSelectedComponent,
      componentProps: {
        productTypeId,
      },
    });
    return await modal.present();
  }
  //Abriendo el modal que edita productos haciendo referencia al componente
  // ProductSelectedComponent

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }
  //fucnion que cierra los modales
}

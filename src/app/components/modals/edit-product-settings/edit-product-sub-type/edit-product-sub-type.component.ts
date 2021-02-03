import { AllProductsSubType } from "./../../../../interfaces/interfaces.interface";
import { Component, OnInit, Renderer2 } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { HttpsService } from "src/app/services/https.service";
import { ProductSubtypeSelectedComponent } from "./product-subtype-selected/product-subtype-selected.component";

@Component({
  selector: "app-edit-product-sub-type",
  templateUrl: "./edit-product-sub-type.component.html",
  styleUrls: ["./edit-product-sub-type.component.scss"],
})
export class EditProductSubTypeComponent implements OnInit {
  allProductsSubTypes: AllProductsSubType[] = [];

  constructor(
    private renderer: Renderer2,
    private httpService: HttpsService,
    private stateStore: Store<GlobalAppState>,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getAllProductsSubTypes()
  }

  async editProdSub(event) {
    var target =
      (await event.target) ||
      (await event.srcElement) ||
      (await event.currentTarget);
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    console.log(target.id);
    let id: number = Number(target.id);

    this.showSelectedProdSubToEditModal(id);
  }
  //Mostrando el editor o madal para el producto seleccionado

  getAllProductsSubTypes() {
    this.httpService.getAllProdSubTypes().then(() => {
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProductsSubType) {
          this.allProductsSubTypes = Object.keys(data.allProductsSubType).map(
            (key) => {
              return data.allProductsSubType[key];
            }
          );
          console.log(this.allProductsSubTypes);
        }
      });
    });
    //trayendo desde el store el complemento de subtipos de productos , convirtiendolos
    //a a rray para luego asignarlos al variable allProdSubTypes
  }

  async showSelectedProdSubToEditModal(productSubTypeId: number) {
    const modal = await this.modalController.create({
      component: ProductSubtypeSelectedComponent,
      componentProps: {
        productSubTypeId,
      },
    });
    return await modal.present();
  }
  //Abriendo el modal que edita productos haciendo referencia al componente
  // ProductSelectedComponent

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }
}

import { ProductSubtypeSelectedComponent } from '../edit-product-sub-type/product-subtype-selected/product-subtype-selected.component';
import { ProductSelectedComponent } from './product-selected/product-selected.component';
import { ModalController } from "@ionic/angular";
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { ListofProduct } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"],
})
export class EditProductComponent implements OnInit {
  allProducts: ListofProduct[] = [];
  @ViewChild("some") child: ElementRef;

  constructor(
    private renderer: Renderer2,
    private httpService: HttpsService,
    private stateStore: Store<GlobalAppState>,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.httpService.getAllProducts().then(() => {
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProducts) {
          this.allProducts = Object.keys(data.allProducts).map((key) => {
            return data.allProducts[key];
          });
          console.log(this.allProducts);
        }
      });
    });
    //trayendo desde el store el complemento de subtipos de productos , convirtiendolos
    //a a rray para luego asignarlos al variable allProdSubTypes
  }

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }

 async editProd(event) {
    var target =await  event.target ||await  event.srcElement ||await  event.currentTarget;
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    console.log(target.id);
    let id:number=Number(target.id)

    this.showSelectedProdToEditModal(id)

  }
  //Mostrando el editor o madal para el producto seleccionado 
  
  async showSelectedProdToEditModal(productId: number) {
    const modal = await this.modalController.create({
      component: ProductSelectedComponent,
      componentProps: {
        productId ,
      },
    });
    return await modal.present();
  }
  //Abriendo el modal que edita productos haciendo referencia al componente
  // ProductSelectedComponent

}

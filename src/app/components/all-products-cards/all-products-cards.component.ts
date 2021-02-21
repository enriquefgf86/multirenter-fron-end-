import { ProductViewComponent } from "./../modals/product-view/product-view.component";
import {
  AllImage,
  ListofProduct,
} from "./../../interfaces/interfaces.interface";
import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { AngularFireStorage } from "@angular/fire/storage";
import { ModalController, LoadingController } from "@ionic/angular";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-all-products-cards",
  templateUrl: "./all-products-cards.component.html",
  styleUrls: ["./all-products-cards.component.scss"],
})
export class AllProductsCardsComponent implements OnInit {
  allProducts: ListofProduct[] = [];
  allProductsImg: AllImage[] = [];
  sliderOptions = {
    slidesPerView: 1.3,
    freeMode: true,
    autoplay: true,

    // spaceBetween:-420
  };
  constructor(
    private stateStore: Store<GlobalAppState>,
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.allProducts) {
        // console.log(data);
        let arrayInStoreObjOfObjs = data.allProducts;
        //en este caso al guardarse en el store se guarda como un objeto de objetos

        let array = Object.keys(arrayInStoreObjOfObjs).map((key) => {
          return arrayInStoreObjOfObjs[key];
        });
        //vease entonces que para hacerlo iterable haria falta comvertir ese objeto de
        //objetos a array de objetos , de ahi que mediante mel metodo Object, se acceden a cada
        //una lde las keys de dicho objeto, para luego mediante map modificarlo y retornar u resultado
        //modificado  a manera de array
        // console.log(array);

        this.allProducts = array;
        //obtenido dicho array simplemente se procederia a asigar el valor de los mismos  de manera desagregada
        //a una variable creada para poder ser iterada desde el html
        // console.log(this.allProducts);
      }
    });
  }

 async goToProduct(event) {
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
    this.getProductSelectedModal(id)
  }
  //accediendose al modal de productos seleccionado

 async getProductSelectedModal(prodId:number) {
    const modal = await this.mdlCtrl.create({
      component: ProductViewComponent,
      componentProps: {
        prodId,
      },
    });
    return await modal.present();
  }
  //metodo que triggeriza el modal correspodiente al componente que se quiera ostrar en este caso seria 
  //ProductViewComponent, pasandosele como propiedad el id del producto que se quiere mostrar 
  //enm este caso mediante acceso a props , y la variable prodId
}

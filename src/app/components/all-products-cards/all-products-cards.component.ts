import {
  AllImage,
  ListofProduct,
} from "./../../interfaces/interfaces.interface";
import { Store } from "@ngrx/store";
import { Component, OnInit } from "@angular/core";
import { GlobalAppState } from "src/app/globalReducer.reducer";

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
  constructor(private stateStore: Store<GlobalAppState>) {}

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
}

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import {
  AllFeeDeelay,
  Allprice,
  Product,
} from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-product-selected",
  templateUrl: "./product-selected.component.html",
  styleUrls: ["./product-selected.component.scss"],
})
export class ProductSelectedComponent implements OnInit {
  @Input("productId") productId;
  feesProduct: AllFeeDeelay[];
  pricesProduct: Allprice[];
  editProdForm: FormGroup;
  productSelected: Product;
  renterId: number;

  constructor(
    private httpService: HttpsService,
    private modalController: ModalController,
    private stateStore: Store<GlobalAppState>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    console.log(this.productId);
    this.httpService.getProductById(this.productId);

    this.gettingUserId();
    this.getAllProdFees();
    this.getAllProdPrice();
    this.httpService.getAllProductFees();
    this.getProductSelected();

    this.editProdForm = this.formBuilder.group({
      productName: ["", Validators.required],
      productPrice: ["", Validators.required],
      productFeeDelay: ["", Validators.required],
    });
  }

  closeCreateProdModal() {
    this.modalController.dismiss();
  }
  //cerrando el modal

  async editProd() {
    const { productName, productFeeDelay, productPrice } = await this
      .editProdForm.value;
    console.log(this.editProdForm.value);

    this.httpService.editProductById(
      productName,
      productPrice,
      productFeeDelay,
      this.productId,
      this.renterId
    ).then(()=>{
      this.closeCreateProdModal() 
    });
  }
  //triggerizando el metodo de editar producto

  getProductSelected() {
    this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.productSelectedId) {
        this.productSelected = data.productSelectedId;
        console.log(this.productSelected);
      }
    });
  }
  //trayendo desde el redux el producto seleccionado para su edicion y demas

  async getAllProdFees() {
    await this.httpService.getAllProductFees();
    this.stateStore.select("prodReducers").subscribe(async (data) => {
      if (data.allFeesProducts) {
        this.feesProduct = Object.keys(data.allFeesProducts).map((key) => {
          return data.allFeesProducts[key];
        });
        console.log(this.feesProduct);
      }
    });
  }
  //accediendo a los valores de fees de todos los tipos de productos desde el store de redux aunque primero
  //se llama al servicio de obtener todos los fees antes de proceder. Para ;luego igualar dicho resultdo
  //a la variable this.feesProduct  ya convertido a un array de objetos

  async getAllProdPrice() {
    await this.httpService.getAllProductPrices();
    this.stateStore.select("prodReducers").subscribe(async (data) => {
      if (data.allPricesProducts) {
        this.pricesProduct = Object.keys(data.allPricesProducts).map((key) => {
          return data.allPricesProducts[key];
        });
        console.log(this.pricesProduct);
      }
    });
  }
  //accediendo a los valores de precios de todos los tipos de productos desde el store de redux aunque primero
  //se llama al servicio de obtener todos los precios antes de proceder. Para ;luego igualar dicho resultdo
  //a la variable this.feesProduct  ya convertido a un array de objetos

  gettingUserId() {
    this.stateStore.select("authReducers").subscribe((data) => {
      if (data.dedToken) {
        this.renterId = data.dedToken.id;
      }
    });
  }
  //Funcion que obtine el id del usuario actual autenticado para la gestio  de metodos
}

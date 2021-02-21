import {
  AllFeeDeelay,
  Allprice,
  AllProductsSubType,
  AllProductsType,
} from "./../../../../interfaces/interfaces.interface";
import { HttpsService } from "./../../../../services/https.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-create-product",
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.scss"],
})
export class CreateProductComponent implements OnInit {
  createProdForm: FormGroup;
  feesProduct: AllFeeDeelay[];
  pricesProduct: Allprice[];
  productSubType: AllProductsSubType[];
  productType: AllProductsType[];
  constructor(
    private formBuilder: FormBuilder,
    private stateStore: Store<GlobalAppState>,
    private httpService: HttpsService,
    private modal: ModalController
  ) {}

  ngOnInit() {
    this.createProdForm = this.formBuilder.group({
      productName: ["", Validators.required],
      productSubType: ["", Validators.required],
      productType: ["", Validators.required],
      productPrice: ["", Validators.required],
      productFeeDelay: ["", Validators.required],
    });

    this.getAllProdFees();
    this.getAllProdPrices();
    this.getAllProdSubType();
    this.getAllProdType();
  }

  async createProd() {
    let renterId;
    await this.stateStore.select("authReducers").subscribe((data) => {
      renterId = data.dedToken.id;
    });
    const {
      productName,
      productSubType,
      productType,
      productPrice,
      productFeeDelay,
    } = await this.createProdForm.value;
    //console.log(this.createProdForm.value, renterId);

    await this.httpService.createProduct(
      productName,
      productSubType,
      productType,
      productFeeDelay,
      productPrice,
      renterId
    );
    this.closeCreateProdModal();
  }

  async getAllProdPrices() {
    await this.httpService.getAllProductPrices();
    this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.allPricesProducts) {
        this.pricesProduct = Object.keys(data.allPricesProducts).map((key) => {
          return data.allPricesProducts[key];
        });
        //console.log(this.pricesProduct);
      }
    });
  }
  //accediendo a los valores de price de todos los tipos de productos desde el store de redux aunque primero
  //se llama al servicio de obtener todos los price antes de proceder. Para ;luego igualar dicho resultdo
  //a la variable this.priceProduct  ya convertido a un array de objetos

  async getAllProdFees() {
    await this.httpService.getAllProductFees();
    this.stateStore.select("prodReducers").subscribe(async (data) => {
      if (data.allFeesProducts) {
        this.feesProduct = Object.keys(data.allFeesProducts).map((key) => {
          return data.allFeesProducts[key];
        });
        //console.log(this.feesProduct);
      }
    });
  }
  //accediendo a los valores de fees de todos los tipos de productos desde el store de redux aunque primero
  //se llama al servicio de obtener todos los fees antes de proceder. Para ;luego igualar dicho resultdo
  //a la variable this.feesProduct  ya convertido a un array de objetos

  async getAllProdType() {
    await this.httpService.getAllProdtypes();
    this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.allProductsType) {
        this.productType = Object.keys(data.allProductsType).map((key) => {
          return data.allProductsType[key];
        });
        //console.log(this.productType);
      }
    });
  }
  //accediendo a los valores de todos los tipos de productos desde el store de redux aunque primero
  //se llama al servicio de obtener todos los productos antes de proceder. Para ;luego igualar dicho resultdo
  //a la variable this product type ya convertido a un array de objetos

  async getAllProdSubType() {
    await this.httpService.getAllProdSubTypes();
    this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.allProductsSubType) {
        this.productSubType = Object.keys(data.allProductsSubType).map(
          (key) => {
            return data.allProductsSubType[key];
          }
        );
        //console.log(this.productSubType);
      }
    });
  }
  //accediendo a los valores de subtype de todos los tipos de productos desde el store de redux aunque primero
  //se llama al servicio de obtener todos los subtype antes de proceder. Para ;luego igualar dicho resultdo
  //a la variable this.productSubType  ya convertido a un array de objetos

  closeCreateProdModal() {
    return this.modal.dismiss();
  }
  //fucnion que cierra los modales
}

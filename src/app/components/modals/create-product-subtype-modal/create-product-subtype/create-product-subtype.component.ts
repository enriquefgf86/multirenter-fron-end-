import { ModalController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpsService } from "src/app/services/https.service";
import { AllProductsSubType } from "src/app/interfaces/interfaces.interface";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";

@Component({
  selector: "app-create-product-subtype",
  templateUrl: "./create-product-subtype.component.html",
  styleUrls: ["./create-product-subtype.component.scss"],
})
export class CreateProductSubtypeComponent implements OnInit {
  prodSubForm: FormGroup;
  allProdSubTypes: AllProductsSubType[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private httpService: HttpsService,
    private stateStore: Store<GlobalAppState>
  ) {}

  ngOnInit() {
    this.prodSubForm = this.formBuilder.group({
      productSubTypeName: ["", Validators.required],
    });

    this.getAllProdSub();
  }

  getAllProdSub() {
    this.httpService.getAllProdSubTypes().then(() => {
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProductsSubType) {
          this.allProdSubTypes = Object.keys(data.allProductsSubType).map(
            (key) => {
              return data.allProductsSubType[key];
            }
          );
          console.log(this.allProdSubTypes);
        }
      });
    });
    //trayendo desde el store el complemento de subtipos de productos , convirtiendolos
    //a a rray para luego asignarlos al variable allProdSubTypes
  }

  async createProdSub() {
    let renterId;
    await this.stateStore.select("authReducers").subscribe((data) => {
      renterId = data.dedToken.id;
    });
    const { productSubTypeName } = this.prodSubForm.value;
    this.httpService.createProdSubType(productSubTypeName, renterId);
  }

  closeCreateProdModal() {
    return this.modal.dismiss();
  }
}

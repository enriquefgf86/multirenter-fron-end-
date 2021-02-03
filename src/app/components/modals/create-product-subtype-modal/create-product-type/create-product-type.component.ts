import { LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { GlobalAppState } from 'src/app/globalReducer.reducer';
import { AllProductsType } from 'src/app/interfaces/interfaces.interface';
import { HttpsService } from 'src/app/services/https.service';

@Component({
  selector: 'app-create-product-type',
  templateUrl: './create-product-type.component.html',
  styleUrls: ['./create-product-type.component.scss'],
})
export class CreateProductTypeComponent implements OnInit {

  prodTypeForm: FormGroup;
  allProdTypes: AllProductsType[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private httpService: HttpsService,
    private stateStore: Store<GlobalAppState>,
    private loading:LoadingController
  ) {}

  ngOnInit() {
    this.prodTypeForm= this.formBuilder.group({
      productTypeName: ["", Validators.required],
    });

    this.getAllProdTypes();
  }

  getAllProdTypes() {
    this.httpService.getAllProdtypes().then(() => {
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProductsType) {
          this.allProdTypes = Object.keys(data.allProductsType).map(
            (key) => {
              return data.allProductsType[key];
            }
          );
          console.log(this.allProdTypes);
        }
      });
    });
    //trayendo desde el store el complemento de subtipos de productos , convirtiendolos
    //a a rray para luego asignarlos al variable allProdSubTypes
  }

  async createProdType() {
    let renterId;
    await this.stateStore.select("authReducers").subscribe((data) => {
      renterId = data.dedToken.id;
    });
    const { productTypeName } = this.prodTypeForm.value;
    this.httpService.createProdType(productTypeName, renterId);
  }

  closeCreateProdModal() {
    return this.modal.dismiss();
  }

}

import { CreateProductSubtypeComponent } from "./create-product-subtype/create-product-subtype.component";
import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CreateProductComponent } from "./create-product/create-product.component";

@Component({
  selector: "app-create-product-subtype-modal",
  templateUrl: "./create-product-subtype-modal.component.html",
  styleUrls: ["./create-product-subtype-modal.component.scss"],
})
export class CreateProductSubtypeModalComponent implements OnInit {
  
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  async createProduct() {
    const modal = await this.modalController.create({
      component: CreateProductComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //Abriendo modal de crear producto

  async createProductSubType() {
    const modal = await this.modalController.create({
      component: CreateProductSubtypeComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //abriendo modal de crear sub type de producto

  createProductType() {}

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }
  //fucnion que cierra los modales
}

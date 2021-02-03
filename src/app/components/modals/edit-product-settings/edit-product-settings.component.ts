import { EditProductTypeComponent } from './edit-product-type/edit-product-type.component';
import { Component, OnInit } from '@angular/core';
import { EditProductSubTypeComponent } from './edit-product-sub-type/edit-product-sub-type.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-product-settings',
  templateUrl: './edit-product-settings.component.html',
  styleUrls: ['./edit-product-settings.component.scss'],
})
export class EditProductSettingsComponent implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  async editProduct() {
    const modal = await this.modalController.create({
      component: EditProductComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //Abriendo modal de editar producto

  async editProductSubType() {
    const modal = await this.modalController.create({
      component: EditProductSubTypeComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //abriendo modal de editar sub type de producto

  async editProductType() {
    const modal = await this.modalController.create({
      component: EditProductTypeComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //abriendo modal de editar type de producto

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }
  //fucnion que cierra los modales

}

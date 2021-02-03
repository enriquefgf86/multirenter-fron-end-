import { CreateImageModalComponent } from "../components/modals/create-image-modal/create-image-modal.component";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms"; //imports
//ionic core
import { ModalController } from "@ionic/angular";
import { CreateProductSubtypeModalComponent } from "../components/modals/create-product-subtype-modal/create-product-subtype-modal.component";
import { EditProductSettingsComponent } from "../components/modals/edit-product-settings/edit-product-settings.component";

@Component({
  selector: "app-tab4",
  templateUrl: "./tab4.page.html",
  styleUrls: ["./tab4.page.scss"],
})
export class Tab4Page implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  async editImage() {
    const modal = await this.modalController.create({
      component: CreateImageModalComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //abriendo el modal que da paso a los menus de creacion de imagenes de subtipos
  //de productos

  async referingToProduct() {
    const modal = await this.modalController.create({
      component: CreateProductSubtypeModalComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //abriendo el modal que da paso a los menus de creacion  de producto

  async editProducts() {
    const modal = await this.modalController.create({
      component: EditProductSettingsComponent,
      cssClass: "my-custom-class",
    });
    return await modal.present();
  }
  //abriendo el modal que da paso a los menus de edicion de producto
}

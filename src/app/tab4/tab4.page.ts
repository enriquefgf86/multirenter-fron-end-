import { CreateImageModalComponent } from '../components/modals/create-image-modal/create-image-modal.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'; //imports
//ionic core
import { ModalController } from '@ionic/angular';
import { CreateProductSubtypeModalComponent } from '../components/modals/create-product-subtype-modal/create-product-subtype-modal.component';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async editImage() {
    const modal = await this.modalController.create({
      component: CreateImageModalComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

 async referingToProduct(){
    const modal = await this.modalController.create({
      component:CreateProductSubtypeModalComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();

  }

}

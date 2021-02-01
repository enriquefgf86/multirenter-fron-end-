import { CreateProductSubtypeComponent } from './../components/modals/create-product-subtype-modal/create-product-subtype/create-product-subtype.component';
import { CreateProductComponent } from './../components/modals/create-product-subtype-modal/create-product/create-product.component';
import { BrowserModule } from '@angular/platform-browser';
//pipes
import { PipeModule } from './../pipes/pipe.module';
//compoents
import { CreateImageModalComponent } from '../components/modals/create-image-modal/create-image-modal.component';
//angular core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//reactive forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//ionic core
import { IonicModule } from '@ionic/angular';
import { Tab4PageRoutingModule } from './tab4-routing.module';
import { Tab4Page } from './tab4.page';
import { CreateProductSubtypeModalComponent } from '../components/modals/create-product-subtype-modal/create-product-subtype-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    PipeModule,
   
  ],
  declarations: [Tab4Page,CreateImageModalComponent,CreateProductSubtypeModalComponent,CreateProductComponent,CreateProductSubtypeComponent]
})
export class Tab4PageModule {}

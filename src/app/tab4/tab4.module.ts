import { EditProductTypeSelectedComponent } from './../components/modals/edit-product-settings/edit-product-type/edit-product-type-selected/edit-product-type-selected.component';
import { EditProductTypeComponent } from "./../components/modals/edit-product-settings/edit-product-type/edit-product-type.component";
import { ProductSelectedComponent } from "./../components/modals/edit-product-settings/edit-product/product-selected/product-selected.component";
import { EditProductSettingsComponent } from "./../components/modals/edit-product-settings/edit-product-settings.component";
import { CreateProductSubtypeComponent } from "./../components/modals/create-product-subtype-modal/create-product-subtype/create-product-subtype.component";
import { CreateProductComponent } from "./../components/modals/create-product-subtype-modal/create-product/create-product.component";
import { BrowserModule } from "@angular/platform-browser";
//pipes
import { PipeModule } from "./../pipes/pipe.module";
//compoents
import { CreateImageModalComponent } from "../components/modals/create-image-modal/create-image-modal.component";
//angular core
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
//reactive forms
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//ionic core
import { IonicModule } from "@ionic/angular";
import { Tab4PageRoutingModule } from "./tab4-routing.module";
import { Tab4Page } from "./tab4.page";
import { CreateProductSubtypeModalComponent } from "../components/modals/create-product-subtype-modal/create-product-subtype-modal.component";
import { CreateProductTypeComponent } from "../components/modals/create-product-subtype-modal/create-product-type/create-product-type.component";
import { EditProductComponent } from "../components/modals/edit-product-settings/edit-product/edit-product.component";
import { EditProductSubTypeComponent } from "../components/modals/edit-product-settings/edit-product-sub-type/edit-product-sub-type.component";
import { ProductSubtypeSelectedComponent } from "../components/modals/edit-product-settings/edit-product-sub-type/product-subtype-selected/product-subtype-selected.component";
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    PipeModule,
    ComponentsModule
  ],
  declarations: [
    Tab4Page,
    // CreateImageModalComponent,
    // CreateProductTypeComponent,
    // EditProductSettingsComponent,
    // ProductSelectedComponent,
    // EditProductSubTypeComponent,
    // EditProductTypeComponent,
    // CreateProductSubtypeModalComponent,
    // CreateProductComponent,
    // CreateProductSubtypeComponent,
    // EditProductComponent,
    // ProductSubtypeSelectedComponent,
    // EditProductTypeSelectedComponent
  ],
})
export class Tab4PageModule {}

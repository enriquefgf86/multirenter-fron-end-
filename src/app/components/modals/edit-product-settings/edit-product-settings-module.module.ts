import { ProductSubtypeSelectedComponent } from "./edit-product-sub-type/product-subtype-selected/product-subtype-selected.component";
import { EditProductTypeComponent } from "./edit-product-type/edit-product-type.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "src/app/pipes/pipe.module";
import { EditProductSubTypeComponent } from "./edit-product-sub-type/edit-product-sub-type.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { EditProductSettingsComponent } from "./edit-product-settings.component";
import { EditProductTypeSelectedComponent } from "./edit-product-type/edit-product-type-selected/edit-product-type-selected.component";
import { ProductSelectedComponent } from "./edit-product/product-selected/product-selected.component";

@NgModule({
  declarations: [
    EditProductComponent,
    EditProductTypeComponent,
    EditProductSubTypeComponent,
    EditProductTypeSelectedComponent,
    EditProductSettingsComponent,
    ProductSubtypeSelectedComponent,
    ProductSelectedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
  ],
})
export class EditProductSettingsModuleModule {}

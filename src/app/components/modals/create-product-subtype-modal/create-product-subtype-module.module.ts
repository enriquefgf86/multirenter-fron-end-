import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "src/app/pipes/pipe.module";
import { CreateProductComponent } from "./create-product/create-product.component";
import { CreateProductSubtypeComponent } from "./create-product-subtype/create-product-subtype.component";
import { CreateProductTypeComponent } from "./create-product-type/create-product-type.component";
import { CreateProductSubtypeModalComponent } from "./create-product-subtype-modal.component";

@NgModule({
  declarations: [
    CreateProductComponent,
    CreateProductSubtypeComponent,
    CreateProductTypeComponent,
    CreateProductSubtypeModalComponent,
  
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
  ],
})
export class CreateProductSubtypeModuleModule {}

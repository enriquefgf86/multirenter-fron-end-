import { CreateProductSubtypeModuleModule } from "./create-product-subtype-modal/create-product-subtype-module.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "src/app/pipes/pipe.module";
import { EditProductSettingsModuleModule } from "./edit-product-settings/edit-product-settings-module.module";
import { CreateImageModuleModule } from "./create-image-modal/create-image-module.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
    EditProductSettingsModuleModule,
    CreateImageModuleModule,
    CreateProductSubtypeModuleModule,
  ],
})
export class ModalsModuleModule {}

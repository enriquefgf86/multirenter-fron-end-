import { RentSelectedModalModuleModule } from "./rent-selected-modal/rent-selected-modal-module.module";
import { ProductViewModuleModule } from "./product-view/product-view-module.module";
import { DeleteUserSettingsComponent } from "./delete-user-settings/delete-user-settings.component";
import { EditImageSettingsModuleModule } from "./edit-image-settings/edit-image-settings-module.module";
import { CreateProductSubtypeModuleModule } from "./create-product-subtype-modal/create-product-subtype-module.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "src/app/pipes/pipe.module";
import { EditProductSettingsModuleModule } from "./edit-product-settings/edit-product-settings-module.module";
import { CreateImageModuleModule } from "./create-image-modal/create-image-module.module";
import { DeleteUserSettingsModuleModule } from "./delete-user-settings/delete-user-settings-module.module";
import { AllRentsClosedModalModuleModule } from "./all-rents-closed-modal/all-rents-closed-modal-module.module";
import { AllRentsModalModuleModule } from "./all-rents-modal/all-rents-modal-module.module";

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
    EditImageSettingsModuleModule,
    DeleteUserSettingsModuleModule,
    ProductViewModuleModule,
    AllRentsClosedModalModuleModule,
    AllRentsModalModuleModule,
    RentSelectedModalModuleModule,
  ],
})
export class ModalsModuleModule {}

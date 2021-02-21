import { PipeTitleFormatPipe } from './../../../pipes/pipe-title-format.pipe';
import { EditImageSelectedComponent } from './edit-image-selected/edit-image-selected.component';
import { EditImageSettingsComponent } from "./edit-image-settings.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "src/app/pipes/pipe.module";

@NgModule({
  declarations: [EditImageSettingsComponent,EditImageSelectedComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
    // PipeTitleFormatPipe
  ],
})
export class EditImageSettingsModuleModule {}

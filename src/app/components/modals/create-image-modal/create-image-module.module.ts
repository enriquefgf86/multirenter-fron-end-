import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { CreateImageModalComponent } from './create-image-modal.component';



@NgModule({
  declarations: [CreateImageModalComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule, IonicModule, PipeModule
  ]
})
export class CreateImageModuleModule { }

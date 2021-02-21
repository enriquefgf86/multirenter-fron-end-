import { AllRentsModalComponent } from './all-rents-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/pipes/pipe.module';



@NgModule({
  declarations: [AllRentsModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
  ]
})
export class AllRentsModalModuleModule { }

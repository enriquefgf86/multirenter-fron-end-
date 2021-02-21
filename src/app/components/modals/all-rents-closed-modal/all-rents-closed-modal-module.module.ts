import { CloseRentDetailComponent } from './close-rent-detail/close-rent-detail.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { AllRentsClosedModalComponent } from './all-rents-closed-modal.component';



@NgModule({
  declarations: [AllRentsClosedModalComponent,CloseRentDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
  ]
})
export class AllRentsClosedModalModuleModule { }

import { CardPaymentDevolutionComponent } from './card-payment-devolution/card-payment-devolution.component';
import { RentSelectedModalComponent } from './rent-selected-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment.prod';



@NgModule({
  declarations: [RentSelectedModalComponent,CardPaymentDevolutionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
    NgxStripeModule.forRoot(environment.stripeApiKeyPublic),
    
  ]
})
export class RentSelectedModalModuleModule { }

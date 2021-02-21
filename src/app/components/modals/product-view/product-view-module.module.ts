import { CardPaymentComponent } from './product-popover-rent-product/card-payment/card-payment.component';
import { ProductPopoverRentProductComponent } from './product-popover-rent-product/product-popover-rent-product.component';
import { ProductPopoverCommentsComponent } from './product-popover-comments/product-popover-comments.component';
import { ProductViewComponent } from "./product-view.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "src/app/pipes/pipe.module";
import { ChartsModule } from 'ng2-charts';
import {MatStepperModule} from '@angular/material/stepper'
import {MatFormFieldModule} from '@angular/material/form-field'
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment.prod';


@NgModule({
  declarations: [
    ProductViewComponent,
    ProductPopoverCommentsComponent,
    ProductPopoverRentProductComponent,
    CardPaymentComponent,
  ],
  imports: [CommonModule,FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PipeModule,
    ChartsModule,
    MatStepperModule,
    MatFormFieldModule,
    NgxStripeModule.forRoot(environment.stripeApiKeyPublic),
   ],
})
export class ProductViewModuleModule {}

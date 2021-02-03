import { ModalsModuleModule } from './modals/modals-module.module';
import { ProductCardComponent } from './product-card/product-card.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AllProductsCardsComponent } from './all-products-cards/all-products-cards.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PipeModule } from "../pipes/pipe.module";

@NgModule({
  declarations: [AllProductsCardsComponent,LoginComponent,SignupComponent,ProductCardComponent],
  imports: [CommonModule,FormsModule, ReactiveFormsModule, IonicModule, PipeModule,ModalsModuleModule],
})
export class ComponentsModule {}

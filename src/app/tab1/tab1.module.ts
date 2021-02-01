//Pipe de imagen se importa aqui tambien pues uno de los componentes
//del page (all-Products requiere de dicho pipe)
import { PipeModule } from "./../pipes/pipe.module";
//componente
import { AllProductsCardsComponent } from "./../components/all-products-cards/all-products-cards.component";
import { ProductCardComponent } from "./../components/product-card/product-card.component";
//ionic core
import { IonicModule } from "@ionic/angular";
//angular core
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
//reactive forms
import { FormsModule } from "@angular/forms";
//page
import { Tab1Page } from "./tab1.page";

import { Tab1PageRoutingModule } from "./tab1-routing.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    PipeModule,
  ],
  declarations: [Tab1Page, ProductCardComponent, AllProductsCardsComponent],
})
export class Tab1PageModule {}

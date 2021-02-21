import { CardPaymentComponent } from './card-payment/card-payment.component';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalController,
  LoadingController,
  PopoverController,
} from "@ionic/angular";
import { Store } from "@ngrx/store";
import { StripeCardElementOptions, StripeElementsOptions } from "@stripe/stripe-js";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { Product } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";
@Component({
  selector: "app-product-popover-rent-product",
  templateUrl: "./product-popover-rent-product.component.html",
  styleUrls: ["./product-popover-rent-product.component.scss"],
})
export class ProductPopoverRentProductComponent implements OnInit {
  @Input("prodId") prodId;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  rentForm: FormGroup;
  productSelected: Product;
  renterId: number;
  renterEmail:string;
  renterName:string;
  data = {
    input1: null,
    daysOfRentCost: null,
  };

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
 
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
 
  elementsOptions: StripeElementsOptions = {
    locale: 'es'
  };
 

  stripeTest: FormGroup;

  constructor(
    private stateStore: Store<GlobalAppState>,
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController,
    private pop: PopoverController,
    private formBuilder: FormBuilder,
    private stripeService: StripeService

    
  ) {}

  ngOnInit() {
    if (this.prodId) {
      console.log(this.prodId);

      this.productForRent();
    }

    this.gettingUserAuth();

   

    this.rentForm = this.formBuilder.group({
      rentDays: ["", Validators.required],
      cost: ["", Validators.required],
    });
  }

  productForRent() {
    this.stateStore.select("prodReducers").subscribe((data) => {
      if (data.productSelectedId) {
        console.log(data.productSelectedId);
        this.productSelected = data.productSelectedId;
      }
    });

  }

  changeInput() {
    // if(this.productSelected.product_price_per_day){
    this.data.daysOfRentCost =
      this.data.input1 * this.productSelected.product_price_per_day;

    console.log(this.data.daysOfRentCost);

    // }
  }

  rentProduct() {
    // const { rentDays, cost } = this.rentForm.value;
    // console.log(this.rentForm.value);
    // if (this.renterId && this.prodId) {
    //   this.httpService.rentingProduct(rentDays, this.prodId, this.renterId);
    // } else return;
    this.goingToCardPayment()
  }

  cancelClose() {
    return this.pop.dismiss()
  }
  //cerrando modal

  gettingUserAuth() {
    this.stateStore.select("authReducers").subscribe((data) => {
      this.renterId = data.dedToken.id;
      this.renterEmail= data.dedToken.renterEmail
      this.renterName= data.dedToken.renterName
    });
  }
  //obteniendo el usuario autenticado del redux y asignandolo a la variable 
  //renterId, aunque en este componente su uso no es necesario

  selectChange(event){
    console.log(event);
    
  }

  async goingToCardPayment() {
    let prodId=await this.prodId;
    let renterEmail= this.renterEmail;
    let renterName= this.renterName;
    const { rentDays, cost } =await this.rentForm.value;
    const popover = await this.pop.create({
      component: CardPaymentComponent,
      componentProps: {
       prodId,rentDays,cost,renterEmail,renterName
      },
      cssClass: "my-custom-class",
      translucent: true,
    });
    return await popover.present();
  }
  //metodo que triggeriza el popover correspodiente al componente que se quiera ostrar en este caso seria
  //ProductViewComponent, pasandosele como propiedad el id del producto que se quiere mostrar
  //enm este caso mediante acceso a props , y la variable prodId

  
}

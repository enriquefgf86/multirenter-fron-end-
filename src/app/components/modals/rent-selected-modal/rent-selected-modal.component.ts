import { CardPaymentDevolutionComponent } from "./card-payment-devolution/card-payment-devolution.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  ModalController,
  LoadingController,
  PopoverController,
} from "@ionic/angular";
import { Store } from "@ngrx/store";
import { HttpsService } from "src/app/services/https.service";
import { Product, RenterRents } from "src/app/interfaces/interfaces.interface";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js";

@Component({
  selector: "app-rent-selected-modal",
  templateUrl: "./rent-selected-modal.component.html",
  styleUrls: ["./rent-selected-modal.component.scss"],
})
export class RentSelectedModalComponent implements OnInit {
  @Input("rentId") rentId;
  rentDevolutionForm: FormGroup;
  renterId: number;
  renterEmail: string;
  renterName: string;
  prodInRent: Product;
  rentSelected: RenterRents;

  data = {
    realDays: null,
    rentDays: null,
    rentCostDelay: null,
    rentCost: null,
    rentTotalCost: null,
    rentExcedentDays: null,
  };

  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: "300",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };

  elementsOptions: StripeElementsOptions = {
    locale: "es",
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

  async ngOnInit() {
    console.log(this.rentId);
    this.rentDevolutionForm = this.formBuilder.group({
      rentDays: ["", Validators.required],
      rentRealDays: ["", Validators.required],
      costRent: ["", Validators.required],
      costDelay: ["", Validators.required],
      totalCost: ["", Validators.required],
    });
    //iniciando el cosntructor

    // this.stripeTest=this.formBuilder.group({
    //  currentName: ['', [Validators.required]]
    // })

    await this.stateStore.select("authReducers").subscribe((data) => {
      this.renterId = data.dedToken.id;
      this.renterEmail = data.dedToken.renterEmail;
      this.renterName = data.dedToken.renterName;
    });
    //sacando el user id del redux a traves del token decodificado guardado
    //asi como su email y name para pasarlo como input al hijo carddevolution component

    this.httpService.findRentById(this.rentId, this.renterId).then(() => {
      this.stateStore.select("prodReducers").subscribe((data) => {
        this.prodInRent = data.productSelectedId;
        console.log(this.prodInRent);
      });

      this.stateStore.select("renterReducers").subscribe((data) => {
        this.rentSelected = data.rentIdSelected.rent_selected;
        console.log(this.rentSelected);
      });
    });
    //trayendo el producto que corresponde a la renta, asi como la renta en cuestion
  }

  changeInput(event) {
    const {
      rentDays,
      rentRealDays,
      costRent,
      costDelay,
      totalCost,
    } = this.rentDevolutionForm.value;
    if (this.rentSelected) {
      this.data.rentDays = this.rentSelected.rent_days;

      if (rentRealDays <= this.data.rentDays) {
        this.data.rentExcedentDays = 0;
        this.data.rentCostDelay = 0;
      } else {
        this.data.rentExcedentDays = rentRealDays - this.data.rentDays;
        this.data.rentCostDelay =
          this.data.rentExcedentDays * this.prodInRent.product_price_per_day +
          this.data.rentExcedentDays *
            this.prodInRent.product_fee_per_day_delayed;
        console.log("csto delay: " + this.data.rentCostDelay);
      }

      console.log("dias excedentes: " + this.data.rentExcedentDays);

      this.data.rentCost =
        this.data.rentDays * this.prodInRent.product_price_per_day;
      console.log("csto renta: " + this.data.rentCost);
      this.data.rentTotalCost = this.data.rentCost + this.data.rentCostDelay;
    }
  }
  //proceso de modificacion de inputs en los tags de html modificandose cada uno
  //de ellos trendiendo en cuenta el item del form rentRealDays

  cancelClose() {
    return this.pop.dismiss();
  }
  //cetrrando el pop up

  rentDevolutionProduct() {
    // const {
    //   rentDays,
    //   rentRealDays,
    //   costRent,
    //   costDelay,
    //   totalCost,
    // } = this.rentDevolutionForm.value;

    // if (this.rentId && this.prodInRent.id && this.renterId) {
    //   this.httpService.devolutionrentByid(
    //     rentRealDays,
    //     this.rentId,
    //     this.prodInRent.id,
    //     this.renterId
    //   );
    // }else return;
    this.goingToCardPaymentDevolution();
  }
  //proceso de redireccion al componente en donde se procederia a pagar  el proceso de
  //devolucion

  // payRent(): void {
  //   const{name}=this.stripeTest.value;
  //   this.stripeService
  //     .createToken(this.card.element, { name})
  //     .subscribe((result) => {
  //       if (result.token) {
  //         // Use the token
  //         console.log(result.token.id);
  //       } else if (result.error) {
  //         // Error creating the token
  //         console.log(result.error.message);
  //       }
  //     });
  // }

  async goingToCardPaymentDevolution() {
    let rentId = await this.rentId;
    let renterId = await this.renterId;
    let renterEmail = this.renterEmail;
    let renterName = this.renterName;
    const {
      rentDays,
      rentRealDays,
      costRent,
      costDelay,
      totalCost,
    } = this.rentDevolutionForm.value;
    const popover = await this.pop.create({
      component: CardPaymentDevolutionComponent,
      componentProps: {
        rentId,
        rentDays,
        rentRealDays,
        costRent,
        costDelay,
        totalCost,
        renterId,
        renterEmail,
        renterName,
      },
      cssClass: "my-custom-class",
      translucent: true,
    });
    return await popover.present();
  }
  //metodo que triggeriza el popover correspodiente al componente que se quiera ostrar en este caso seria
  //CardPaymentDevolutionComponent, pasandosele como propiedades varios parametros previamente
  //inicializados y que serian de uso en el card correspondiente: rentId,rentDays,rentRealDays,
  //costRent,costDelay,totalCost,renterId,renterEmail,renterName
}

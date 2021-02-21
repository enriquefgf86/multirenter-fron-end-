import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalController,
  LoadingController,
  PopoverController,
} from "@ionic/angular";
import { Store } from "@ngrx/store";
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { StripeCardComponent, StripeService } from "ngx-stripe";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { PaymentIntent } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-card-payment",
  templateUrl: "./card-payment.component.html",
  styleUrls: ["./card-payment.component.scss"],
})
export class CardPaymentComponent implements OnInit {
  @Input("prodId") prodId;
  @Input("cost") cost;
  @Input("rentDays") rentDays;
  @Input("renterEmail") renterEmail;
  @Input("renterName") renterName;
  //Trayendose los props del modal padre de product popover for rent

  @ViewChild(StripeCardComponent) card: StripeCardComponent; //propio de stripe

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
  }; //propio de stripe

  elementsOptions: StripeElementsOptions = {
    locale: "es",
  }; //propio de stripe estableciendo idioma

  stripeTest: FormGroup; //form de stripe

  renterId: number;

  paymentConfirmId: string;

  constructor(
    private stateStore: Store<GlobalAppState>,
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController,
    private pop: PopoverController,
    private formBuilder: FormBuilder,
    private stripeService: StripeService //propio de stripe
  ) {}

  ngOnInit() {
    if (this.cost) {
      console.log(this.cost);
    }

    if (this.prodId) {
      console.log(this.prodId);
    }
    if (this.rentDays) {
      console.log(this.rentDays);
    }
    //imprimiendo los datos transferidos desde el component padre a traves de los 
    //inputs

    this.stripeTest = this.formBuilder.group({
      name: ["", [Validators.required]],
    }); 
    //inicializando el form en stripe propio del API de dicha libreria 

    this.gettingUserAuth();
  }

  gettingUserAuth() {
    this.stateStore.select("authReducers").subscribe((data) => {
      this.renterId = data.dedToken.id;
    });
  }
  //getting el usuario id para la triggerizacion de la renta asignadosele 
  //a la variable renterId

  payRent(): void {
    let description = `Rent referring to productof id ${this.prodId}`;
    let amount = this.cost;
    const { name } = this.stripeTest.value;
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe((result) => {
        if (result.token) {
          //si el proceso de obtener el token de Stripe es correcto se procederia a pasar el
          //objeto que define el servicio de PaymentIntent

          this.paymentIntentOperation(description,amount);
          //llamdo la funcion previamente creada paymentIntentOperation la cual a su vez
          //llamraia del servico a la fucnion correspondiente a la ejecucion del endpoint
          //que triggeriza el intento de pago  de stripe mediante fucnion paymentIntentFunction
          //la cual como parametros tendria una descripcion (description) y un monto de pago(amount)
         //previamente triggerizados desde el back como elementos de stripe

          // Use the token
          console.log(result.token.id);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }
  //generando el token en sttripe

  async paymentIntentOperation(description:string,amount) {
    if (this.renterId && this.prodId) {
      await this.httpService
        .paymentIntentFunction(this.renterName,this.renterEmail,description,amount)
        .then((result: any) => {
          if (result) {
            this.paymentConfirmId = result.id;
            console.log(this.paymentConfirmId);
          }
        });
      //ejecutando el serviccio de payment intent , y de ser exitoso asiganar el
      //id generado por el intento  a la variable this.paymentConfirmId

      this.httpService.rentingProduct(
        this.rentDays,
        this.prodId,
        this.renterId
      );
      //ejecutando la instauracion de la renta convencional en la base de datos
      //mediante servicoo rentingProduct

      this.cancelClose()
    } else return;
  }
  //metodo que triggeriza la ejecucion de la renta en si , asi como el intento de pago
  //en stripe , de ahi que previo condicion de existencia de prodId y renterId
  //se proceda primero a triggerizar el endpoint de paymentIntentFucntion y luego
  //el de rentingproduct en el httpServices respectivamente.
  //Este metodo despues seria usado en el metodo payRent

  cancelClose() {
    return this.pop.dismiss()
  }
  //cerrando modal
}

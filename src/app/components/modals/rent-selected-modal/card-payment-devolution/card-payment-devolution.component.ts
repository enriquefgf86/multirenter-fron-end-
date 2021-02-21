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
import { Product, RenterRents } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-card-payment-devolution",
  templateUrl: "./card-payment-devolution.component.html",
  styleUrls: ["./card-payment-devolution.component.scss"],
})
export class CardPaymentDevolutionComponent implements OnInit {
  @Input("rentDays") rentDays;
  @Input("rentRealDays") rentRealDays;
  @Input("costRent") costRent;
  @Input("costDelay") costDelay;
  @Input("totalCost") totalCost;
  @Input("rentId") rentId;
  @Input("renterId") renterId;
  @Input("renterEmail") renterEmail
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
  // renterId: any;
  paymentDevolutionConfirmId: string;
  prodInRent: Product;
  rentSelected: RenterRents;

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
    if(this.rentId){
      console.log(this.rentDays);
      console.log(this.rentRealDays);
      console.log(this.costDelay);
      console.log(this.costRent);
      console.log(this.costDelay);
      console.log(this.totalCost);
    }
    //imprimiendo los datos transferidos desde el component padre a traves de los
    //inputs

    this.stripeTest = this.formBuilder.group({
      name: ["", [Validators.required]],
    });
    //inicializando el form en stripe propio del API de dicha libreria

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

    this.gettingUserAuth();
  }

  gettingUserAuth() {
    this.stateStore.select("authReducers").subscribe((data) => {
      this.renterId = data.dedToken.id;
      console.log(this.renterId);
    });
  }
  //getting el usuario id para la triggerizacion de la renta asignadosele
  //a la variable renterId

  payDevolutionDelay(): void {
    let description = `Devolution referring to rent of id ${this.rentId} `;
    let amount = this.costDelay;
    const { name } = this.stripeTest.value;
    if (this.rentDays < this.rentRealDays) {
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe((result) => {
        if (result.token) {
          //si el proceso de obtener el token de Stripe es correcto se procederia a pasar el
          //objeto que define el servicio de PaymentIntent

          this.paymentIntentDevolutionOperation(description, amount);
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
    else this.paymentIntentDevolutionOperation(description, amount);
  }
  //Metodo encargado de general el token en stripe de la operacion en cuastion 
  //ademas de establecer el pago de la devolucion(en caso de que haya exceso )
  //en stripe , ademas de la operacion como tal para la actulaizacion en a base de datos 

  async paymentIntentDevolutionOperation(description: string, amount) {
    if (this.rentId && this.prodInRent.id && this.renterId) {
      if (this.rentDays < this.rentRealDays) {
        await this.httpService
          .paymentIntentFunction(this.renterName,this.renterEmail,description, amount)
          .then((result: any) => {
            console.log(result);
            
            if (result) {
              this.paymentDevolutionConfirmId =JSON.parse( result);
              console.log(this.paymentDevolutionConfirmId);
            }
          });
        //ejecutando el serviccio de payment intent para las devoluciones que tengan  cargo
        //, de ahi que se establezca una condicion  que establezca que los dias reales
        //son mayores que lo pactado por rentar , y de ser exitoso asignar el
        //id generado por el intento  a la variable this.paymentConfirmId. Vease que en 
        //caso de la devolucion se pasan variaos  parametros aparte del description 
        //y el amount necesarios para la operacion de paymentIntent de Stripe en su body
        //se adicionan los items renterName, y this renterEmail, los cuales serian 
        //necesarios para el confirm de la operacion de conjunto con el paymentIntentId que 
        //se genere , el cual se obtendria como resultado del result de la promesa parseado 
        //JSON.parse( result), el cual se le asigana a la variable paymentDevolutionConfirmId
        //como un objeto en general , al cual se le accederia a uno de sus items(id)
      }
      if (this.rentId && this.prodInRent.id && this.renterId) {
        this.httpService.devolutionrentByid(
          this.rentRealDays,
          this.rentId,
          this.prodInRent.id,
          this.renterId
        );

        //ejecutando la instauracion de la renta convencional en la base de datos
        //mediante servicoo rentingProduct
      }

      this.cancelClose();//cerrandpo el modal 
    } else return;
  }
  //metodo que triggeriza la ejecucion de la renta en si , asi como el intento de pago
  //en stripe , de ahi que previo condicion de existencia de prodId y renterId
  //se proceda primero a triggerizar el endpoint de paymentIntentFucntion y luego
  //el de rentingproduct en el httpServices respectivamente.
  //Este metodo despues seria usado en el metodo payRent

  cancelClose() {
    return this.pop.dismiss();
  }
  //cerrando modal
}

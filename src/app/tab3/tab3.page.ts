import { ModalController } from "@ionic/angular";
import {
  renterRentRoot,
  RenterRents,
  tokengenerated,
  url,
} from "./../interfaces/interfaces.interface";
import { StorageService } from "./../services/storage.service";
import { Component, OnInit } from "@angular/core";
import { HttpsService } from "../services/https.service";
import { GlobalAppState } from "../globalReducer.reducer";
import { Store } from "@ngrx/store";
import { AllRentsModalComponent } from "../components/modals/all-rents-modal/all-rents-modal.component";
import { AllRentsClosedModalComponent } from "../components/modals/all-rents-closed-modal/all-rents-closed-modal.component";
import * as actionsAuth from "../components/authAction.action";
import * as actionsProd from "../components/productAction.action";
import * as actionsRenter from "../components/renterAction.action";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  renterId: number;
  renterIdRents: renterRentRoot;
  rentedOnProcess: RenterRents[] = [];
  rentedOnClose: RenterRents[] = [];
  imageDefault:boolean=false
  image:url;
  renterName:string
  constructor(
    private storageService: StorageService,
    private httpService: HttpsService,
    private stateStore: Store<GlobalAppState>,
    private modal: ModalController
  ) {}

  async ngOnInit() {
    await this.gettingUserRenting();
    this.stateStore.select("authReducers").subscribe(async (data) => {
      if (data == (await null) || data == (await undefined)) {
        this.imageDefault = true;
        return;
      }

      if (data.dedToken == (await null) || data.dedToken == (await undefined)) {
        return;
      }

      if (data.setImageRenter == null) {
        this.imageDefault = true;
        console.log(this.imageDefault);
      }

      this.image = data.setImageRenter;

      this.renterName = data.dedToken.renterName;
    });


    if (this.renterId) {
      await this.httpService.findRenterById(this.renterId);

      await this.stateStore.select("renterReducers").subscribe((data) => {
        if (data.renter) {
          this.renterIdRents = data.renter;
        }
      });
      this.rentsEndedSelector();
      console.log(this.renterIdRents);
    }
  }

  gettingUserRenting() {
    this.stateStore.select("authReducers").subscribe(async (data) => {
      if (data.dedToken.id) {
        this.renterId = await data.dedToken.id;
      }
      else return 
    });
  }
  //metodo que obtiene el usuario autenticado y se lo asigana a la variable renter id

  // async gettingRentsOfUser() {
  //   if (this.renterId) {
  //     await this.httpService.findRenterById(this.renterId);

  //     await this.stateStore.select("renterReducers").subscribe((data) => {
  //       if (data.renter) {
  //         this.renterIdRents = data.renter;
  //       }
  //     })
  //     this.rentsEndedSelector();
  //     console.log(this.renterIdRents);
  //   }
  // }
  // //Metodo que obtiniene el listado de rentas para el usuario seleccionado
  // //accedioendose al redux en donde se almacena dicha data

  async rentsEndedSelector() {
    let rented: string = await "This rent still is active";
    let notRented: string = await "Closed";
    let rentRents=await this.renterIdRents.renter_rents
    let rentRents1=[...rentRents];
    console.log(rentRents);
    this.rentedOnClose=[];
    this.rentedOnProcess=[];

    
    if (rentRents1) {
      for(var index=0;index<rentRents1.length;index++){
        if (rentRents1[index].rent_closed == notRented) {
          this.rentedOnClose.push({ ...rentRents1[index] });
        }
        if (rentRents1[index].rent_closed == rented) {
          this.rentedOnProcess.push({ ...rentRents1[index] });
        }
      }
      // rentRents1.forEach((data) => {
      //   // data={...data};
        
      //   if (data.rent_closed == notRented) {
      //     this.rentedOnClose.push({ ...data });
      //   }
      //   if (data.rent_closed == rented) {
      //     this.rentedOnProcess.push({ ...data });
      //   }
      // });
      this.stateStore.dispatch(
        actionsRenter.setARentClosed({ closedRents: this.rentedOnClose })
      );
      this.stateStore.dispatch(
        actionsRenter.setARentOnProcess({ activeRents: this.rentedOnProcess })
      );

      console.log(this.rentedOnProcess);
      console.log(this.rentedOnClose);
    }
    else return
  }
  //metodo que clasifica las rentas en terminadas y no terminadas por parte del usuario
  //seleccionado , asignadonsele segun el tipo a dos tipos de variables

  seeRentsInprocess() {
    this.rentsEndedSelector();
    console.log(this.rentedOnProcess);

    if (this.rentedOnProcess) {
      this.goingToModal(AllRentsModalComponent);
    }
  }

 async seeAllRents() {
  await   this.rentsEndedSelector();
  console.log(this.rentedOnClose);
    if(this.rentedOnClose){
      this.goingToModal(AllRentsClosedModalComponent);
    }
  }

  async goingToModal(component) {
    const popover = await this.modal.create({
      component: component,
      cssClass: "my-custom-class",
    });
    return await popover.present();
  }
  //metodo que triggeriza el popover correspodiente al componente que se quiera ostrar en este caso seria
  //ProductViewComponent, pasandosele como propiedad el id del producto que se quiere mostrar
  //enm este caso mediante acceso a props , y la variable prodId
}

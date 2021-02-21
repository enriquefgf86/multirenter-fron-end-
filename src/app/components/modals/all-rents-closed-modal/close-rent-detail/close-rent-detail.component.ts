import { RenterRents } from "./../../../../interfaces/interfaces.interface";
import { Component, Input, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ModalController, LoadingController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { Product } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-close-rent-detail",
  templateUrl: "./close-rent-detail.component.html",
  styleUrls: ["./close-rent-detail.component.scss"],
})
export class CloseRentDetailComponent implements OnInit {
  @Input("rentId") rentId;
  renterId: number;
  product: Product;
  rentSelected: RenterRents;

  constructor(
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    await this.authRenter();
    if (this.rentId && this.renterId) {
     await  this.httpService
        .findRentById(this.rentId, this.renterId)
        
        this.stateStore.select("prodReducers").subscribe((prod) => {
          if (prod) {
            this.product = prod.productSelectedId;
          }
        });

        this.stateStore.select("renterReducers").subscribe((rent) => {
          if (rent) {
            this.rentSelected = rent.rentIdSelected.rent_selected;
          }
        });
    }
    // this.gettingRent();
  }
  authRenter() {
    this.stateStore.select("authReducers").subscribe((renter) => {
      this.renterId = renter.dedToken.id;
    });
  }

}

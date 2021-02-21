import {
  ListofProduct,
  RootResponse,
  tokengenerated,
} from "./../interfaces/interfaces.interface";
import { HttpsService } from "./../services/https.service";
import { StorageService } from "./../services/storage.service";
import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { GlobalAppState } from "../globalReducer.reducer";
import { Store } from "@ngrx/store";
import { url } from "../interfaces/interfaces.interface";
import { map } from "rxjs/operators";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  image: url;
  renterName: string;
  imageDefault: boolean = false;

  allProducts: ListofProduct[] = [];

  constructor(
    private storage: Storage,
    private storageService: StorageService,
    private stateStore: Store<GlobalAppState>,
    private httpServices: HttpsService
  ) {}

  ngOnInit(): void {
    this.storageService.getTokenInStorage()
    .then((data) => {
      // console.log(data);

      this.httpServices.userIsauthenticated().subscribe((result) => {
        // console.log(result);
      });
    });

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

    this.httpServices.getAllProducts();

    this.httpServices.getAllProdtypes();

    this.httpServices.getAllProdSubTypes();

    this.httpServices.getAllimgSubTypes();
  }

 
}

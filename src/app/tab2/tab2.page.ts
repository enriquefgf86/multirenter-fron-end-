import { Storage } from "@ionic/storage";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "../globalReducer.reducer";
import { tokengenerated } from "../interfaces/interfaces.interface";
import { HttpsService } from "../services/https.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page implements OnInit {
  token: string;

  constructor(
    private httpServices: HttpsService,
    private tokenStorage: Storage,
    private statusStore: Store<GlobalAppState>
  ) {}

  async ngOnInit() {
    this.tokenStorage.get("token").then((data: tokengenerated) => {
      if (data==null||data==undefined) {
        return ;
      }
      this.token = data.access_token;
      console.log(this.token);
      let decodedJson = jwt_decode(data.access_token);
      console.log(decodedJson);
      //establecidno variable con decodificador de json para su uso
    });

    await this.statusStore.select("authReducers").subscribe(async (data) => {
      if (data.token == undefined || data.token == null) {
        return;
      }
      this.token = await data.token.access_token;
    });
    console.log(this.token);
  }

  async logOut() {
    console.log(this.token.toString());
    let token = await this.token;
    await console.log(token);

    (await this.httpServices.logOutUser())
  } //log out user
}

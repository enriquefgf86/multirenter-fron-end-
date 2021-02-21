import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, Input, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { HttpsService } from "src/app/services/https.service";
import { AllRenter } from "src/app/interfaces/interfaces.interface";

@Component({
  selector: "app-delete-user-selected",
  templateUrl: "./delete-user-selected.component.html",
  styleUrls: ["./delete-user-selected.component.scss"],
})
export class DeleteUserSelectedComponent implements OnInit {
  deleteUserForm: FormGroup;
  userSelected: AllRenter[] = [];
  @Input("userId") userId;
  constructor(
    private httpService: HttpsService,
    private modalController: ModalController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage
  ) {}

  ngOnInit() {
    this.userSelectedProcess();
  }

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }

  async deleteUserSelected() {
    let adminId;
    await this.stateStore.select("authReducers").subscribe((data) => {
      adminId = data.dedToken.id;
    });
    //obteneindose el usuario que se supone sea el administrador para borrar
    //otro usuario

    if (
      this.userSelected.length > 0 &&
      this.userSelected[0].renterId != adminId
    ) {
      this.httpService.deleteUser(adminId, this.userId);
    }
  }

  async userSelectedProcess() {
    let allUsers: AllRenter[];
    await this.httpService.getAllRenters();
    await this.stateStore.select("renterReducers").subscribe(async (data) => {
      if (data.renterArray) {
        allUsers = await Object.keys(data.renterArray).map((key) => {
          return data.renterArray[key];
        });
      }
      //trayrendo todos los renters

      this.userSelected = allUsers.filter(
        (data) => data.renterId === this.userId
      );
      //filtrando el array de images segun el id pasado desde el modal padre pra trabajar
      //sobre la imagen seleccionada en cuestion , la cual le es asignada a la variable
      //imageselected

      console.log(this.userSelected);
      console.log(allUsers);
      console.log(this.userId);
    });
  }
}

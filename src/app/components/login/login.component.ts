//services
import { StorageService } from "./../../services/storage.service";
import { HttpsService } from "./../../services/https.service";
//core angular methods
import { Component, OnInit } from "@angular/core";
//reactive forms
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
//ionic stroage
import { Storage } from "@ionic/storage";
//router
import { Router } from "@angular/router";
//reduc
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import * as actionsAuth from "../authAction.action";
//ionic gui
import { LoadingController } from "@ionic/angular";
//firebase
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showLoginForm: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private httpServices: HttpsService,
    private storageService: StorageService,
    private storage: Storage,
    private router: Router,
    private stateStore: Store<GlobalAppState>,
    private loadingController: LoadingController,
    private imgUploader: AngularFireStorage
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
    //inicializandose el form para poder mandarlo al back

    this.storageService.getTokenInStorage();
    // acceddiendose al valor almacenado en storage referente al token

    this.stateStore.select("authReducers").subscribe((data) => {
      //console.log(data);
    });
    //accediendo a los valores del redux

    this.loginForm.reset();
    //reseteando el reactive form cada vez que se accede a la pagina
  }

  ////////////////////////////////login user //////////////////////////////////
  async loginUser() {
    console.log(this.loginForm.value);

    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Login User, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //estableciciendo loader para dar pasao a la accion de loggeado y generacion de token

    const { username, password } = this.loginForm.value;
    //Obteniendo los valores del form builder  traidos por la data insertada por el usuario

    if (this.loginForm.invalid) {
      return;
    }
    //estableciendo condicion en en caso de que form sea invalido

    await this.storageService.cleanStorage();
    //limpiandose el storage para proceder a generar un nuevo token

    //estableciciendo loader para dar pasao a la accion de loggeado y generacion de token
    this.httpServices
      .loginUser(username, password)
      .then(async (data) => {
        await loading.dismiss();
        //luego se procederia a cortar el loader si la accion culmina perfectamente

        this.router.navigate(["/tabs/tab1"]);
        //luego se routeriza la aplicacion al home
      })
      .catch((error) => {
        loading.dismiss();
        //console.log(error);
      });
  }
  //accion de login de usuario pasandosele los datos del reactive form y accediendo al servicio
  //en donde se desarrolla la logica

  ////////////////////////////////to Sign Up navigator //////////////////////////////////
  async goToSignUp() {
    await this.loginForm.reset();
    this.router.navigate(["/tabs/tab7"]);
  }
  //accion que triggeriza el router que redirige  a sign up page
}

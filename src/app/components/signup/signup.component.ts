//services
import { StorageService } from "./../../services/storage.service";
import { HttpsService } from "./../../services/https.service";
//router
import { Router } from "@angular/router";
//reactive forms
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
//angular core components
import { Component, OnInit } from "@angular/core";
//ionic gui components
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { LoadingController } from "@ionic/angular";
//firebase
import { AngularFireStorage } from "@angular/fire/storage";
//redux
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import * as actionsAuth from "../authAction.action";
//interfaces
import { url } from "src/app/interfaces/interfaces.interface";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  defaultImage: string = "/assets/defaultUser.png";
  imgSelected: any;
  signUpForm: FormGroup;
  showFormSignUp: boolean;

  constructor(
    private imagePicker: ImagePicker,
    private camera: Camera,
    private imgUploader: AngularFireStorage,
    private formBuilder: FormBuilder,
    private httpServices: HttpsService,
    private routering: Router,
    private loadingController: LoadingController,
    private storageService: StorageService,
    private stateStore: Store<GlobalAppState>
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      renterEmail: ["", [Validators.required, Validators.email]],
      renterName: ["", Validators.required],
      renterPassword: ["", Validators.required],
      renterImg: [""],
    });
    // console.log(this.signUpForm);
  }

  /////////////////////////////image picker//////////////////////////////////////
  async selectImg(event) {
    // this.imagePicker.getPictures(event).then((results) => {
    //   for (var i = 0; i < results.length; i++) {
    //       console.log('Image URI: ' + results[i]);
    //   }
    // }, (err) => { });

    if (event.target.files && event.target.files[0]) {
      const imageReader = await new FileReader();
      imageReader.onload = async (imgCharger: any) =>
        (this.defaultImage = await imgCharger.target.result);
      await imageReader.readAsDataURL(event.target.files[0]);
      this.imgSelected = await event.target.files[0];
      console.log(this.imgSelected);
    } else {
      this.defaultImage = await "/assets/imgs/defaultUser.png";
      this.imgSelected = await null;
    }
  }
  //metodo que resume el img selector cambiando su contenido reactivamente
  //cuando el usuario cambia de imagen , dejando lista la imagen a importar a la base de
  //datos una vez el usuario decida

  /////////////////////////////sign up//////////////////////////////////////
  async signUpUser() {
    console.log(this.signUpForm);

    if (this.signUpForm.invalid) {
      return;
    }
    //si el form no contien valore svalidos no se haria nada

    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Creating User, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //loading arrancando

    let {
      renterEmail,
      renterName,
      renterPassword,
      renterImg,
    } = this.signUpForm.value;
    //desagregando el valor traido desde e;l formbuilder para su uso en las fucniones de servicios

    let imageTrimmed: string;

    if (this.imgSelected == undefined || this.imgSelected == null) {
      this.imgSelected = await this.defaultImage;
      imageTrimmed = await this.imgSelected;
    } else {
      imageTrimmed = await this.imgSelected.name.split(".").splice(0, 1);
    }

    const imgFireStoragePath = `${renterEmail}/${imageTrimmed}`;
    //estableciendo el camino del usuario img en el firestorage compuesto por el email del usuario
    //y parte del nombre de la imagen

    const refStorage = await this.imgUploader.ref(imgFireStoragePath);
    console.log(imgFireStoragePath);
    //estableciendo variable que fije la referencia al camino de la imagen del usuario en storage

    renterImg = await imgFireStoragePath;
    //Asignando al renterimage el path del la imagen en firestore para su uso  y alamcenamiento en Mysql

    await this.httpServices
      .signUpUser(renterEmail, renterName, renterPassword, renterImg)
      .toPromise()
      .then(async (data) => {
        await data;
        await this.httpServices.loginUser(renterName, renterPassword);

        await this.imgUploader
          .upload(imgFireStoragePath, this.imgSelected)
          .snapshotChanges()
          .subscribe((result) => {
            refStorage
              .getDownloadURL()
              .toPromise()
              .then((urlImg: url) => {
                if (urlImg) {
                  console.log(urlImg);
                  this.stateStore.dispatch(
                    actionsAuth.setImageRenter({ imageRenter: urlImg })
                  );
                  this.signUpForm.value.renterImg = urlImg;
                }
              });
          });
        //metodo que sube la imagen a firebase y a la vez la descarga una vez instaurada
        //asignandosele su valor al item del reactive form renterImg

        await console.log(data);
        await loading.dismiss();
        //parando el loader cuando se ejecute exitosamente los metodos anteriores

        this.routering.navigate(["/tabs/tab1"]);
        //redireccionando a la pagina
      })
      .catch((error) => {
        loading.dismiss();
        console.log(error);
      });
    //proceso de creacion de y a la vez de login del usuario
  }

  ////////////////////////////////////////////////////////redirecto to login/////////////
  async goToLogin() {
    await this.signUpForm.reset();
    this.routering.navigate(["/tabs/tab6"]);
  }
  //metodo que redirecciona a login
}

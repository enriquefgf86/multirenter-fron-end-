import { AngularFireStorage } from "@angular/fire/storage";
import { LoadingController, ModalController } from "@ionic/angular";
import { HttpsService } from "../../../services/https.service";
import { Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup, FormControl } from "@angular/forms"; //imports
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { AllProductsSubType } from "src/app/interfaces/interfaces.interface";

interface User {
  id: number;
  first: string;
  last: string;
}
@Component({
  selector: "app-create-image-modal",
  templateUrl: "./create-image-modal.component.html",
  styleUrls: ["./create-image-modal.component.scss"],
})
export class CreateImageModalComponent implements OnInit {
  createImgForm: FormGroup;
  defaultImage: string = "/assets/defaultImg.jpg";
  allProdSubtypes: AllProductsSubType[];
  optionSelected: AllProductsSubType = null;
  imgSelected: any;
  imgByClasification: any[] = [];
  imgHeaders:any;

  sliderOptions = {
    slidesPerView: 1.4,
    freeMode: true,
    autoplay: true,
    spaceBetween:-420
  };

  @ViewChild("option") optionValue: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.createImgForm = this.formBuilder.group({
      url: ["", Validators.required],
      productSubTypeId: [null, Validators.required],
      productSubType: ["", Validators.required],
    });
    //inicializando los formGroup referente a los parametros necesarios para la creacion
    //de una imagen

    this.stateStore.select("prodReducers").subscribe((data) => {
      this.allProdSubtypes = Object.keys(data.allProductsSubType).map((key) => {
        return data.allProductsSubType[key];
      });

      console.log(this.allProdSubtypes);
      console.log(this.optionValue);
    });
    //convirtiendo un objeto de objetos a un array de objetos suscribiendonos all prodReducer
    //que traeria  el objeto de objeto referente a los tipos de subproductos , y mediante el
    //metodo Object , se accederia a las key  de cada uno de los mismos , retonando mediante
    //modificante map un array de objetos

    this.getArrayOfImgSubTypes();
  }
  async selectImg(event) {
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

  async createimage() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Creating Image, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //activando el loader

    let { url, productSubTypeId } = await this.createImgForm.value;
    //obteneindo los valores traidos desde el formbuilder desagregandolo
    //en sus constantes

    let productSubType: AllProductsSubType[] = await this.allProdSubtypes.filter(
      (product) => {
        return product.id.toString() === productSubTypeId;
      }
    );
    //una vez traido el formbuilder entonces se procederia mediante el accesso al valor
    //traido por el productSubTypeId a buscar o filtrar segun su id el total
    //del objeto para extraer el subtypo de producto y su nombre en si , el cual seria utilizado
    //pra establecer un path en firebas

    let imageTrimmed: string;

    if (this.imgSelected == undefined || this.imgSelected == null) {
      this.imgSelected = await this.defaultImage;
      imageTrimmed = await this.imgSelected;
    } else {
      imageTrimmed = await this.imgSelected.name.split(".").splice(0, 1);
    }

    const imgSubTypeFireStoragePath = await `${productSubType[0].productSubType}/${imageTrimmed}`;
    //estableciendo el camino del usuario img en el firestorage compuesto por el email del usuario
    //y parte del nombre de la imagen

    url = await imgSubTypeFireStoragePath;

    const refStorage = await this.imgSubTypeUpLoader.ref(
      imgSubTypeFireStoragePath
    );
    console.log(imgSubTypeFireStoragePath);
    //estableciendo variable que fije la referencia al camino de la imagen del usuario en storage

    let userAdminCreatingImage: number;
    //creando variable que a la postre representeraia el usuario (admin que crea la imagen
    //)y que es necesario para la verificacion del backend

    this.stateStore.select("authReducers").subscribe((data) => {
      userAdminCreatingImage = data.dedToken.id;
    });
    //obteneindose el usuario que crea la imagen

    console.log(this.createImgForm.value);
    console.log(userAdminCreatingImage);

    await this.httpService
      .createImage(url, productSubTypeId, userAdminCreatingImage)
      //llamando al servicion que crea la imagen
      .then(() => {
        this.imgSubTypeUpLoader
          .upload(imgSubTypeFireStoragePath, this.imgSelected)
          .snapshotChanges()
          .subscribe(() => {
            refStorage
              .getDownloadURL()
              .toPromise()
              .then((urlImg) => {
                if (urlImg) {
                  console.log(urlImg);
                }
              });
          });
      });
    //despues de llamdo dicho servicio nos sucribimos a su resultado para poroceder a
    //almacenar la imagen creada en firebase , esto mediante el uso del path
    //previamente creado , con la image(thisimSelected)fisica para ubicar en dicho storage
    //luego mediante getDownloadUrl se procede a extraer dicho url para su exposicion

    await this.formReseter();
    //reseteando el form antes de cerrar

    loading.dismiss();
    this.dismiss();
  }

  change(event) {
    console.log(event);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.mdlCtrl.dismiss({
      dismissed: true,
    });
  }

  formReseter() {
    return this.createImgForm.reset();
  }

  getArrayOfImgSubTypes() {
    this.stateStore.select("prodReducers").subscribe(async (data) => {
      console.log(data.allImgSubType);
      let arrayOfimgSubClasif = [];

      let arrayOfImgSubTypes = await Object.keys(data.allImgSubType).map(
        (result) => {
          return data.allImgSubType[result];
        }
      );
      //conviertiendo el traido desde el reducer , y convirtiendolo a un array de
      //objectos asignandolo a la variable arrayOfImgSubTypes

      arrayOfimgSubClasif = arrayOfImgSubTypes.reduce((r, a) => {
        let reducido=a.url.split('/')[0]
        r[reducido] = r[reducido] || [];
        r[reducido].push(a);
        return r;
      }, Object.create(null));
      //convirtiendo de nuevo a objeto de objetos el array de objetos  convertido previamente crando
      //un objeto de objetos segun el tipo de imagen, pero antes  designado y agrupando por ti[po]

      let newArray = await Object.keys(arrayOfimgSubClasif).map((result) => {
        return arrayOfimgSubClasif[result];
      });

      console.log(arrayOfImgSubTypes);
      console.log(arrayOfimgSubClasif);
      this.imgByClasification = newArray;
      this.imgHeaders=arrayOfimgSubClasif
      console.log(this.imgByClasification);
      console.log(this.imgHeaders);
    });
  }

  onClick(event){
    console.log(event);
    
  }
}

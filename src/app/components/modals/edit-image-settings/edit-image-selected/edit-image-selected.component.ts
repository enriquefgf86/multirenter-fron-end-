import { AngularFireStorage } from "@angular/fire/storage";
import { AllProductsSubType } from "src/app/interfaces/interfaces.interface";
import { AllImage } from "./../../../../interfaces/interfaces.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, Input, OnInit } from "@angular/core";
import { HttpsService } from "src/app/services/https.service";
import { ModalController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";

@Component({
  selector: "app-edit-image-selected",
  templateUrl: "./edit-image-selected.component.html",
  styleUrls: ["./edit-image-selected.component.scss"],
})
export class EditImageSelectedComponent implements OnInit {
  @Input("imageId") imageId;
  editImageForm: FormGroup;
  imageSelected: AllImage[];
  prodSubType: AllProductsSubType[];
  img: any;
  defaultImage: string;
  checkboxSelected: AllProductsSubType;

  constructor(
    private httpService: HttpsService,
    private modalController: ModalController,
    private stateStore: Store<GlobalAppState>,
    private formBuilder: FormBuilder,
    private imgSubTypeUpLoader: AngularFireStorage
  ) {}

  ngOnInit() {
    this.editImageForm = this.formBuilder.group({
      url: ["", Validators.required],
      productSubTypeId: ["", Validators.required],
    });
    //form builder with its values
    this.imageSelectedProcess();
  }

  compareFn(e1: AllProductsSubType, e2: AllProductsSubType): boolean {
    return e1 && e2 ? e1.id == e2.id : e1 == e2;
  }

  closeCreateProdModal() {
    this.modalController.dismiss();
  }
  //cerrando el modal

  async imageSelectedProcess() {
    let allImages;
    let subtype;
    await this.httpService.getAllProdSubTypes();
    await this.stateStore.select("prodReducers").subscribe(async (data) => {
      if (data.allImgSubType) {
        allImages = await Object.keys(data.allImgSubType).map((key) => {
          return data.allImgSubType[key];
        });
      }
      //trayrendo todos ls subtypos d eimages para editar la seleccionada

      if (data.allProductsSubType) {
        subtype = await Object.keys(data.allProductsSubType).map((key) => {
          return data.allProductsSubType[key];
        });
      }
      //trayendo todos los subtypes de productos para signarle a la imagen editada
      //uno de sus ids

      this.prodSubType = subtype; //asignando array de subtypes para select option

      this.imageSelected = allImages.filter((data) => data.id === this.imageId);
      //filtrando el array de images segun el id pasado desde el modal padre pra trabajar
      //sobre la imagen seleccionada en cuestion , la cual le es asignada a la variable
      //imageselected

      let string;
      string = this.imageSelected[0].url.split("/")[0];
      console.log(string);
      //proceso de obtener el subtipo de producto para la imagen seleccionada , el cyual
      //se puede obtener del patrh de la imagen seleccionada, pues la misma
      //antes del primer slash , incluy dicho subtipo, asignandosele dicho valor a
      //la variable string

      let subtypeSelected:AllProductsSubType[] = this.prodSubType.filter(
        (data) => data.productSubType == string
      );
      //asignandosele a la variable subtypeselected el resultado del filtor sobre
      //el array del subtypeProduct, extrayendo aquel que cumpla con los requisitos
      //que tengan igualdad con el string previamente sacado del path de la imagen

      this.checkboxSelected ={ ...subtypeSelected[0]};
      //asigandosele a la variable checboxselected la variable previamente calculada
      //para su uso en filtros y demas desde el html

      console.log(this.checkboxSelected);
      console.log(subtypeSelected);
      console.log(this.imageId);
      console.log(this.prodSubType);
      console.log(allImages);
      console.log(this.imageSelected[0].url);

      if (this.imageSelected[0].url) {
        this.img = this.imageSelected[0].url;
      }
    });
  }
  //metodo de proceso para la aseleccion de la imagen en donde 
  //primero se extraen todas las imagenes del redux, para luego mediante 
  //filtro proceder a taer de todas esas imagenes , la que coincida con el imgeid pasado
  //por input .Tambien se traen todos los subtipos de productos , necesarios tambien 
  //para la modificacion de imagenes.

  async selectImg(event) {
    if (event.target.files && event.target.files[0]) {
      const imageReader = await new FileReader();
      imageReader.onload = async (imgCharger: any) =>
        (this.defaultImage = await imgCharger.target.result);
      await imageReader.readAsDataURL(event.target.files[0]);
      this.img = await event.target.files[0];
      console.log(this.img);
    } else {
      this.defaultImage = this.img;
      this.img = await null;
    }
  }
  //metodo que escucha el onchange de seleccion de archivos y ,mediante FileReader
  //virtualiza la nueva iumagen seleccionada , poniendola enm el visualizador

  async editImage() {
    let { url, productSubTypeId } = await this.editImageForm.value;
    //obteneindo los valores traidos desde el formbuilder desagregandolo
    //en sus constantes

    console.log(this.editImageForm.value);

    let productSubType: AllProductsSubType[] = await this.prodSubType.filter(
      (product) => {
        return product.id.toString() === productSubTypeId;
      }
    );
    //una vez traido el formbuilder entonces se procederia mediante el accesso al valor
    //traido por el productSubTypeId a buscar o filtrar segun su id el total
    //del objeto para extraer el subtypo de producto y su nombre en si , el cual seria utilizado
    //pra establecer un path en firebase

    let imageTrimmed: string;
    await console.log(this.img);

    imageTrimmed = await this.img.name.split(".").splice(0, 1);

    const imgSubTypeFireStoragePath = await `${productSubType[0].productSubType}/${imageTrimmed}`;
    //estableciendo el camino del usuario img en el firestorage compuesto por el email del usuario
    //y parte del nombre de la imagen
    url = await imgSubTypeFireStoragePath;

    const refStorage = await this.imgSubTypeUpLoader.ref(
      imgSubTypeFireStoragePath
    );
    console.log(imgSubTypeFireStoragePath);
    //estableciendo variable que fije la referencia al camino de la imagen del usuario en storage

    let renterId: number;
    //creando variable que a la postre representeraia el usuario (admin que crea la imagen
    //)y que es necesario para la verificacion del backend

    this.stateStore.select("authReducers").subscribe((data) => {
      renterId = data.dedToken.id;
    });
    //obteneindose el usuario que crea la imagen

    console.log(this.editImageForm.value);
    console.log(renterId);

    await this.httpService
      .editImageSubTypeById(url, this.imageId, productSubTypeId, renterId)
      //llamando al servicion que crea la imagen
      .then(() => {
        this.imgSubTypeUpLoader
          .upload(imgSubTypeFireStoragePath, this.img)
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
  }

  formReseter() {
    return this.editImageForm.reset();
  }
  //reseteador del formGroup cuando se cumple alguna accion
}

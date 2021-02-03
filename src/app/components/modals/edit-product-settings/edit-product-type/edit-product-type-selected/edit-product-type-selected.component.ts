import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalController, ToastController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { AllProductsType } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-edit-product-type-selected",
  templateUrl: "./edit-product-type-selected.component.html",
  styleUrls: ["./edit-product-type-selected.component.scss"],
})
export class EditProductTypeSelectedComponent implements OnInit {
  @Input("productTypeId") productTypeId;
  editProdTypeForm: FormGroup;
  productType: AllProductsType;
  renterId: number;

  constructor(
    private httpService: HttpsService,
    private modalController: ModalController,
    private stateStore: Store<GlobalAppState>,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private routering: Router
  ) {}

  ngOnInit() {
    this.editProdTypeForm = this.formBuilder.group({
      productTypeName: ["", Validators.required],
    });

    this.filterAType(this.productTypeId);
    console.log(this.productType);
    this.gettingUserId();
  }

  filterAType(id: number) {
    if (id) {
      this.httpService.getAllProdtypes();
      let types: AllProductsType[] = [];
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProductsType) {
          types = Object.keys(data.allProductsType).map((key) => {
            return data.allProductsType[key];
          });
          this.productType = types.filter((data) => data.id === id)[0];
          //vease que en esta igualdad el resultado sera un array de un elemento,
          //por lo que si se quiere ser especifico se eespecifica el objeto dentro del array
          //y su posicion , en este caso en la posicion 0 , pues es un solo objeto el filtrado
          console.log(this.productType);
        }
      });
    }
  }
  //Vease que en este caso en vez de crear un endpoint y llamar un subtypoe de producto
  //especifico por su id, simplemente se procede a establecer un filtro sobre todos los
  //subtype de productos traidos, vease que para ello primero  se accede al metodo de
  //traer todos los subtype , para luego desde el reduc suscribirnos al mismo y traer el arrya
  //de objetos sobre el cual se filtraria cualesquiera del los objetos que cumpla con la
  //condicion de igualdad de los id pasados por parametro en el metodo .Asignandose dicho
  //filtro a la variable subType inicializada previamente

  gettingUserId() {
    this.stateStore.select("authReducers").subscribe((data) => {
      if (data.dedToken) {
        this.renterId = data.dedToken.id;
      }
    });
  }
  //Funcion que obtine el id del usuario actual autenticado para la gestio  de metodos

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }
  //cerrando el modal de edicion de usb prodyuctos

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  editProdType(){
    const { productTypeName } = this.editProdTypeForm.value;
    console.log(this.editProdTypeForm.value);
    if(this.renterId){
      this.httpService.editProducTypeById(productTypeName,this.productTypeId,this.renterId)
    }
    else{
      let message:string="user not authenticated , please log in "
      this.closeCreateProdModal()
      this.presentToast(message).then(()=>this.routering.navigate(['/tabs/tab6']))
    }
    
  }

}

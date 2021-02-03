import { Router } from '@angular/router';
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalController, ToastController } from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { AllProductsSubType } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-product-subtype-selected",
  templateUrl: "./product-subtype-selected.component.html",
  styleUrls: ["./product-subtype-selected.component.scss"],
})
export class ProductSubtypeSelectedComponent implements OnInit {
  @Input("productSubTypeId") productSubTypeId;
  editProdSubForm: FormGroup;
  subType:AllProductsSubType;
  renterId :number

  constructor(
    private httpService: HttpsService,
    private modalController: ModalController,
    private stateStore: Store<GlobalAppState>,
    private formBuilder: FormBuilder,
    private toastController:ToastController,
    private routering:Router
  ) {}

  ngOnInit() {
    this.editProdSubForm = this.formBuilder.group({
      productSubTypeName: ["", Validators.required],
    });

    this.filterASubType(this.productSubTypeId);
    console.log(this.subType);

    this.gettingUserId()
    
  }

  filterASubType(id: number) {
    if (id) {
      this.httpService.getAllProdSubTypes();
      let subTypes: AllProductsSubType[] = [];
      this.stateStore.select("prodReducers").subscribe((data) => {
        if (data.allProductsSubType) {
          subTypes = Object.keys(data.allProductsSubType).map((key) => {
            return data.allProductsSubType[key];
          });
          this.subType = subTypes.filter((data) => data.id === id)[0];
          //vease que en esta igualdad el resultado sera un array de un elemento,
          //por lo que si se quiere ser especifico se eespecifica el objeto dentro del array 
          //y su posicion , en este caso en la posicion 0 , pues es un solo objeto el filtrado 
          console.log(this.subType);
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

  editProdSub() {
    const { productSubTypeName } = this.editProdSubForm.value;
    console.log(this.editProdSubForm.value);
    if(this.renterId){
      this.httpService.editProductSubById(productSubTypeName,this.productSubTypeId,this.renterId)
    }
    else{
      let message:string="user not authenticated , please log in "
      this.closeCreateProdModal()
      this.presentToast(message).then(()=>this.routering.navigate(['/tabs/tab6']))
    }
    
  }
  //metodo que llama el endepoint y modifica el product subtype especifico

  closeCreateProdModal() {
    return this.modalController.dismiss();
  }
  //cerrando el modal de edicion de usb prodyuctos

  gettingUserId() {
    this.stateStore.select("authReducers").subscribe((data) => {
      if (data.dedToken) {
        this.renterId = data.dedToken.id;
      }
    });
  }
  //Funcion que obtine el id del usuario actual autenticado para la gestio  de metodos

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }
  //toast action exposer 
}

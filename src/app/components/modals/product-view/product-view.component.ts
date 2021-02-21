import { ProductPopoverRentProductComponent } from './product-popover-rent-product/product-popover-rent-product.component';
import { ProductPopoverCommentsComponent } from "./product-popover-comments/product-popover-comments.component";
import { Component, Input, OnInit } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import {
  ModalController,
  LoadingController,
  PopoverController,
} from "@ionic/angular";
import { Store } from "@ngrx/store";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { Product } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";
import { Label, MultiDataSet } from "ng2-charts";
import { ChartType } from "chart.js";
import { Subscription } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: "app-product-view",
  templateUrl: "./product-view.component.html",
  styleUrls: ["./product-view.component.scss"],
})
export class ProductViewComponent implements OnInit {
  @Input("prodId") prodId;
  prodSelected: Product;
  susbcriptor: Subscription;

  comments: Comment[] = [];
  commentForm: FormGroup;
  renterId: number;
  role:string

  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = "doughnut";
  public doughnutChartLegend = true;
  //Variables del doughntnut referente a la creacion de legendats, asi como
  //la refeente a la incersion d ela data y el tipo de grafica

  constructor(
    private stateStore: Store<GlobalAppState>,
    private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController,
    private pop: PopoverController,
    private formBuilder:FormBuilder,
    private router:Router
  ) {}

  ngOnInit() {
    if (this.prodId) {
      console.log(this.prodId);

      this.productSelected();
    }
    this.commentForm = this.formBuilder.group({
      commentBody: [null, Validators.required],
    });

    this.stateStore.select('authReducers').subscribe(async(user)=>{
      if(user.dedToken.authorities[0]!=null&&user.dedToken.authorities[0]!=undefined){
        this.role=await user.dedToken.authorities[0]
        console.log(this.role);
        
      }
      
    })
  }

  async productSelected() {
    if (this.prodId) {
      await this.httpService.getProductById(this.prodId);
      await this.stateStore.select("prodReducers").subscribe((data) => {
        this.prodSelected = data.productSelectedId;
      });
      //obteneidno el producuto seleccionado desde el redux

      let allProductsNameForLabel: Product[] = [];
      let percentages: any[] = [];
      //variables para determinar primero el array de tipo Product que conformaria un array
      //de nombres referente a cada nombre de cada producto, y la segunda traeria todas las
      //rentas  de cada producto

      await this.stateStore.select("prodReducers").subscribe(async (data) => {
        console.log(data.allProducts);

        allProductsNameForLabel = await Object.keys(data.allProducts).map(
          (key) => {
            return data.allProducts[key];
          }
        );
        //asigando todos los productos a la variable allProductsNameForLabel

        allProductsNameForLabel = await [...allProductsNameForLabel];
        await allProductsNameForLabel.splice(
          allProductsNameForLabel.findIndex(
            (object) =>
              object.product_name === data.productSelectedId.product_name
          ),
          1
        );
        //luego se procederia a filtrar la variable anterior  para conformar un array de productos
        //que no contemple el producto actual , para de esa manera trabajar sobre ese array excluyendo el
        //produco actual

        await allProductsNameForLabel.forEach((product) => {
          percentages.push(product.product_rents.length);
        });
        // ya con el array de resto de productos sin incluir el actual se procederia entonces a establecer un
        //for each en donde se determine el length de cada array de renta de cada objeto, adicionandosele
        //a la variable percentaje

        let x = percentages.reduce((a, b) => a + b, 0);
        let y: any = this.prodSelected.product_rents.length;

        let totalRents = x + y;
        let percentageCurrentProduct = y / totalRents;
        let percentageRestProduct = x / totalRents;
        //En este paso simplemente se procede a sumar todos los lengths
        //de los productos restantes para roceder a su suma

        this.doughnutChartLabels = [
          [
            "All Products",
            `--${(percentageRestProduct * 100).toFixed(1)} % of rents`,
          ],
          [
            this.prodSelected.product_name,
            `--${(percentageCurrentProduct * 100).toFixed(1)} % of rents`,
          ],
        ];

        this.doughnutChartData.push(percentages.reduce((a, b) => a + b, 0));
        this.doughnutChartData.push(y);

        console.log(allProductsNameForLabel);
      });
    }
    console.log(this.prodSelected);
  }
  //metodo que localiza el metodo que busca el producto por id en el microservicio
  //para luego previo metodo retirar del redux el producto almacenado y
  //proceder a signarselo a la variable prodSelected con un formato de array

  closeCreateProdModal() {
    this.mdlCtrl.dismiss();
  }
  //metodo que cierra el modal

  rentProduct(event) {
    this.goingToModal(event, this.prodId, ProductPopoverRentProductComponent);
  }
  //abriendo el modal de rentas del producto haciendo alusion al componente que se 
  //anriria como popover

  seeAllComments(event) {
    let prodId: number = this.prodId;
    this.goingToModal(event, prodId, ProductPopoverCommentsComponent);
  }

  async goingToModal(event, prodId: number, component) {
    console.log(event);
    var target =
      (await event.target) ||
      (await event.srcElement) ||
      (await event.currentTarget);
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    console.log(target.id);
    prodId = Number(target.id);

    const popover = await this.pop.create({
      component: component,
      cssClass: 'popover',
      componentProps: {
        prodId,
      },
      translucent: true,
    });
    return await popover.present();
  }
  //metodo que triggeriza el popover correspodiente al componente que se quiera ostrar en este caso seria
  //ProductViewComponent, pasandosele como propiedad el id del producto que se quiere mostrar
  //enm este caso mediante acceso a props , y la variable prodId

  async addComment() {
    const { commentBody } = await this.commentForm.value;
    console.log(this.commentForm.value);
    if (commentBody != null || commentBody != undefined) {
      await this.getRenterIdCommenting();
      this.httpService
        .addCommentInProduct(commentBody, this.prodId, this.renterId)
        .then(() => {
          this.formReseter();
          this.closePop();
        });
    } else return;
  }
  //metodo encargado de adicionar comentarios , veaevease que paa ello se hace necesario
  //triggerizar el metodo  getRenterIdCommenting() que traeria el usuario autenticado
  //para luego proceder a pasarle el coment body del text area , asi como el
  //id del producuto sobre el cual se quiere comentare r y el id del renter triggerizado en
  //el metodo antes mencionado

  getRenterIdCommenting() {
    this.stateStore.select("authReducers").subscribe((data) => {
      if (this.prodId) {
        this.renterId = data.dedToken.id;
        console.log(this.renterId);
      }
    });
  }
  //obteniendo el id del renter que comenta!!

  formReseter() {
    this.commentForm.reset();
  }
  //reseteador de formbuilder

  closePop() {
    return this.pop.dismiss();
  }
  //cerrador del popover

 async routeringAdmin(){
   await this.closeCreateProdModal();
    this.router.navigate(['/tabs/tab4'])
  }
  //routerzando el administrador a la base de edicion 
}

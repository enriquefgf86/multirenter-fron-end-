import { PopoverController } from "@ionic/angular";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { GlobalAppState } from "src/app/globalReducer.reducer";
import { Comment } from "src/app/interfaces/interfaces.interface";
import { HttpsService } from "src/app/services/https.service";

@Component({
  selector: "app-product-popover-comments",
  templateUrl: "./product-popover-comments.component.html",
  styleUrls: ["./product-popover-comments.component.scss"],
})
export class ProductPopoverCommentsComponent implements OnInit, OnDestroy {
  @Input("prodId") prodId;
  susbcriptor: Subscription;

  comments: Comment[] = [];
  commentForm: FormGroup;
  renterId: number;
  constructor(
    private stateStore: Store<GlobalAppState>,
    private formBuilder: FormBuilder,
    private httpService: HttpsService,
    private pop: PopoverController
  ) {}

  ngOnInit() {
    console.log(this.prodId);

    this.getAllCommentsOfProductSelected();
    this.commentForm = this.formBuilder.group({
      commentBody: [null, Validators.required],
    });
    console.log(this.commentForm.value);
  }
  ngOnDestroy() {
    // this.susbcriptor.unsubscribe();
  }
  //destruyendo la susbcripcion al metodo una vez se deje la vista del popoiver

  getAllCommentsOfProductSelected() {
    if (this.prodId) {
      this.stateStore.select("prodReducers").subscribe((data) => {
        this.comments = data.productSelectedId.product_comments;
        console.log(this.comments);
        console.log(data.productSelectedId.product_comments);
      });
    }
  }
  //metodo que obtiene todos los comentarios por producto seleccionado , esto traido desde
  //el reduz a traves del productSelectedId

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
}

import { PopoverController } from '@ionic/angular';
import { CloseRentDetailComponent } from './close-rent-detail/close-rent-detail.component';
import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ModalController, LoadingController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { GlobalAppState } from 'src/app/globalReducer.reducer';
import { RenterRents } from 'src/app/interfaces/interfaces.interface';
import { HttpsService } from 'src/app/services/https.service';
import { RentSelectedModalComponent } from '../rent-selected-modal/rent-selected-modal.component';

@Component({
  selector: 'app-all-rents-closed-modal',
  templateUrl: './all-rents-closed-modal.component.html',
  styleUrls: ['./all-rents-closed-modal.component.scss'],
})
export class AllRentsClosedModalComponent implements OnInit {

  allRentsClosed:RenterRents[] =[];
  renterId:number;
  constructor(private httpService: HttpsService,
    private mdlCtrl: ModalController,
    private stateStore: Store<GlobalAppState>,
    private imgSubTypeUpLoader: AngularFireStorage,
    private loadingController: LoadingController,
    private pop:PopoverController) { }

  ngOnInit() {
    this.stateStore.select('renterReducers').subscribe(data=>{
      
      if(data.closeRent){
        this.allRentsClosed = Object.keys(data.closeRent).map((key) => {
          return data.closeRent[key];
        });
        console.log(data.closeRent);
        console.log(this.allRentsClosed);
      }
    })

   
    
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.mdlCtrl.dismiss({
      dismissed: true,
    });
  }

  async goToRentClosed(event) {
    console.log(event);
    var target =
      (await event.target) ||
      (await event.srcElement) ||
      (await event.currentTarget);
    //asignandosele a la variable target culaesuqiera de los posibles valores que pueidese
    //traer el dom para cada uno de dichos objetos  una vez el elemento dentro del array es clickeado
    //para luego proceder a extraer el id del elemento clickeado y proceder con cualesquiera el  metodo

    console.log(target.id);
    let id: number = Number(target.id);
    this.showRentCloseSelected(id)
  }
    //Mostrando el editor o madal para la imagen seleccionada una vez clickado el card
    //correspondiente al cual se le asigna por valor el id de la imagen 

  async showRentCloseSelected(rentId: number) {
    const modal = await this.pop.create({
      component: CloseRentDetailComponent,
      componentProps: {
        rentId
      },
    });
    return await modal.present();
  }
  //Abriendo el modal que edita las imagenes haciendo referencia al componente
  // EditImageSelectedComponent

}

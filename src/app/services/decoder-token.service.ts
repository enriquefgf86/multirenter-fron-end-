import { Injectable } from "@angular/core";
//firebase
import { AngularFireStorage } from "@angular/fire/storage";
//redux
import { Store } from "@ngrx/store";
import { GlobalAppState } from "../globalReducer.reducer";
import * as actionsAuth from "../components/authAction.action";
//jwt decoder
import jwt_decode from "jwt-decode";
//interfaces
import { url } from "../interfaces/interfaces.interface";

@Injectable({
  providedIn: "root",
})
export class DecoderTokenService {

  imageRenterDefault:boolean=false;

  constructor(
    private stateStore: Store<GlobalAppState>,
    private imgUploader: AngularFireStorage
  ) {}

  decoder(tokenCode: string) {
    return jwt_decode(tokenCode);
  }

  async imageRetrieverUser(userImgPath: string) {
    const imgFireStoragePath = `${userImgPath}`;
    //estableciendo el camino del usuario img en el firestorage compuesto por el path de la imagen
    //segun la base dedtaos

    const refStorage = await this.imgUploader.ref(imgFireStoragePath);
    //establecidno la referencia en el storage para trigerrizar el url de la imagen a descargar

    console.log(imgFireStoragePath);
    refStorage
      .getDownloadURL()
      .toPromise()
      .then((urlImg: url) => {
        if (urlImg) {
          console.log(urlImg);
          this.stateStore.dispatch(
            actionsAuth.setImageRenter({ imageRenter: urlImg })
          );
        }
        
      });
    //proceso de descrag de la imgen desde firebase y su asignacion mediante accion de redux a su valor
    //en el store para el uso de los demas compoentes de la aplicacion
  }
}

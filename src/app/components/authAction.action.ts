import { decodedToken, tokengenerated, url } from "./../interfaces/interfaces.interface";
import { createAction, props } from "@ngrx/store";

export const setToken = createAction(
  "[Auth Token] setToken",
  props<{ token: tokengenerated }>()
);
//creandose y exportandose la accion que setea el token en ele reducer, vease que como data se le pasaria
//el props que hace referencia al tipo de data en cuation que acarrrearia deicha accion , que en este caso seria
//un objeto de tipo tokengenerated

export const decodingToken = createAction(
  "[Auth Token] decodedToken",
  props<{ decoded: decodedToken }>()
);
//creandose y exportandose la accion que setea el token decodificadoen ele reducer, vease que como data se
// le pasaria el props que hace referencia al tipo de data en cuation que acarrrearia deicha accion ,
// que en este caso seria un objeto de tipo decodedToken

export const viewLogin = createAction(
  "[Auth Token] viewLogin"
);
//creandose y exportandose la accion que establezca una accion que plantee ver el componente login

export const viewSignUp = createAction(
  "[Auth Token] viewSignUp"
);
//creandose y exportandose la accion que establezca una accion que plantee ver el componente login

export const userAuth = createAction(
  "[Auth Token] userAuth"
);
//creandose y exportandose la accion que establezca una accion que plantee ver el componente login

export const resetStore = createAction(
  "[Auth Token] resetStore"
);
//creandose y exportandose la accion que establezca una accion que plantee resetear los valores del reducer


export const setImageRenter = createAction(
  "[Auth Token] setImageRenter",
  props<{ imageRenter: url }>()
);
//creandose y exportandose la accion que setea el una imagen de url  en ele reducer, vease que como data
// se le pasaria props que hace referencia al tipo de data en cuestion que acarrrearia dicha accion , que
// en este caso seria un objeto de tipo url que se gun la interface es una string 


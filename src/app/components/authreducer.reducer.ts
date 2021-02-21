//acciones
import * as auths from "./authAction.action";
//interfces
import {
  decodedToken,
  tokengenerated,
  url,
} from "./../interfaces/interfaces.interface";
//reducer y sus fucniones de mutacion
import { createReducer, on } from "@ngrx/store";

export interface State {
  token: tokengenerated;
  viewLogin: boolean;
  viewSignUp: boolean;
  setImageRenter: url;
  dedToken: decodedToken;
  resetStore: boolean;
  userAuth: any;
}
//Estableciendo la interfaz de este reducer en custion para el uso del token generado

export const initialState: State = {
  token: null,
  viewLogin: false,
  viewSignUp: false,
  setImageRenter: null,
  dedToken: null,
  resetStore: false,
  userAuth: null,
};
//inicializando el los valores por default que tendria la variable initiali state de tipo Interface State

const _authReducer = createReducer(
  initialState,
  //se incializa el state como tal con sus valores por default

  on(auths.setToken, (state, { token }) => ({
    ...state,
    token: { ...token },
    userAuth: true,
  })),
  //metodo que modifica el item, token del initial State a traves de la accion setToken
  //importada desde actions pasandose como payload del state el item token , y una vez desagregado
  //dicho state se le pasaria el valor del nuevo token tambioen desagregado por cada uno de sus componentes

  on(auths.userAuth, (state) => ({
    ...state,
    userAuth: true,
  })),
  //Accion que establece el usuarion en true 
  on(auths.viewLogin, (state) => ({
    ...state,
    viewLogin: true,
    viewSignUp: false,
  })),
  //metodo que modifica el item, viewLogin del initial State a traves de la accion viewLogin
  //importada desde actions en este caso al ser la variable de tipo boolen no es necesario pasar un payload
  //sino que simplemente se le asigana a dicho item viewLogin un valor booleano true y como contrapartida
  //al item viewSignUp se le asigna un valore false

  on(auths.viewSignUp, (state) => ({
    ...state,
    viewSignUp: true,
    viewLogin: false,
  })),
  //metodo que modifica el item, viewSignUp del initial State a traves de la accion viewSignUp
  //importada desde actions en este caso al ser la variable de tipo boolen no es necesario pasar un payload
  //sino que simplemente se le asigana a dicho item viewSignUp un valor booleano true y como contrapartida
  //al item viewLogin se le asigna un valore false

  on(auths.setImageRenter, (state, { imageRenter }) => ({
    ...state,
    setImageRenter: imageRenter,
  })),
  //metodo que modifica el item, setImageRenter del initial State a traves de la accion setImageRenter
  //importada desde actions pasandose como payload del state el item imageRenter , y una vez desagregado
  //dicho state se le pasaria el valor del nuevo setImageRenter aunque en este caso al no ser un
  //objeto no hace falta desagregarlo

  on(auths.decodingToken, (state, { decoded }) => ({
    ...state,
    dedToken: { ...decoded },
  })),
  //metodo que modifica el item, dedToken del initial State a traves de la accion decodingToken
  //importada desde actions pasandose como payload del state el item decoded , y una vez desagregado
  //dicho state se le pasaria el valor del nuevo dedcoded tambioen desagregado por cada uno de sus componentes

  on(auths.resetStore, (state) => ({
    ...state,
    resetStore: true,
    setImageRenter: null,
    decodedToken: null,
    token: null,
    userAuth: null,
    dedToken:null
  }))
  //metodod que triggeriza el reseteo de todas la variables del store a su valor de
  //initial state  a traves del metodo resetStore, establecidnose  el item reset stroe como true
  //y los demas compoents del initialState con sus valores por default
);

export function AuthReducer(state, action) {
  return _authReducer(state, action);
}
//exportando el reducer para su uso por las demas dependencias a traves de Reducermap

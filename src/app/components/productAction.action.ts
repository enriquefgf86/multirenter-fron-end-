import { createAction, props } from "@ngrx/store";
import {
  AllFeeDeelay,
  AllImage,
  Allprice,
  AllProductsSubType,
  AllProductsType,
  Data,
  DataAllImages,
  ListofProduct,
  StattusSuccessImges,
} from "../interfaces/interfaces.interface";

export const setAllProducts = createAction(
  "[Products] setAllProducts",
  props<{ allProductsToSet: ListofProduct[] }>()
);
//creando la accion que setea los valores del array de productos traidos desde el back en el store

export const setAllProductsType = createAction(
  "[Products] setAllProductsType ",
  props<{ allProductsTypeToSet: AllProductsType[] }>()
);
//creando la accion que setea los valores del array de productos traidos desde el back en el store

export const setAllProductsSubType = createAction(
  "[Products] setAllProductsSubType ",
  props<{ allProductsSubTypeToSet: AllProductsSubType[] }>()
);
//creando la accion que setea los valores del array de productos traidos desde el back en el store

export const setAllImgSubType = createAction(
  "[Products] setAllImgSubType ",
  props<{ allImages: AllImage[] }>()
);
//creando la accion que setea los valores del array de productos traidos desde el back en el store

export const setAllProductDeelaysMount = createAction(
  "[Products] setAllProductDeelaysMount ",
  props<{ allProdDeelays: AllFeeDeelay[] }>()
);
//creando la accion que setea los valores del array de cargos [por delay en renta de productos traidos desde
//el backend

export const setAllProductPrices = createAction(
  "[Products] setAllProductPrices",
  props<{ allProdPrices: Allprice[] }>()
);
//creando la accion que setea los valores del array de precios  en renta de productos traidos desde
//el backend

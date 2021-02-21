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
  Product,
  StattusSuccessImges,
} from "../interfaces/interfaces.interface";

export const setAllProducts = createAction(
  "[Products] setAllProducts",
  props<{ allProductsToSet: ListofProduct[] }>()
);
//creando la accion que setea los valores del array de productos traidos desde el back en el store

export const setProductSelectedById = createAction(
  "[Products] setProductSelectedById ",
  props<{ productById: Product }>()
);
//creando la accion que traeria el producto segun su id
export const setAllProductsType = createAction(
  "[Products] setAllProductsType ",
  props<{ allProductsTypeToSet: AllProductsType[] }>()
);
//accion que traeria todos los tipos de productos

export const setAllProductsSubType = createAction(
  "[Products] setAllProductsSubType ",
  props<{ allProductsSubTypeToSet: AllProductsSubType[] }>()
);
//accion que traeria todos los sub tipos de productos

export const setAllImgSubType = createAction(
  "[Products] setAllImgSubType ",
  props<{ allImages: AllImage[] }>()
);
//accion que traeria las imagenes de  todos los sub tipos de productos

export const setAllProductDeelaysMount = createAction(
  "[Products] setAllProductDeelaysMount ",
  props<{ allProdDeelays: AllFeeDeelay[] }>()
);
//accion que establece todos los fee delays de cada producto

export const setAllProductPrices = createAction(
  "[Products] setAllProductPrices",
  props<{ allProdPrices: Allprice[] }>()
);
//accion que trae todos los precios de todos los productos

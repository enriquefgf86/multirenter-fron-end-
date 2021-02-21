import * as prods from "./productAction.action";
import { createReducer, on, State } from "@ngrx/store";
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

export interface StateProducts {
  allProducts: ListofProduct[];
  allProductsType: AllProductsType[];
  allProductsSubType: AllProductsSubType[];
  allImgSubType: AllImage[];
  allFeesProducts: AllFeeDeelay[];
  allPricesProducts: Allprice[];
  productSelectedId:Product
}
export const initialState: StateProducts = {
  allProducts: null,
  allProductsType: null,
  allProductsSubType: null,
  allImgSubType: null,
  allFeesProducts: null,
  allPricesProducts: null,
  productSelectedId:null
};

const _prodReducer = createReducer(
  initialState,
  on(prods.setAllProducts, (state, { allProductsToSet }) => ({
    ...state,
    allProducts: { ...allProductsToSet },
  })),
  //metodo que establece el set de productos traidos desde la accion setAllProducts

  on(prods.setAllProductsType, (state, { allProductsTypeToSet }) => ({
    ...state,
    allProductsType: { ...allProductsTypeToSet },
  })),
    //metodo que establece el set de tipos  productos traidos desde la accion setAllProducts

  on(prods.setAllProductsSubType, (state, { allProductsSubTypeToSet }) => ({
    ...state,
    allProductsSubType: { ...allProductsSubTypeToSet },
  })),
    //metodo que establece el set de subtipos productos traidos desde la accion setAllProductsSubType

  on(prods.setAllImgSubType, (state, { allImages }) => ({
    ...state,
    allImgSubType: { ...allImages },
  })),
    //metodo que establece el set de images productos traidos desde la accion setAllImgSubType

  on(prods.setAllProductPrices, (state, { allProdPrices }) => ({
    ...state,
    allPricesProducts: { ...allProdPrices },
  })),
  // metodo que establece el set de precios  por retraso en devolucion  desde la accion 
  //setAllProductPrices

  on(prods.setAllProductDeelaysMount, (state, { allProdDeelays }) => ({
    ...state,
    allFeesProducts: { ...allProdDeelays },
  })),
    // metodo que establece el set de fees por retraso en devolucion  desde la accion setAllProductDeelaysMount

  on(prods.setProductSelectedById, (state, { productById}) => ({
    ...state,
    productSelectedId: productById,
  })),
    // metodo que establece el el producto seleccionado por su id desde 
    //  desde la accion setProductSelectedById
);

export function ProdReducer(state, action) {
  return _prodReducer(state, action);
}
//exportando el reducer para su uso por las demas dependencias a traves de Reducermap

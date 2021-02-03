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

  on(prods.setAllProductsType, (state, { allProductsTypeToSet }) => ({
    ...state,
    allProductsType: { ...allProductsTypeToSet },
  })),
  on(prods.setAllProductsSubType, (state, { allProductsSubTypeToSet }) => ({
    ...state,
    allProductsSubType: { ...allProductsSubTypeToSet },
  })),

  on(prods.setAllImgSubType, (state, { allImages }) => ({
    ...state,
    allImgSubType: { ...allImages },
  })),

  on(prods.setAllProductPrices, (state, { allProdPrices }) => ({
    ...state,
    allPricesProducts: { ...allProdPrices },
  })),
  on(prods.setAllProductDeelaysMount, (state, { allProdDeelays }) => ({
    ...state,
    allFeesProducts: { ...allProdDeelays },
  })),

  on(prods.setProductSelectedById, (state, { productById}) => ({
    ...state,
    productSelectedId: productById,
  }))
);

export function ProdReducer(state, action) {
  return _prodReducer(state, action);
}
//exportando el reducer para su uso por las demas dependencias a traves de Reducermap

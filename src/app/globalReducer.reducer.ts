import { ActionReducerMap } from "@ngrx/store";
import * as authReducers from "./components/authreducer.reducer";
import * as prodReducers from "./components/productReducer.reducer";

export interface GlobalAppState {
  authReducers: authReducers.State;
  prodReducers: prodReducers.StateProducts;
}
//Interface que traeria todo los reducer para luego ser exportado al app module como un todo

export const globalReducer: ActionReducerMap<GlobalAppState> = {
  authReducers: authReducers.AuthReducer,
  prodReducers: prodReducers.ProdReducer,
};
//Exportando todo el global reducer al appModule

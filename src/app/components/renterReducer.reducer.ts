import { createReducer, on } from "@ngrx/store";
import {
  AllRenter,
  DataRenter,
  PaymentIntentStripeResult,
  renterRentRoot,
  renterRentRootId,
  RenterRents,
  RootRenterRents,
} from "../interfaces/interfaces.interface";
import * as renters from "./renterAction.action";

export interface StateRenter {
  renterArray: AllRenter[];
  renter: renterRentRoot;
  rentIdSelected: renterRentRootId;
  closeRent: RenterRents[];
  openRents: RenterRents[];
  intentPayment:PaymentIntentStripeResult;
}
//Estableciendo la interfaz de este reducer en custion para el uso del token generado

export const initialState: StateRenter = {
  renterArray: null,
  renter: null,
  closeRent: null,
  openRents: null,
  rentIdSelected:null,
  intentPayment:null
};

const _renterReducer = createReducer(
  initialState,
  on(renters.setAllRenters, (state, { allRenters }) => ({
    ...state,
    renterArray: { ...allRenters },
  })),
  //fucnion que cambiaria el estado referente al seteo de todos los renters
  on(renters.setARenters, (state, { aRenter }) => ({
    ...state,
    renter: { ...aRenter },
  })),
  //fucnion que cambiaria el estado referente al seteo de un renter

  on(renters.setARentClosed, (state, { closedRents }) => ({
    ...state,
    closeRent: { ...closedRents },
  })),
  //fucnion que cambiaria el estado referente al seteo de un renter

  on(renters.setARentOnProcess, (state, { activeRents }) => ({
    ...state,
    openRents: { ...activeRents },
  })),
  //fucnion que cambiaria el estado referente al seteo de un renter

  on(renters.setARentById, (state, { aRentId }) => ({
    ...state,
    rentIdSelected: { ...aRentId },
  })),
  //fucnion que cambiaria el estado referente al seteo de un renter

  on(renters.setIdForConfirmPayment, (state, { resultIntentPaymentStripe }) => ({
    ...state,
    intentPayment: { ...resultIntentPaymentStripe },
  }))
  //fucnion que cambiaria el estado referente al seteo de un renter
);

export function RenterReducer(state, action) {
  return _renterReducer(state, action);
}
//exportando el reducer para su uso por las demas dependencias a traves de Reducermap

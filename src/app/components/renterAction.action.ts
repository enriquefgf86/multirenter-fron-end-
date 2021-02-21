import { AllRenter, PaymentIntentStripeResult, renterRentRoot, renterRentRootId, RenterRents, RootRenterRents } from './../interfaces/interfaces.interface';
import { createAction, props } from "@ngrx/store";
import { DataRenter } from "../interfaces/interfaces.interface";

export const setAllRenters = createAction(
  "[Renter settingReneters] setAllRenters",
  props<{ allRenters: AllRenter[] }>()
);
//creandose y exportandose la accion que setea el array de renters, vease que como data se le pasaria
//el props que hace referencia al tipo de data en cuestion  que acarrrearia dicha accion , que en este caso
//seria un objeto de tipo DataRenter

export const setARenters = createAction(
  "[Renter settingReneters] setARenters",
  props<{aRenter: renterRentRoot}>()
);
//creandose y exportandose la accion que setea el renter especifico, vease que como data se le pasaria
//el props que hace referencia al tipo de data en cuestion  que acarrrearia dicha accion , que en este caso
//seria un objeto de tipo DataRenter

export const setARentById = createAction(
  "[Renter settingReneters] setARentById",
  props<{aRentId: renterRentRootId}>()
);
//creandose y exportandose la accion que setea el rent especifico por id, vease que como data se le pasaria
//el props que hace referencia al tipo de data en cuestion  que acarrrearia dicha accion , que en este caso
//seria un objeto de tipo DataRenter

export const setARentClosed = createAction(
  "[Renter settingReneters] setARentClosed",
  props<{closedRents: RenterRents []}>()
);
//creandose y exportandose la accion que setea el renter especifico, vease que como data se le pasaria
//el props que hace referencia al tipo de data en cuestion  que acarrrearia dicha accion , que en este caso
//seria un objeto de tipo DataRenter

export const setARentOnProcess = createAction(
  "[Renter settingReneters] setARentOnProcess",
  props<{activeRents: RenterRents []}>()
);
//creandose y exportandose la accion que setea el renter especifico, vease que como data se le pasaria
//el props que hace referencia al tipo de data en cuestion  que acarrrearia dicha accion , que en este caso
//seria un objeto de tipo DataRenter

export const setIdForConfirmPayment=createAction(
  "[Renter settingReneters]setIdForConfirmPayment",
  props<{resultIntentPaymentStripe:PaymentIntentStripeResult}>()
)
//estableciendo la accion que triggerizaria el objeto entero del result sobre el 
//inteto de payment con stripe 

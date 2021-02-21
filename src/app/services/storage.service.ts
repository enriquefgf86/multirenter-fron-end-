//interfaces
import {
  AllImage,
  AllProductsSubType,
  AllProductsType,
  decodedToken,
  tokengenerated,
} from "./../interfaces/interfaces.interface";
//core angular services
import { Injectable } from "@angular/core";
//ionic storage
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  tokenInStorage: tokengenerated;
  decodedToken: any;
  userInStorage: boolean;
  productsTypeInStorage: AllProductsType[];
  productsSubTypeInStorage: AllProductsSubType[];
  imgSubTypeInStorage: AllImage[];

  constructor(private storage: Storage) {}

  /////////////////////////////////////////////////////clean storage///////////////////////////////////////////
  async cleanStorage() {
    
      await this.storage.remove("token").then(()=>console.log("token removed")),
      await this.storage.remove("tokenDecoded").then(()=>console.log("token removed")),
      await this.storage.remove("userIsAuth").then(()=>console.log("token removed"))
    
  }
  //service que posibilita la limpiezadel token generado en el storage

  /////////////////////////////////////////////////////get token in storage///////////////////////////////////////////
  getTokenInStorage() {
    return this.storage.get("token").then((token) => {
      // console.log(token);

      if (!token || token == null) {
        token = [];
      }
      this.tokenInStorage = token;
      console.log(this.tokenInStorage);

      return this.tokenInStorage;
    });
  }
  //obteniendo el token del storage parea su uso

  /////////////////////////////////////////////////////get prod type in Storage///////////////////////////////////////////
  getProdTypeInStorage() {
    return this.storage.get("productTypes").then((productsType) => {
      // console.log(productsType);

      if (!productsType || productsType == null) {
        productsType = [];
      }
      this.productsTypeInStorage = productsType;
      console.log(this.tokenInStorage);

      return this.productsTypeInStorage;
    });
  }
  //obteniendo el listatdo de tipos de producto en el storage

  /////////////////////////////////////////////////////get prod type in Storage///////////////////////////////////////////
  getProdSubTypeInStorage() {
    return this.storage.get("productSubTypes").then((productsSubType) => {
      // console.log(productsSubType);

      if (!productsSubType || productsSubType == null) {
        productsSubType = [];
      }
      this.productsSubTypeInStorage = productsSubType;
      console.log(this.tokenInStorage);

      return this.productsSubTypeInStorage;
    });
  }
  //obteniendo el listatdo de tipos de producto en el storage

  /////////////////////////////////////////////////////get prod type in Storage///////////////////////////////////////////
  getImgsSubTypeInStorage() {
    return this.storage.get("imagesSubTypes").then((imgSubType) => {
      // console.log(imgSubType);

      if (!imgSubType || imgSubType == null) {
        imgSubType = [];
      }
      this.imgSubTypeInStorage = imgSubType;
      console.log(this.tokenInStorage);

      return this.imgSubTypeInStorage;
    });
  }
  //obteniendo el listatdo de tipos de producto en el storage

  /////////////////////////////////////////////////////get user auth in storage///////////////////////////////////////////
  getUserIsAuthStorage() {
    return this.storage.get("userIsAuth").then((user: boolean) => {
      // console.log(token);

      if (!user || user == null) {
        user = false;
      }
      this.userInStorage = user;
      console.log(this.userInStorage);

      return this.userInStorage;
    });
  }
  /////////////////////////////////////////////get decoded token in storage///////////////////////////////////////////
  getDecodedTokenInStorage() {
    this.storage.get("decodedToken").then((token) => {
      // console.log(token);

      if (!token || token == null) {
        token = [];
      }
      this.decodedToken = token;
      console.log(this.decodedToken);

      return this.decodedToken;
    });
  }
  //obteniendo el token del storage parea su uso

  ///////////////////////////////////////////set token instorage///////////////////////////////////////////
  async setTokenInstorage(token: tokengenerated) {
    // await this.cleanStorage();
    this.storage.set("token", token).then(() => {
      console.log("token settled");
    });
  }
  //seteando el token en el storage

  ///////////////////////////////////////////set user auth instorage///////////////////////////////////////////
  async setUserAuthInstorage(user: boolean) {
    // await this.cleanStorage();
    this.storage.set("userIsAuth", user).then(() => {
      console.log("user auth settled");
    });
  }
  //seteando el token en el storage

  /////////////////////////////////////////////set decoded token in storage///////////////////////////////////////////
  async setDecodedTokenInstorage(decoded: decodedToken) {
    // await this.cleanStorage();
    this.storage.set("tokenDecoded", decoded).then(() => {
      console.log("Decoded token settled");
    });
  }
  //seteando el token en el storage

  /////////////////////////////////////////////set decoded token in storage///////////////////////////////////////////
  async setAllProdTypesInStorage(prodTypes: AllProductsType[]) {
    // await this.cleanStorage();
    this.storage.set("productTypes", prodTypes).then(() => {
      console.log("productTypes settled");
    });
  }
  //seteando el listado de productos  en el storage

  /////////////////////////////////////////////set decoded token in storage///////////////////////////////////////////
  async setAllProdSubTypesInStorage(prodSubTypes: AllProductsSubType[]) {
    // await this.cleanStorage();
    this.storage.set("productSubTypes", prodSubTypes).then(() => {
      console.log("productSubTypes settled");
    });
  }
  //seteando el listado de productos  en el storage

  /////////////////////////////////////////////set imgs en stroage///////////////////////////////////////////
  async setAllImgSubTypesInStorage(imgSubTypes: AllImage[]) {
    // await this.cleanStorage();
    this.storage.set("imagesSubTypes", imgSubTypes).then(() => {
      console.log("imagesSubTypes settled");
    });
  }
  //seteando el listado de imagenes  en el storage

  isValidtoken(): tokengenerated {
    let token: tokengenerated;
    this.storage
      .get("token")
      .then((data) => {
        token = data;
      })
      .catch((error) => {
        console.log(error);
      });
    return token;
  }
}

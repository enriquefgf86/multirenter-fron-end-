import { async } from "@angular/core/testing";
import { userAuth } from "./../components/authAction.action";
//services
import { DecoderTokenService } from "./decoder-token.service";
import { StorageService } from "./storage.service";
//interfaces
import {
  Data,
  decodedToken,
  ListofProduct,
  PaymentIntent,
  PaymentIntentStripeResult,
  renterRentRoot,
  RootAllRenters,
  RootProdFee,
  RootProductPrice,
  RootRenterRents,
  RootRenterRentsById,
  RootResponse,
  SignUp,
  StattusSuccessImges,
  StatusSuccessProdSubType,
  StatusSuccessProdType,
  tokengenerated,
} from "./../interfaces/interfaces.interface";
//environment
import { environment } from "./../../environments/environment.prod";
//angular http
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
//core service angular
import { EventEmitter, Injectable } from "@angular/core";
//ionic storage
import { Storage } from "@ionic/storage";
//router
import { Router } from "@angular/router";
//redux
import { Store } from "@ngrx/store";
import { GlobalAppState } from "../globalReducer.reducer";
import * as actionsAuth from "../components/authAction.action";
import * as actionsProd from "../components/productAction.action";
import * as actionsRenter from "../components/renterAction.action";
//decoder jwt
import jwt_decode from "jwt-decode";
//rxjs
import { catchError, map, tap } from "rxjs/operators";
import { of as observableOf, Observable, of } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
//ionic core
import { LoadingController, ToastController } from "@ionic/angular";

const grantType = environment.congfigGrant;
const grantType_RefreshToken = environment.configRefresh;
const url = environment.url;
//url seteado en el environment de manera parcial

@Injectable({
  providedIn: "root",
})
export class HttpsService {
  tokenStoraged: string;

  stateBoolean: boolean;

  public authDetection: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private storage: Storage,
    private router: Router,
    private stateStore: Store<GlobalAppState>,
    private decodingService: DecoderTokenService,
    private imgDownLoaderFirebase: AngularFireStorage,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}
  //////////////////////////////////////////login user///////////////////////////////////
  async loginUser(username: string, password: string) {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //Variables correspondiento a Authoriztion Headers
    await this.storageService.cleanStorage();

    // console.log(this.tokenStoraged);
    const bodyParams = new URLSearchParams();

    bodyParams.set("username", username);
    bodyParams.set("password", password);
    bodyParams.set("grant_type", grantType);
    //parametros para el login en el body

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authorizationCredentials}`,
    });
    //Estableciendo los headers(Authorizacion y ContentType(urlencoded))
    console.log(headers);

    return fetch(`${url}/security/oauth/token?${bodyParams}`, {
      method: "POST", //metodo

      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authorizationCredentials}`,
      }, //headers
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        let auth: boolean = true;
        await this.storageService.setTokenInstorage(data);
        //seteando el token en ele storage

        this.storage.get("token").then((data: tokengenerated) => {
          if (data == null || data == undefined) {
            return;
          }
          this.tokenStoraged = data.access_token;
        });
        //obteniendo token del storage una vez

        let decodedJson: decodedToken = await jwt_decode(data.access_token);
        console.log(decodedJson);
        //establecidno variable con decodificador de json para su uso

        await this.storageService.setDecodedTokenInstorage(decodedJson);
        //establecidnod el token decodificado  generado en el storage

        await this.storageService.setUserAuthInstorage(auth);
        //establecidnod el usuario autenticado en el storage

        await this.stateStore.dispatch(actionsAuth.setToken({ token: data }));
        //accediendo al global state de la aplicacion para el uso de los valores que
        //en ella se almacenan , en este caso  se setea el token generado en la mismma
        //a traves del el metodo inicializado en la accion  settoken , pasandosele como
        //prop un objeto que contendria como value la data (token generado)

        await this.stateStore.dispatch(
          actionsAuth.decodingToken({ decoded: decodedJson })
        );
        //estableciendo el token decodificado en el store
        await this.stateStore.dispatch(actionsAuth.userAuth());
        //estableciendo el token decodificado en el store

        this.emittingAuthState();
        //llamando el metodo que triggeriza una accion emitter cualesquiera que esta sea

        let message = "User logged";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion

        this.decodingService
          .imageRetrieverUser(decodedJson.renterImg)
          .then((data) => {
            console.log(data);
          });
        //obteneindo la imagen del usuario autenticado , del serivico de decodingService
      })
      .catch((err) => {
        if (err.status == 504) {
          let message = "Delay late latency ,wait little more...";
          this.presentToast(message);
          this.loginUser(username, password);
        }
        if (err.status == 401) {
          let message = "You don't have permission";
          this.presentToast(message);
        }
        if (err.message == "Invalid token specified") {
          let message =
            "Could not sign up. Problem with token , get in touch with administraror";
          this.presentToast(message);
        }
        console.log(err);
      });
    //proceso del fetch que resume los readers y el call al endpoint con los headers
    //y el token de autorizacion para el llamado al metodo haciendo una variante mas segura
    //en vez de utilizar angular http methods

    // return this.http
    //   .post<tokengenerated>(
    //     `${url}/security/oauth/token`,
    //     bodyParams.toString(),
    //     {
    //       headers: headers,
    //     }
    //   )
    //   .toPromise() //suscribiendonos al metodo para una vez llamdado el endpoint proceder a log in el usuario
    //   .then(async (data: tokengenerated) => {
    //     console.log(data);
    //     let auth: boolean = true;
    //     await this.storageService.setTokenInstorage(data);
    //     //seteando el token en ele storage

    //     this.storage.get("token").then((data: tokengenerated) => {
    //       if (data == null || data == undefined) {
    //         return;
    //       }
    //       this.tokenStoraged = data.access_token;
    //     });
    //     //obteniendo token del storage una vez

    //     let decodedJson: decodedToken = await jwt_decode(data.access_token);
    //     console.log(decodedJson);
    //     //establecidno variable con decodificador de json para su uso

    //     await this.storageService.setDecodedTokenInstorage(decodedJson);
    //     //establecidnod el token decodificado  generado en el storage

    //     await this.storageService.setUserAuthInstorage(auth);
    //     //establecidnod el usuario autenticado en el storage

    //     await this.stateStore.dispatch(actionsAuth.setToken({ token: data }));
    //     //accediendo al global state de la aplicacion para el uso de los valores que
    //     //en ella se almacenan , en este caso  se setea el token generado en la mismma
    //     //a traves del el metodo inicializado en la accion  settoken , pasandosele como
    //     //prop un objeto que contendria como value la data (token generado)

    //     await this.stateStore.dispatch(
    //       actionsAuth.decodingToken({ decoded: decodedJson })
    //     );
    //     //estableciendo el token decodificado en el store
    //     await this.stateStore.dispatch(actionsAuth.userAuth());
    //     //estableciendo el token decodificado en el store

    //     this.emittingAuthState();

    //     this.decodingService
    //       .imageRetrieverUser(decodedJson.renterImg)
    //       .then((data) => {
    //         console.log(data);
    //       });
    //   });
    //proceso de Login del usuario en donde a la vez se setena valores en el store y en redux desde el servicio
  }

  //////////////////////////////////////////sign up user///////////////////////////////////
  signUpUser(
    renterEmail: string,
    renterName: string,
    renterPassword: string,
    renterImg?: string
  ) {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //Variables correspondiento a Authoriztion Headers referentes al secret y password del
    //front end user

    const headers = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Basic " + authorizationCredentials,
    });
    //Estableciendo los valoreses en los headers necesarios para el
    //proceso

    const body = {
      renterEmail: renterEmail,
      renterName: renterName,
      renterPassword: renterPassword,
      renterImg: renterImg,
    };
    //Passing the raw body para luego proceder a su stringyfy

    return this.http.post<any>(
      `${url}/renter/create/renter`,
      JSON.stringify(body),
      {
        headers: headers,
      }
    );
    //Proceso de sign up del usuario
  }

  //////////////////////////////////////////log out user///////////////////////////////////
  async logOutUser() {
    await this.storageService.cleanStorage();
    await this.stateStore.dispatch(actionsAuth.resetStore()); //reseteando el store

    this.getAllProducts();

    const authorizationCredentials1 = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //Variables correspondiento a Authoriztion Headers

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;

    return fetch(`${url}/renter/logout/renter`, {
      method: "POST", //metodo

      headers: {
        "Content-type":
          "application/json; charset=UTF-8;application/x-www-form-urlencoded",
        Authorization: `Bearer  ${token}`,
      }, //headers
    })
      .then((res) => res.json())
      .then(async (data) => {
        // this.emittingAuthState();

        console.log(data); //log d ela data que se trae
        await this.storageService.cleanStorage(); //limpiando el storage

        await this.stateStore.dispatch(actionsAuth.resetStore()); //reseteando el store

        await this.getAllProducts();

        this.router.navigate(["/tabs/tab6"]); //finalmente navegando a la pagina de signUp

        let message = "User logged out";

        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      })

      .catch((err) => {
        console.log(err);
        let message =
          "Problem in the loggin out , get in tpouch with administrator ";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
    //proceso del fetch que resume los readers y el call al endpoint con los headers
    //y el token de autorizacion para el llamado al metodo haciendo una variante mas segura
    //en vez de utilizar angular http methods
  }

  ///////////////////////////////renew token/////////////////////////////////////////////
  renewToken(): Observable<boolean> {
    // tokenInStorage: string

    let tokenInSettledStorage: tokengenerated;

    this.storageService.getTokenInStorage();

    if (this.storageService.tokenInStorage) {
      tokenInSettledStorage = this.storageService.tokenInStorage;

      console.log(tokenInSettledStorage);

      const authorizationCredentials = btoa(
        environment.configId + ":" + environment.configSecret
      );

      const bodyParams = new URLSearchParams();

      bodyParams.set("grant_type", grantType_RefreshToken);
      // bodyParams.set(grantType_RefreshToken, tokenInStorage);
      bodyParams.set(
        grantType_RefreshToken,
        tokenInSettledStorage.refresh_token
      );

      //parametros para el refreshtoken en el body

      const headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + authorizationCredentials,
      });
      //Estableciendo los headers(Authorizacion y ContentType(urlencoded))
      console.log(headers);

      return this.http
        .post<tokengenerated>(
          `${url}/security/oauth/token`,
          bodyParams.toString(),
          {
            headers: headers,
          }
        )
        .pipe(
          tap(async (response: tokengenerated) => {
            await this.storageService.setTokenInstorage(response);
            //seteando el token en ele storage

            let user: boolean = true;
            //variable que define el user  status en la aplicacion

            await this.storageService.setUserAuthInstorage(user);
            //seteando el user en el storage

            let decodedJson: decodedToken = await jwt_decode(
              response.access_token
            );
            console.log(decodedJson);
            //establecidno variable con decodificador de json para su uso

            await this.storageService.setDecodedTokenInstorage(decodedJson);
            //establecidnod el token decodificado  generado en el storage

            await this.stateStore.dispatch(
              actionsAuth.setToken({ token: response })
            );
            //accediendo al global state de la aplicacion para el uso de los valores que
            //en ella se almacenan , en este caso  se setea el token generado en la mismma
            //a traves del el metodo inicializado en la accion  settoken , pasandosele como
            //prop un objeto que contendria como value la response (token generado)

            await this.stateStore.dispatch(
              actionsAuth.decodingToken({ decoded: decodedJson })
            );
            //estableciendo el token decodificado en el store

            console.log("token renewed : " + response);

            let message = "User with tooken renewed";
            this.presentToast(message);
            // presentando taster con la finalizacion de la accion

            this.decodingService.imageRetrieverUser(decodedJson.renterImg);
          }),
          map((response) => true),
          catchError((err) => observableOf(false))
        );
    } else return;
  }

  ///////////////////////////////////user is authenticated funcion //////////////////
  userIsauthenticated() {
    return this.stateStore.select("authReducers").pipe(
      map((data) => {
        console.log(data.userAuth);

        return data.userAuth;
      })
    );
  }
  //esta funcion seria un complemento para la siguiente pues en la misma se accede al estado del usuario en el
  //general state del store verificando si el mismo es null o true retornandose un booleano. Luego remitiendose a esta
  //funcion a traves del metodo pipe que mediante un map tendria la posibilidad de mutar a un resultado
  //observable que podria ser utilizado por el guard para autorizar o no

  ///////////////////////////////////user is authenticated funcion //////////////////
  isAuth() {
    return this.userIsauthenticated().pipe(
      map((existence) => existence != null)
    );
  }
  //tras la fucnio  previa este metodo seria el encargado de arrojar un resultado modificado mediante map
  //arrojando un bolleano que seria observado por el guard para su accion correspondiente

  ///////////////////////////////////get all products //////////////////
  async getAllProducts() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Getting All Products, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //seteando el loader
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //variables contenedora de los headers

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //Estableciendo los headers(Authorizacion y ContentType(urlencoded))
    return this.http
      .get<any>(
        `${url}/product/all/products`,

        {
          headers: headers,
        }
      ) //pasando el call al endpoint con los headers
      .toPromise()
      .then(async (data: RootResponse) => {
        data;

        console.log(data);

        loading.dismiss();
        //seteando el loader off

        this.stateStore.dispatch(
          actionsProd.setAllProducts({
            allProductsToSet: data.data.list_ofProducts,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
        if (err.status == 504) {
          let message = "Delay late latency ,wait little more...";
          this.presentToast(message);
          this.getAllProducts();
        }
        //seteando el loader off
      });
    //vease que despues de resuleta la promesa se procede a obtener lo traido desde el endpoint
    //y se procede a extraer su data del tipo de INterfacedata, para posteriormente mediante
    //una accion del reducer , proceder a plasmar toda esa informacion
  }

  ///////////////////////////////////get all products //////////////////
  async getAllRenters() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Getting All Products, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //seteando el loader
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //variables contenedora de los headers

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //Estableciendo los headers(Authorizacion y ContentType(urlencoded))
    return this.http
      .get<RootAllRenters>(
        `${url}/renter/all/renters`,

        {
          headers: headers,
        }
      ) //pasando el call al endpoint con los headers
      .toPromise()
      .then(async (data: RootAllRenters) => {
        data;

        console.log(data);

        loading.dismiss();
        //seteando el loader off

        this.stateStore.dispatch(
          actionsRenter.setAllRenters({ allRenters: data.data.all_renters })
        );

        let message = "All renters obtained";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
        if (err.status == 504) {
          let message = "Delay late latency ,wait little more...";
          this.presentToast(message);
          this.getAllRenters();
        }
        //seteando el loader off
      });
    //vease que despues de resuleta la promesa se procede a obtener lo traido desde el endpoint
    //y se procede a extraer su data del tipo de AllRenter, para posteriormente mediante
    //una accion del reducer , proceder a plasmar toda esa informacion
  }

  ///////////////////////////////////delete user //////////////////
  async deleteUser(adminId, renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Disabling Renter, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //seteando el loader
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //variables contenedora de los headers

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,
    });
    //estableciendo los headers

    const bodyParams = new URLSearchParams();
    bodyParams.set("renterDeleter", adminId);
    //estableciendo el body params que traeria el usuario  con autorizacion
    //para eliminar

    return fetch(`${url}/renter/renter/delete/id/${renterId}?${bodyParams}`, {
      method: "PUT", //metodo

      headers: {
        "Content-type":
          "application/json; charset=UTF-8;application/x-www-form-urlencoded",
        Authorization: `Bearer  ${token}`,
      }, //headers pasados en elmetodo incluyendo el token de autorizacion
    })
      .then((res) => res.json())
      .then(async (data) => {
        loading.dismiss();
        //seteando el loader off

        this.stateStore.dispatch(
          actionsRenter.setAllRenters({ allRenters: data.data.all_renters })
        );
        //estableciendo los renters en el redux con la nueva modificacion
      })

      .catch((err) => {
        loading.dismiss();
        //seteando el loader off
        console.log(err);
      });

    //vease que despues de resuleta la promesa se procede a obtener lo traido desde el endpoint
    //y se procede a extraer su data del tipo de AllRenter, para posteriormente mediante
    //una accion del reducer , proceder a plasmar toda esa informacion
  }

  ////////////////////////emiter of auth state ///////////////////////
  emittingAuthState() {
    this.authDetection.emit();
  } //triggerizador de puente para activar un metodo en exte caso el metodo de updtae
  //el user statusCombo

  //////////////////////////////////get all products types////////////////////////////////////
  getAllProdtypes() {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //estableciendo los headers

    return this.http
      .get<StatusSuccessProdType>(
        `${url}/product/all/product/types`,

        {
          headers: headers,
        }
      )
      .toPromise()
      .then((data) => {
        console.log(data);

        this.stateStore.dispatch(
          actionsProd.setAllProductsType({
            allProductsTypeToSet: data.data.allProductsType,
          })
        );
        this.storageService.setAllProdTypesInStorage(data.data.allProductsType);
      })
      .catch((err) => {
        console.log(err);
      }); //pasando el call al endpoint con los headers
  }

  //////////////////////////////////get all products sub  types////////////////////////////////////
  getAllProdSubTypes() {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //estableciendo los headers

    return this.http
      .get<StatusSuccessProdSubType>(
        `${url}/product/all/product/subtypes`,

        {
          headers: headers,
        }
      )
      .toPromise()
      .then((data) => {
        console.log(data);

        this.stateStore.dispatch(
          actionsProd.setAllProductsSubType({
            allProductsSubTypeToSet: data.data.allProductsSubTypes,
          })
        );
        this.storageService.setAllProdSubTypesInStorage(
          data.data.allProductsSubTypes
        );
      })
      .catch((err) => {
        console.log(err);
      });
    //pasando el call al endpoint con los headers
  }

  //////////////////////////////////get all images sub  types////////////////////////////////////
  async getAllimgSubTypes() {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    // const loading = await this.loadingController.create({
    //   cssClass: "my-custom-class",
    //   message: "Getting All Images...",
    // });

    // loading.present();
    // // Estableciendo loader en el proceso;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //estableciendo los headers

    return this.http
      .get<StattusSuccessImges>(
        `${url}/product/all/imgs`,

        {
          headers: headers,
        }
      ) //endpont de llamda
      .toPromise() //resolviendo la promesa a para posteriormente proceder a ejecutar ciertas tareas
      .then(async (data) => {
        console.log(data);

        // let arrayOfImgSubTypes = await Object.keys(data.data.allImages).map(
        //   (result) => {
        //     return data.data.allImages[result];
        //   }
        // );

        // let arrayReceptor = [];
        // let object;

        // await arrayOfImgSubTypes.forEach((result) => {
        //   this.imgDownLoaderFirebase
        //     .ref(result.url)
        //     .getDownloadURL()
        //     .toPromise()
        //     .then((url) => {
        //       // console.log(result);

        //       result = { ...result };

        //       // console.log(result);

        //       result.url = url;

        //       arrayReceptor.push(result);

        //       object = Object.assign({}, arrayReceptor);

        //       // console.log(object);

        //     });
        // });

        this.stateStore.dispatch(
          actionsProd.setAllImgSubType({
            allImages: data.data.allImages,
          })
        );
        //despelegando a redux las imagens traidas en el request

        // loading.dismiss();
        // // Estableciendo el fin del  loader en el proceso;

        this.storageService.setAllImgSubTypesInStorage(data.data.allImages);
        //Poniendo en el storage las images traidas
      })
      .catch((err) => {
        console.log(err);
        // loading.dismiss();
        // // Estableciendo el fin del  loader en el proceso;
      });
    //pasando el call al endpoint con los headers
  }

  //////////////////////////////////////create image//////////////////////////////////////
  async createImage(imageUrl: string, productSubTypeId, renterId) {
    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers

    const body = {
      url: imageUrl,
    };
    //Passing the raw body para luego proceder a su stringyfy

    // console.log(this.tokenStoraged);
    const bodyParams = new URLSearchParams();

    bodyParams.set("productSubType", productSubTypeId);
    bodyParams.set("renterId", renterId);
    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .post<any>(
        `${url}/product/create/img?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllimgSubTypes();

        let message = "Image Created";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      })
      .catch((err) => {
        console.log(err);
        let message =
          "Some error happened , please get in touch with adminstrator";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////create product//////////////////////////////////////////////
  async createProduct(
    productName: String,
    productSubType,
    productType,
    productFeeDelay,
    productPrice,
    renterId
  ) {
    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers
    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    //parametros que irian en el url como chequeo del usuario que crea

    const body = {
      productName: productName,
      productSubType: { id: productSubType },
      productType: { id: productType },
      productFeeDelay: { id: productFeeDelay },
      productPrice: { id: productPrice },
      productInventary: { id: 2 },
    };
    //Por algun motivo raro el body no se me esta deserializando por lo que es necesario
    //especificar de cada elemento pasado en el body , lo que s eva a requerir
    //que en este caso seria los id  de cada uno de ellos .Vease que el productName al ser
    //un string no haria falta deserializarlo

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .post<any>(
        `${url}/product/product/create/product?${finalBodyParams}`,
        body,
        { headers: headers }
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProducts();
        let message = "Product Created";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      })
      .catch(
        (err) => {
          console.log(err);
          let message = "Something went wrong , get in touch with admin ";
          this.presentToast(message);
        }
        // presentando taster con la finalizacion de la accion
      );
  }

  ///////////////////////////////////////get all products prices////////////////////////////////
  async getAllProductPrices() {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //estableciendo los headers

    this.http
      .get<RootProductPrice>(`${url}/product/all/products/prices`, {
        headers: headers,
      })
      .toPromise()
      .then((data) => {
        console.log(data.data.all_prices);

        this.stateStore.dispatch(
          actionsProd.setAllProductPrices({
            allProdPrices: data.data.all_prices,
          })
        );
        //guardando en redux el listado de precios  por productos
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
    //imprimiendo error en caso de fallo
  }

  ///////////////////////////////////////get all products fees////////////////////////////////
  async getAllProductFees() {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + authorizationCredentials,
    });
    //estableciendo los headers

    this.http
      .get<RootProdFee>(`${url}/product/all/products/fees`, {
        headers: headers,
      })
      .toPromise()
      .then((data) => {
        console.log(data.data.all_feeDeelays);

        this.stateStore.dispatch(
          actionsProd.setAllProductDeelaysMount({
            allProdDeelays: data.data.all_feeDeelays,
          })
        );
        //guardando en redux el listado de fees por productos
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
    //imprimiendo error en caso de fallo
  }

  //////////////////////////////////////create prodSubtype//////////////////////////////////////
  async createProdSubType(productSubTypeName: string, renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Creating Sub Type of Product, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers

    const body = {
      productSubTypeName: productSubTypeName,
    };
    //Passing the raw body para luego proceder a su stringyfy

    // console.log(this.tokenStoraged);
    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .post<any>(
        `${url}/product/create/product/subtype?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProdSubTypes();

        loading.dismiss();
        // Estableciendo el fin del loader en el proceso;

        let message1 = "Product Sub Type Created";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message1);
        // presentando taster con la finalizacion de la accion
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////add comment on product//////////////////////////////////////
  async addCommentInProduct(
    comment: string,
    productId: number,
    renterId: number
  ) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Adding Comment, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers

    const body = {
      commentBody: comment,
    };
    //Passing the raw body para luego proceder a su stringyfy

    return this.http
      .post<any>(
        `${url}/product/product/id/${productId}/renter/id/${renterId}/add/comment`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProducts();

        loading.dismiss();
        // Estableciendo el fin del loader en el proceso;
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
        // Estableciendo el fin del loader en el proceso;

        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////create rent//////////////////////////////////////
  async rentingProduct(rentDays: number, productId, renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Making the operation, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers

    const body = {
      rentDays: rentDays,
    };
    //Passing the raw body para luego proceder a su stringyfy

    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    //parametros para el login en el body

    return this.http
      .post<any>(
        `${url}/rent/rents/rent/${productId}/product?${bodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProducts();

        loading.dismiss();
        // Estableciendo el fin del loader en el proceso;

        let message1 = "Product Rented";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message1);
        // presentando taster con la finalizacion de la accion
      })
      .catch((err) => {
        console.log(err);
        loading.dismiss();
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////create prodtype//////////////////////////////////////
  async createProdType(productTypeName: string, renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Creating Type of Product, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers

    const body = {
      productTypeName: productTypeName,
    };
    //Passing the raw body para luego proceder a su stringyfy

    // console.log(this.tokenStoraged);
    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .post<any>(
        `${url}/product/create/product/type?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProdtypes();

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message1 = "Producttype Created";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message1);
        // presentando taster con la finalizacion de la accion
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  ////////////////////////////////////////////////////get product by id///////////
  async editProductById(
    productName: string,
    productPrice,
    productFeeDelay,
    productId,
    renterId
  ) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Creating Type of Product, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,

      // ;
    });
    //estableciendo los headers

    const body = {
      productName: productName,
      productPrice: { id: productPrice },
      productFeeDelay: { id: productFeeDelay },
    };
    //Passing the raw body para luego proceder a su stringyfy

    // console.log(this.tokenStoraged);
    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    bodyParams.set("productId", productId);
    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .put<any>(
        `${url}/product/product/edit/product?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getProductById(productId);
        this.getAllProducts();

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message = "Product Edited correctly";
        this.presentToast(message);
        //adicionando el toaster que indica el fin de la accion
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  ////////////////////////////////////////////////////get product by id///////////
  async getProductById(productId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Getting the product ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Basic ${authorizationCredentials}`,
    });
    //estableciendo los headers

    return this.http
      .get<any>(
        `${url}/product/product/id/${productId}`,
        //psando los parametros del url
        //concatenados al url del endpoint

        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then(async (data) => {
        console.log(data);

        await this.stateStore.dispatch(
          actionsProd.setProductSelectedById({ productById: data.data.product })
        );

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////get product subtype by id///////////
  async editProductSubById(
    productSubTypeName: string,
    productSubTypeId,
    renterId
  ) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Editing Sub Type Product, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,
    });
    //estableciendo los headers

    const body = {
      productSubTypeName: productSubTypeName,
    };
    //Passing the raw body para luego proceder a su stringyfy

    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    bodyParams.set("productSubTypeId", productSubTypeId);
    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .put<any>(
        `${url}/product/product/edit/product/subtype?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProdSubTypes();

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message = "Product Sub Type  Edited correctly";
        this.presentToast(message);
        //adicionando el toaster que indica el fin de la accion
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////get product Type by id///////////
  async editImageSubTypeById(
    imgUrl: string,
    imgSubTypeId,
    productSubTypeId,
    renterId
  ) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Editing image, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,
    });
    //estableciendo los headers

    const body = {
      url: imgUrl,
    };
    //Passing the raw body para luego proceder a su stringyfy

    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    bodyParams.set("productSubTypeId", productSubTypeId);
    bodyParams.set("imgSubTypeId", imgSubTypeId);

    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .put<any>(
        `${url}/product/product/edit/product/img/subtype?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllimgSubTypes();

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message = "Image Edited correctly";
        this.presentToast(message);
        //adicionando el toaster que indica el fin de la accion
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////get product Type by id///////////
  async editProducTypeById(productTypeName: string, productTypeId, renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Editing Type Product, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,
    });
    //estableciendo los headers

    const body = {
      productTypeName: productTypeName,
    };
    //Passing the raw body para luego proceder a su stringyfy

    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    bodyParams.set("productTypeId", productTypeId);
    //parametros para el login en el body

    const bodyFinal = JSON.stringify(body);
    const finalBodyParams = bodyParams.toString();
    //Convirtiendo a string el body raw y el body params para posteriormente
    //pasarlo como objeto en el request

    return this.http
      .put<any>(
        `${url}/product/product/edit/product/type?${finalBodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint
        JSON.stringify(body),
        //pasando ell body roaw medinate stringify
        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.getAllProdtypes();

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message = "Product Type  Edited correctly";
        this.presentToast(message);
        //adicionando el toaster que indica el fin de la accion
      })
      .catch((err) => {
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////get renter by id///////////
  async findRenterById(renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Getting renter Data, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,
    });
    //estableciendo los headers

    return this.http
      .get<any>(
        `${url}/renter/renter/id/${renterId}/all/rents`,
        //psando los parametros del url
        //concatenados al url del endpoint

        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data) => {
        console.log(data);
        this.stateStore.dispatch(
          actionsRenter.setARenters({ aRenter: data.data })
        );
        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message = "Data Ready";
        this.presentToast(message);
        //adicionando el toaster que indica el fin de la accion
      })
      .catch((err) => {
        loading.dismiss();
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  //////////////////////////////////////get rent by id///////////
  async findRentById(rentId, renterId) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Getting rent Data, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const headers = new HttpHeaders({
      "Content-Type": " application/json;charset=UTF-8;",
      Authorization: `Bearer ${token}`,
    });
    //estableciendo los headers

    const bodyParams = new URLSearchParams();

    bodyParams.set("renterId", renterId);
    //parametros para el login en el body

    return this.http
      .get<any>(
        `${url}/rent/rent/${rentId}?${bodyParams}`,
        //psando los parametros del url
        //concatenados al url del endpoint

        {
          headers: headers,
        }
        //pasando los headers
      )
      .toPromise()
      .then((data: RootRenterRentsById) => {
        console.log(data.data.rent_selected);
        if (data.data.rent_selected) {
          this.stateStore.dispatch(
            actionsRenter.setARentById({ aRentId: data.data })
          );
          this.getProductById(data.data.rent_selected.rent_product_by_id);
        }

        loading.dismiss();
        // Estableciendo el fin del  loader en el proceso;

        let message = "Data Ready";
        this.presentToast(message);
        //adicionando el toaster que indica el fin de la accion
      })
      .catch((err) => {
        loading.dismiss();
        console.log(err);
        let message1 = "Ok";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  ////////////////////////////////////////devolution of rent by id /////////
  async devolutionrentByid(
    rentRealDays,
    rentId: number,
    productId: number,
    renterId
  ) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Finalizing Operation, Please Wait ...",
    });
    //Loader para creacion del usuario propio de ionic

    loading.present();
    //seteando el loader
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    //variables contenedora de los headers

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    // const headers = new HttpHeaders({
    //   "Content-Type": " application/json;charset=UTF-8;",
    //   Authorization: `Bearer ${token}`,
    // });
    // //estableciendo los headers

    const body = { rentRealDays: rentRealDays };
    //estableciendo el body  los dias reales de renta
    //para eliminar

    const bodyParams = new URLSearchParams();
    bodyParams.set("renterId", renterId);
    //estableciendo el body params que traeria el usuario  con autorizacion
    //para devolver

    return fetch(
      `${url}/rent/rents/rent/${productId}/${rentId}/devolution?${bodyParams}`,
      {
        method: "PUT", //metodo
        body: JSON.stringify(body),
        headers: {
          "Content-type":
            "application/json; charset=UTF-8;application/x-www-form-urlencoded",
          Authorization: `Bearer  ${token}`,
        }, //headers pasados en elmetodo incluyendo el token de autorizacion
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);

        this.getAllProducts();
        //llamando todos los prodcutos de nuevo actualizados
        loading.dismiss();
        //seteando el loader off

        let message1 = "Devolution done";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message1);
        // presentando taster con la finalizacion de la accion
      })

      .catch((err) => {
        loading.dismiss();
        //seteando el loader off
        console.log(err);
        let message1 = "Devolution done";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }
  //vease que despues de resuelta la promesa se procede a obtener lo traido desde el endpoint
  //y se procede a extraer su data del tipo de AllRenter, para posteriormente mediante
  //una accion del reducer , proceder a plasmar toda esa informacion

  ////////////////////////////////////////notificador toast de fin de acciones///////
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  /////////////////////////error 504 retrier/////////////////
  retrier(method) {
    return method;
  }

  ///////////////////////////payment stripe method////////////////////////
  async paymentIntentFunction(renterName:string,renterEmail:string,description: string, amount) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Connecting for payment, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const body = {  amount: amount*100,description: description };
    body.toString();
    //este body hace referencia al payment object inicializado en el objeto

    return fetch(`${url}/rent/rents/rent/payment/stripe/intent`, {
      method: "POST", //metodo
      body: JSON.stringify(body),
      headers: {
        "Content-type":
          "application/json",
        Authorization: `Bearer  ${token}`,
      }, //headers pasados en elmetodo incluyendo el token de autorizacion
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
       let dataResultIntent:PaymentIntentStripeResult=await  JSON.parse( data.data)

       this.paymentConfirmStripeFunction(dataResultIntent.id,renterName,renterEmail)



        this.getAllProducts();
        //llamando todos los prodcutos de nuevo actualizados
       
        loading.dismiss();
        //seteando el loader off

        let message1 = "Rent paid ";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message1);
        // presentando taster con la finalizacion de la accion
      })

      .catch((err) => {
        loading.dismiss();
        //seteando el loader off
        console.log(err);
        let message1 = "Rent paid ";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }

  ///////////////////////////payment confirm stripe method////////////////////////
  async paymentConfirmStripeFunction(paymentIdCode: string,currentName: string,mailReceiver:string) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Confirming for payment, Please Wait ...",
    });

    loading.present();
    // Estableciendo loader en el proceso;

    const authorizationCredentials = await btoa(
      environment.configId + ":" + environment.configSecret
    );
    //inicializando las variables de header

    let token: string = (await this.storageService.getTokenInStorage())
      .access_token;
    //accediendo  al token del storage para asignarlo a l valor  del authorization  en el
    //apartado de Bearer

    const body = {  paymentIdCode: paymentIdCode,currentName: currentName,mailReceiver:mailReceiver };
    body.toString();
    //este body hace referencia al payment object inicializado en el objeto

    return fetch(`${url}/rent/rents/rent/payment/stripe/confirm`, {
      method: "POST", //metodo
      body: JSON.stringify(body),
      headers: {
        "Content-type":
          "application/json",
        Authorization: `Bearer  ${token}`,
      }, //headers pasados en elmetodo incluyendo el token de autorizacion
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
       console.log( JSON.parse( data.data))

       
        loading.dismiss();
        //seteando el loader off

        let message1 = "Payment Confirmed ";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message1);
        // presentando taster con la finalizacion de la accion
      })

      .catch((err) => {
        loading.dismiss();
        //seteando el loader off
        console.log(err);
        let message1 = "Rent paid ";
        let message = "Something went wrong , get in touch with admin";
        this.presentToast(message);
        // presentando taster con la finalizacion de la accion
      });
  }
}

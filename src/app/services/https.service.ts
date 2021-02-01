import { userAuth } from "./../components/authAction.action";
//services
import { DecoderTokenService } from "./decoder-token.service";
import { StorageService } from "./storage.service";
//interfaces
import {
  Data,
  decodedToken,
  ListofProduct,
  RootProdFee,
  RootProductPrice,
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
//decoder jwt
import jwt_decode from "jwt-decode";
//rxjs
import { map } from "rxjs/operators";
import { of as observableOf, Observable } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";
//ionic core
import { LoadingController } from "@ionic/angular";

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
    private loadingController: LoadingController
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
      .toPromise() //suscribiendonos al metodo para una vez llamdado el endpoint proceder a log in el usuario
      .then(async (data: tokengenerated) => {
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

        this.decodingService
          .imageRetrieverUser(decodedJson.renterImg)
          .then((data) => {
            console.log(data);
          });
      });
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
        this.emittingAuthState();

        console.log(data); //log d ela data que se trae
        await this.storageService.cleanStorage(); //limpiando el storage
        await this.stateStore.dispatch(actionsAuth.resetStore()); //reseteando el store
        this.router.navigate(["/tabs/tab6"]); //finalmente navegando a la pagina de signUp
      })

      .catch((err) => console.log(err));
    //proceso del fetch que resume los readers y el call al endpoint con los headers
    //y el token de autorizacion para el llamado al metodo haciendo una variante mas segura
    //en vez de utilizar angular http methods
  }

  ///////////////////////////////renew token/////////////////////////////////////////////
  renewToken(tokenInStorage: string) {
    const authorizationCredentials = btoa(
      environment.configId + ":" + environment.configSecret
    );
    const bodyParams = new URLSearchParams();

    bodyParams.set("grant_type", grantType_RefreshToken);
    bodyParams.set(grantType_RefreshToken, tokenInStorage);
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
      .toPromise() //suscribiendonos al metodo para una vez llamdado el endpoint proceder a log in el usuario
      .then(async (data: tokengenerated) => {
        console.log(data);
        this.emittingAuthState();

        let user: boolean = true;
        //variable que define el user  status en la aplicacion

        await this.storageService.setTokenInstorage(data);
        //seteando el token en ele storage

        await this.storageService.setUserAuthInstorage(user);
        //seteando el user en el storage

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

        await this.stateStore.dispatch(actionsAuth.setToken({ token: data }));
        //accediendo al global state de la aplicacion para el uso de los valores que
        //en ella se almacenan , en este caso  se setea el token generado en la mismma
        //a traves del el metodo inicializado en la accion  settoken , pasandosele como
        //prop un objeto que contendria como value la data (token generado)

        await this.stateStore.dispatch(
          actionsAuth.decodingToken({ decoded: decodedJson })
        );
        //estableciendo el token decodificado en el store

        console.log("token renewed : " + data);

        this.decodingService.imageRetrieverUser(decodedJson.renterImg).then();
      })
      .catch((err) => {
        console.log(err);
      });
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
        //seteando el loader off
      });
    //vease que despues de resuleta la promesa se procede a obtener lo traido desde el endpoint
    //y se procede a extraer su data del tipo de INterfacedata, para posteriormente mediante
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
  getAllimgSubTypes() {
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
      .get<StattusSuccessImges>(
        `${url}/product/all/imgs`,

        {
          headers: headers,
        }
      ) //endpont de llamda
      .toPromise() //resolviendo la promesa a para posteriormente proceder a ejecutar ciertas tareas
      .then(async (data) => {
        // console.log(data);

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

        this.storageService.setAllImgSubTypesInStorage(data.data.allImages);
        //Poniendo en el storage las images traidas
      })
      .catch((err) => {
        console.log(err);
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
      });
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
      });
    //imprimiendo error en caso de fallo
  }

  //////////////////////////////////////create prodSubtype//////////////////////////////////////
  async createProdSubType(productSubTypeName: string, renterId) {
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
      });
  }
}

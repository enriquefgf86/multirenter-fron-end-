import { globalReducer } from "./globalReducer.reducer";
import { environment } from "./../environments/environment.prod";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
//angular forms
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
//http
import { HttpClientModule } from "@angular/common/http";
//ionic storage
import { IonicStorageModule } from "@ionic/storage";
// firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";

import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
//ngrx
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
//pipes imagen
import { PipeModule } from "./pipes/pipe.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import the library
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [AppComponent],
  exports: [],
  entryComponents: [],
  imports: [
    PipeModule,
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    NgxStripeModule.forRoot(environment.stripeApiKeyPublic),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    StoreModule.forRoot(globalReducer,{
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ImagePicker,
    Camera,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

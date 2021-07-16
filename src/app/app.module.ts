/**
* Ionic 4 Firebase Email Auth
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { Push } from '@ionic-native/push/ngx';
import { AuthenticationService } from './services/authentication.service';
import { AppUtilService } from './services/app-util.service';
import { IonicStorageModule } from '@ionic/storage';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { PdfViewerService } from "./services/pdf-viewer.service";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ZBar } from '@ionic-native/zbar/ngx'; //scansione QR
import { FirebaseX } from "@ionic-native/firebase-x/ngx";

import * as firebase from 'firebase/app';
firebase.default.initializeApp(environment.config);


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    FileTransfer,
    FileOpener,
    File,
    PdfViewerService,
    InAppBrowser,
    EmailComposer, //inviare mail tramite client posta
    HTTP,
    ZBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthenticationService, AppUtilService, FingerprintAIO,
    FirebaseX
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

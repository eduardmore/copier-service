import { FirebaseX } from '@ionic-native/firebase-x/ngx';
/**
* Ionic 4 Firebase Email Auth
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

import { AppUtilService } from './services/app-util.service';
import { Router } from '@angular/router';

import { AuthenticationService } from './services/authentication.service'; //prova per far controllare se esiste utente in memoria prima di mostrare impronta


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push: Push,
    private appUtil: AppUtilService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private firebaseX: FirebaseX,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushSetup();

      this.authenticationService.getUserData()
      .then((data) => {
        console.log('init then ', data);
        if (data) {
          this.navCtrl.navigateRoot('menu')
        } else {
          this.navCtrl.navigateRoot('login')
        }
      })
      .catch((error) => {
        console.log('init error ', error);
        this.navCtrl.navigateRoot('login')
      });
      //this.checkFingerPrint(); //DEBUG->: mostra la richiesta di impronta ad ogni apertura di app
    });
  }

  pushSetup() {

    this.firebaseX.getToken().then(token => {
      console.log(`The token is ${token}`);
      this.authenticationService.fcm_token = token;
      localStorage.setItem('my_token', token);
    });
    this.firebaseX.onMessageReceived().subscribe(data => {
      console.log(`FCM message: ${JSON.stringify(data)}`);
    });

    // const options: PushOptions = {
    //   android: {
    //     senderID: '318887622288'
    //   },
    //   ios: {
    //     alert: 'true',
    //     badge: true,
    //     sound: 'false'
    //   }
    // }
    // const pushObject: PushObject = this.push.init(options);
    // pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
    // pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
    // pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }


  //quando disabilito da initializeApp() questa funzione può sparire
  /* checkFingerPrint() {
     if (this.appUtil.isFingerprintAvailable) {
       this.appUtil.presentFingerPrint()
       .then((result: any) => {
         this.router.navigate(['/menu']); //home/dashboard
       })
       .catch((error: any) => {
         console.error('fingerprint : ', 'error');
       });
     }
   }
 */




}

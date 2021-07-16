/**
* Ionic 4 Firebase Email Auth
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Storage } from '@ionic/storage';
import { UserModel } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppUtilService } from 'src/app/services/app-util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  error: string = '';

  userName: string;
  //password: string;
  currentUser: UserModel;
  onInit: boolean;

  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private authenticationService: AuthenticationService,
    private appUtil: AppUtilService,
    private navCtrl: NavController
    ) {

  }

  ngOnInit() {
    this.onInit = true;
    // this.checkUser();
  }

  ionViewDidEnter(): void {
    // if (!this.onInit) {
      this.checkUser();
    // }
  }

  //OK SANDRO -> preleva i dati userModel da memoria per permettere la presenza del pulsante "login da impronta"
  checkUser() {
    this.authenticationService.getUserData()
      .then((data) => {
        console.log('init then ', data);
        if (data) {
          this.currentUser = data;
          this.userName = this.currentUser.userId;
          // this.navCtrl.navigateRoot('menu')
        }
      })
      .catch((error) => {
        console.log('init error ', error);
        this.currentUser = undefined;
        this.userName = undefined;
        this.password = undefined;
      });
  }


  //OK SANDRO
  loginWithFingerprint() {
    if (this.appUtil.isFingerprintAvailable) {
      this.appUtil.presentFingerPrint()
        .then((result: any) => {
          this.router.navigate(['/menu']);
        })
        .catch((error: any) => {
          console.error('fingerprint : ', 'error');
        });
    }
  }



  //vecchio codice, serve??
  async openLoader() {
    const loading = await this.loadingController.create({
      message: 'Please Wait ...',
      duration: 2000
    });
    await loading.present();
  }
  async closeLoading() {
    return await this.loadingController.dismiss();
  }

  //OK SANDRO-> autenticazione con fireauth (user,password) e memorizzazione userModel per permettere in seguito il "login da impronta"
  login() {
    this.fireauth.signInWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res.user) {
          console.log(res.user);
          this.router.navigate(['/menu']);
          this.onInit = false;
          //OK->effettuato il login, creo utente di UserModel e poi lo memorizzo, così permette poi di abilitare il pulsante di login con impronta
          const userModel = new UserModel();
          ///user.userId = currentUser.userId; //cercare di prendere idDB anziche username
          userModel.userName = this.userName;
          userModel.email = this.email;
          ///user.mobile = '123456';//non serve, elimina campo anche da model
          this.authenticationService.storeUserData(userModel);//effettuato il login creo userModel in memoria che permette poi di abilitare il pulsante di login con impronta
        }
      })
      .catch(err => {
        console.log(`login failed ${err}`);
        this.error = err.message;
      });
  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

}

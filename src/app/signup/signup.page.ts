/***
Ionic 4 Firebase Email Auth
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from '@firebase/app'; //prova / import core firebase client (required)
import '@firebase/database'; //prova // import Firebase Realtime Database (optional)
import '@firebase/auth';

import { UserModel } from 'src/app/models/user.model'; //per creare userModel da caricare poi in memoria
import { AuthenticationService } from 'src/app/services/authentication.service'; //per richiamare funzione che salva in memoria l'user corrente

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  email: string = '';
  password: string = '';
  error: string = '';
  username: string = '';
  telephone: string ='';
  ///image: number;

  //OK SANDRO -> vettore dei rami (ordine alfabetico, in totale stesso numero e tipo della funzione signup)
  public ramiCheckbox = [
    { val: 'Arredi Ufficio', isChecked: false }, //val da il nome al checkbox nella pagina signup
    { val: 'Gestione Documentale', isChecked: false },
    { val: 'PC e Server', isChecked: false },
    { val: 'Printing', isChecked: false },
    { val: 'Visual Display', isChecked: false },
    { val: 'Telefonia', isChecked: false }
  ];

  constructor(private fireauth: AngularFireAuth, private router: Router, private toastController: ToastController, private platform: Platform, public loadingController: LoadingController,
    public alertController: AlertController, private authenticationService: AuthenticationService) 
  {  }

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


  //OK SANDRO -> inserisce utente su Firebase Auth e RealtimeDatabase,
  signup() {
    //registrazione su firebase auth
    this.fireauth.createUserWithEmailAndPassword(this.email, this.password)
      .then(res => {
        if (res.user) {
          console.log(res.user);

          //sp Aggiungi utente al db firebase Realtime Database
          const userId = firebase.auth().currentUser.uid;
          firebase.database().ref('users/' + userId).set({
            username: this.username,
            email: this.email,
            telephone: this.telephone,
          });
          //inserisco nel nodo "ramo" se tutti i rami vendita sono true o false (ordine alfabetico, in totale stesso numero e tipo del ramoCheckbox[])
          firebase.database().ref('users/' + userId + '/ramo').set({
            arrediUff: this.ramiCheckbox[0].isChecked, //arredi -> da il nome all'attributo nel db
            gestioneDoc: this.ramiCheckbox[1].isChecked,
            pcServer: this.ramiCheckbox[2].isChecked,
            printing: this.ramiCheckbox[3].isChecked,
            visualDisplay: this.ramiCheckbox[4].isChecked,
            telefonia: this.ramiCheckbox[5].isChecked
          });


          //OK->effettuata la registrazione, creo user e poi lo memorizzo, così permette poi di abilitare il pulsante di login con impronta
          const userModel = new UserModel();
          userModel.userName = this.username;
          userModel.email = this.email;
          userModel.telephone = this.telephone;
          this.authenticationService.storeUserData(userModel);//salvo user in memoria così poi si abilita il pulsante di login con impronta

          this.updateProfile();
        }
      })
      .catch(err => {
        console.log(`login failed ${err}`);
        this.error = err.message;
      });
  }

  updateProfile() {
    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        user.updateProfile({
          displayName: this.username,
          ///photoURL: `https://picsum.photos/id/${this.image}/200/200`
        })
          .then(() => {
            this.router.navigateByUrl('/menu');
        
          })
      }
    })
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

/*
        ////regole ORIGINALI (aperte) sicurezza console database
        {
  "rules": {
    ".read": true,
    ".write": true
  }
}


*/
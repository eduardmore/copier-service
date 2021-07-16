/**
* Ionic 4 Firebase Email Auth
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

//import '@firebase/auth';
import firebase from '@firebase/app'; 

import { AuthenticationService } from '../../services/authentication.service'; // per eliminare user dalla memoria per logout funzione logout() di auth.service
import { CrudService } from '../../services/crud.service'; // per leggere dati da realtime db tramite le funzioni su crud.service


@Component({
  selector: 'app-home',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
})
export class ProfilePage {
  user: any;
  email: string = '';
  password: string = '';
  username: string = '';
  telephoneMittente: string ="";
  ///image: number;
  phone: number;
  error: string;
  userWantsToSignup: boolean = false;
  linkError: string = '';
  nome: string;
  ramoArrediUff: string;
  ramoGestioneDoc: string;
  ramoPCServer: string;
  ramoPrinting: string;
  ramoVisualDisplay: string;
  ramoTelefonia: string;
  constructor(private toastController: ToastController, public loadingController: LoadingController, private fireauth: AngularFireAuth, private router: Router, private authenticationService: AuthenticationService, private crudService: CrudService) { }


  ionViewDidEnter() {
    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        console.log(this.user);
        this.crudService.readUsername() //carica da Realtime Database i dati utente (username)
        .then(username=>{ //fa il debug su log
          console.log('Yeah, username ', username);
          this.nome=username;
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })

         this.crudService.readTelephone() //carica da Realtime Database i dati utente (telefono)
         .then(telephone=>{ //fa il debug su log
           console.log('Yeah, telephone ', telephone);
           this.telephoneMittente=telephone;
          })
          .catch(error=>{
          console.log('OOPS, error', error)
          })  


        //RAMO 1 arredi //recupero il valore del ramo passato per parametro
        this.crudService.readRamo('arrediUff') //carica da Realtime Database i dati utente (ramo) con funzione generica
        .then(arredi=>{ //fa il debug su log
          //console.log('Yeah, arredi ', arredi);
          this.ramoArrediUff = String(arredi) //converte booleano in stringa
          //console.log('Yeah, ramoArredi ', this.ramoArrediUff);
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })

        //RAMO 2 gestioneDoc //recupero il valore del ramo passato per parametro
        this.crudService.readRamo('gestioneDoc')
        .then(gestione=>{
          this.ramoGestioneDoc = String(gestione)
          //console.log('Yeah, valore gestioneDoc ', this.ramoGestioneDoc);
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })

        //RAMO 3 pcServer //recupero il valore del ramo passato per parametro
        this.crudService.readRamo('pcServer')
        .then(pcServer=>{
          this.ramoPCServer = String(pcServer)
          //console.log('Yeah, valore pcServer ', this.ramoPCServer);
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })

        //RAMO 4 printing //recupero il valore del ramo passato per parametro
        this.crudService.readRamo('printing')
        .then(printing=>{
          this.ramoPrinting = String(printing)
          //console.log('Yeah, valore pcServer ', this.ramoPrinting);
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })
    
        //RAMO 5 visualDisplay //recupero il valore del ramo passato per parametro
        this.crudService.readRamo('visualDisplay')
        .then(visualDisplay=>{
          this.ramoVisualDisplay = String(visualDisplay)
          //console.log('Yeah, valore visualDisplay ', this.ramoVisualDisplay);
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })
        //RAMO 6 telefonia //recupero il valore del ramo passato per parametro
        this.crudService.readRamo('telefonia')
        .then(telefonia=>{
          this.ramoTelefonia = String(telefonia)
          //console.log('Yeah, valore Telefonia ', this.ramoTelefonia);
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         })

      }
    })
  }

/* DEEBUG-> ATTIVARE SE VOGLIO CAMBIARE EMAIL SU DB AUTH (RICORDARSI DI CAMBIARE EMAIL MANUALMENTE POI SU DB REALTIME)
  updateEmail() {
    this.user.updateEmail(this.email)
      .then(() => {
        this.email = '';
        this.presentToast('Email updated', false, 'bottom', 1000);
        this.error = '';
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }
*/

/* DEBUG->  ATTIVARE SE VOGLIO CAMBIARE USER SU DB AUTH (RICORDARSI DI CAMBIARE USER MANUALMENTE POI SU DB REALTIME)
  updateUsername() {
    this.user.updateProfile({
      displayName: this.username
    })
      .then((data) => {
        console.log(data);
        this.username = '';
        this.presentToast('Username updated', false, 'bottom', 1000);
        this.error = '';
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }
*/

/* //Cambia immagine profilo su db auth (nell'app non la vogliamo mai mostrare)
  updateImage() {

    this.user.updateProfile({
      photoURL: `https://picsum.photos/id/${this.image}/200/200`
    })
      .then((data) => {
        console.log(data);
        this.image = null;
        this.presentToast('Image updated', false, 'bottom', 1000);
        this.error = '';
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }
*/

  updatePassword() {
    this.user.updatePassword(this.password)
      .then(() => {
        this.password = '';
        this.presentToast('Password updated', false, 'bottom', 1000);
        this.error = '';
      })
      .catch(err => {
        console.log(` failed ${err}`);
        this.error = err.message;
      });
  }

  // OK SANDRO
  logout() {
    /* spostata funzione su authentication.service
      this.fireauth.auth.signOut().then(() => {
      navigator['app'].exitApp();
      this.authenticationService.removeUserData(); //remove user from local storage to log user out

    })*/
    this.authenticationService.logout();
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

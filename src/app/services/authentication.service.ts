import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from '@angular/fire/auth'; //per logout dal db di autenticazione di firebase



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;

  public fcm_token = '';

  constructor(
    public router: Router, private storage: Storage, private fireauth: AngularFireAuth,
    private navCtrl: NavController
    ) {
    this.storage.get('currentUser').then((value) => {
      this.currentUserSubject = new BehaviorSubject<UserModel>(value);
      this.currentUser = this.currentUserSubject.asObservable();
    });
  }

  /* vedere se si può usare 
   public get currentUserValue(): User {
       return this.currentUserSubject.value;
   }*/


  // OK SANDRO -> usato da: menu-page (ora anche su main-page e profile-page)
  logout() {
    this.fireauth.signOut().then(() => {
      // navigator['app'].exitApp(); //esce dall'app per evitare che andando alla pagina login venga mostrato il pulsante accedi con impronta ///PAOLO la vuole commentare
      this.removeUserData(); //remove user from local storage to log user out
    })
  }

  //OK SANDRO -> usato da: login-page [ login() ]
  async storeUserData(userModel: UserModel) {
    const res = await this.storage.set('currentUser', userModel);
    this.currentUserSubject.next(userModel);
  }

  //OK SANDRO -> usato da: login-page [ checkUser() ]
  async getUserData() {
    let userData: UserModel;
    await this.storage.get('currentUser').then((value => {
      userData = value;
      console.log('User Data 1:', userData);
    }));
    console.log('User Data 2:', userData);
    return userData;
  }

  // OK SANDRO -> usato da: [ logout() ]
  async removeUserData() {
    await this.storage.remove('currentUser');
    this.currentUserSubject.next(null);
    this.navCtrl.navigateRoot('login', {animated: true, animationDirection: 'back'});
  }



}

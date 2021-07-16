import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'; // per logout ed eliminare user dalla memoria per logout funzione logout() di auth.service

import { AngularFireAuth } from '@angular/fire/auth'; //per login dal db di autenticazione di firebase

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  /* elenco qui le pagine che voglio siano presenti nel menu */
  pages = [
    { /* categorie singole */
      title: 'Home',
      url: '/menu/main',
      icon: 'home'
    },
    { 
      title: 'Profilo',
      url: '/menu/profile',
      icon: 'person'
    },/*
    {  //categoria con 2 sottocategorie 
      title: 'Categoria 2',
      children: [
        { 
          title: 'Sottocategoria 1',
          url: '/menu/chisiamo',
          icon: 'logo-ionic'
        },
        { 
          title: 'Sottocategoria 2',
          url: '/menu/servizi',
          icon: 'logo-google'
        }
      ]
    },*/
    { 
      title: 'Chi siamo',
      url: '/menu/chisiamo',
      icon: 'happy'
    },
    { 
      title: 'I nostri servizi',
      url: '/menu/nostriservizi',
      icon: 'color-wand'
    },
    { 
      title: 'Assistenza',
      url: '/menu/assistenza',
      icon: 'build'
    },
    { 
      title: 'Preventivi',
      url: '/menu/preventivi',
      icon: 'cart'
    },
    { 
      title: 'Promo',
      url: '/menu/promo',
      icon: 'rocket'
    },
    
  ];

  
  user: any;
  mittente: string; //lo prelevo dalla mail dell'utente loggato
  nomeMittente: string; //lo prelevo dal nome dell'utente loggato

  constructor(private authenticationService: AuthenticationService, private fireauth: AngularFireAuth) { }

  ngOnInit() {

    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        console.log(this.user);
        //this.mittente = this.user.email; //prelevo l'email dell'user loggato e lo uso come mittente per MAILGUN 
        this.nomeMittente = this.user.displayName; //prelevo l'email dell'user loggato e lo uso come mittente per MAILGUN
      } //if (user)
    }) //fireauth
  }

  logoutMenu() {
    this.authenticationService.logout();
  }


}

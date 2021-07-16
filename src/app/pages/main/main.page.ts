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

//import firebase from '@firebase/app';
import '@firebase/auth';

import { AuthenticationService } from '../../services/authentication.service'; // per eliminare user dalla memoria per logout funzione logout() di auth.service

import { CrudService } from '../../services/crud.service'; // per leggere dati da realtime db tramite le funzioni su crud.service

import { AppUtilService } from '../../services/app-util.service'; //per forzare la lettura immagini da http e non usare la cache

@Component({
  selector: 'app-main',
  templateUrl: 'main.page.html',
  styleUrls: ['main.page.scss'],
})
export class MainPage {
  user: any;
  email: string = '';
  password: string = '';
  username: string = '';
  image: number;
  phone: number;
  error: string;
  userWantsToSignup: boolean = false;
  linkError: string = '';

  /* //non viene più usato dopo la modifica al template, carico img da html
  categories = [
    {
      //imgs: 'assets/images/fruits/apple.jpeg', //per caricare immagini da dentro l'app (se non lo uso cancella immagini da cartella asset)
      name: 'Il mondo di Copier Service',
      url: '/menu/chisiamo',
      urlcatftp: 'https://www.tinxy.it/copier/imgcat/chisiamo.jpg' //per caricare immagine da ftp
    },
    {
      //imgs: 'assets/images/fruits/bananas.jpg',
      name: 'I nostri servizi',
      url: '/menu/nostriservizi',
      urlcatftp: 'https://www.tinxy.it/copier/imgcat/servizi.jpg'
    },
    {
      //imgs: 'assets/images/fruits/chrerry.jpg',
      name: 'Assistenza',
      url: '/menu/assistenza',
      urlcatftp: 'https://www.tinxy.it/copier/imgcat/assistenza.jpg'
    },
    {
      //imgs: 'assets/images/fruits/orange.jpg',
      name: 'Preventivi',
      url: '/menu/preventivi',
      urlcatftp: 'https://www.tinxy.it/copier/imgcat/preventivi.jpg'
    },
  ];

*/

  /********** variabili per PROMOZIONI ************************/
  //variabili per interfacciare le funzioni di promo con la home
  //urlpromoftp:string = 'https://www.tinxy.it/copier/imgpromo/promo.png' //per caricare immagine da ftp -> NON LA USO PIU PERCHE LO FA DA HTML
  mostraPromo: number = -1; //se l'utente ha almano una promozione da mostrare, la variabile NON deve essere =-1
  //variabili per lettura DB "Users/UID/ramo"
  ramoArrediUff: string;
  ramoGestioneDoc: string;
  ramoPCServer: string;
  ramoPrinting: string;
  ramoVisualDisplay: string;
  ramoTelefonia: string;
  //variabili per lettura DB "Users/UID/ramo", BOOLEANE -> true=l'user fa parte di quel ramo
  userArrediUff: boolean;
  userGestioneDoc: boolean;
  userPCServer: boolean;
  userPrinting: boolean;
  userVisualDisplay: boolean;
  userTelefonia: boolean;
  //variabili per lettura DB "Promozioni"
  attivo: boolean;
  //vettori per lettura DB "Promozioni" e scrittura sull'HTML
  i: number = 0;
  dateFine = [
    { valore: -1 },  //1 arrediUff
    { valore: -1 },  //2 gestioneDoc
    { valore: -1 },  //3 pcServer
    { valore: -1 },  //4 Printing
    { valore: -1 },  //5 visualDisplay
    { valore: -1 },  //6 Telefonia
  ];
  dateInizio = [
    { valore: -1 },  //1 arrediUff
    { valore: -1 },  //2 gestioneDoc
    { valore: -1 },  //3 pcServer
    { valore: -1 },  //4 Printing
    { valore: -1 },  //5 visualDisplay
    { valore: -1 },  //6 Telefonia
  ];

  messaggi = [
    { valore: -1 },  //1 arrediUff
    { valore: -1 },  //2 gestioneDoc
    { valore: -1 },  //3 pcServer
    { valore: -1 },  //4 Printing
    { valore: -1 },  //5 visualDisplay
    { valore: -1 },  //6 Telefonia
  ];

  sconti = [
    { valore: -1 },  //1 arrediUff
    { valore: -1 },  //2 gestioneDoc
    { valore: -1 },  //3 pcServer
    { valore: -1 },  //4 Printing
    { valore: -1 },  //5 visualDisplay
    { valore: -1 },  //6 Telefonia
  ];

  titoli = [
    { valore: -1 },  //1 arrediUff
    { valore: -1 },  //2 gestioneDoc
    { valore: -1 },  //3 pcServer
    { valore: -1 },  //4 Printing
    { valore: -1 },  //5 visualDisplay
    { valore: -1 },  //6 Telefonia
  ];
  //variabili per lettura compatibilità DB "Promozioni"
  compatibileArredi: boolean;
  compatibileGestioneDoc: boolean;
  compatibilePCServer: boolean;
  compatibilePrinting: boolean;
  compatibileVisualDisplay: boolean;
  compatibileTelefonia: boolean;
  /*************** fine variabili per PROMOZIONI *****************************/

  myRand: number;


  constructor(private toastController: ToastController, public loadingController: LoadingController, private fireauth: AngularFireAuth, private router: Router, private authenticationService: AuthenticationService, private crudService: CrudService, private appUtilService: AppUtilService) { }

  //capire a cosa serve
  ionViewDidEnter() {
    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        console.log(this.user);
        this.Promozione();
        this.myRand = this.appUtilService.random();
      }
    })
  }


  // OK SANDRO -> da usare se abilito il footer o qualcos'altro con la funzione logout
  /*    logout() {
        this.authenticationService.logout();
      }
  */

  // OK SANDRO
  goToCategory(cat, i) {
    ////this.router.navigateByUrl(this.categories[i].url); //non viene più usato dopo la modifica al template, carico img da html
    //this.router.navigateByUrl('/menu/chisiamo'); //per debug
  }

  goToPromo() {
    this.router.navigateByUrl('/menu/promo');
  }




  //può essere utile per mostrare messaggi con toast
  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  /*******************************************************************************************/
  /********************* funzioni per PROMOZIONI *********************************************/
  /*******************************************************************************************/
  //FUNZIONI PRINCIPALE per PROMOZIONI: esegui le istruzioni e funzioni per caricare e mostrare, eventualmente, la promozione
  Promozione() {
    //RAMO 1 (arredi) OK chiamata funzione ramo generico (inserendo come parametro il nome del ramo)
    this.crudService.readRamo('arrediUff')
      .then(arredi => {
        this.userArrediUff = arredi;
        this.ramoArrediUff = String(arredi) //converte booleano in stringa
        console.log('Yeah, valore arrediUff ', this.ramoArrediUff);
        if (arredi == true) {
          this.leggiCompatibilita('arrediUff');
          this.leggiPromozione('arrediUff');
        }
      })
      .catch(error => {
        console.log('OOPS, error', error)
      })

    //RAMO 2 (gestioneDoc) OK chiamata funzione ramo generico (inserendo come parametro il nome del ramo)
    this.crudService.readRamo('gestioneDoc')
      .then(gestione => {
        this.userGestioneDoc = gestione;
        this.ramoGestioneDoc = String(gestione)
        console.log('Yeah, valore gestioneDoc ', this.ramoGestioneDoc);
        if (gestione == true) {
          this.leggiCompatibilita('gestioneDoc');
          this.leggiPromozione('gestioneDoc');
        }

      })
      .catch(error => {
        console.log('OOPS, error', error)
      })

    //RAMO 3 (pcServer)
    this.crudService.readRamo('pcServer')
      .then(pcServer => {
        this.userPCServer = pcServer;
        this.ramoPCServer = String(pcServer)
        console.log('Yeah, valore pcServer ', this.ramoPCServer);
        if (pcServer == true) {
          this.leggiCompatibilita('pcServer');
          this.leggiPromozione('pcServer');
        }
      })
      .catch(error => {
        console.log('OOPS, error', error)
      })

    //RAMO 4 (printing)
    this.crudService.readRamo('printing')
      .then(printing => {
        this.userPrinting = printing;
        this.ramoPrinting = String(printing)
        console.log('Yeah, valore printing ', this.ramoPrinting);
        if (printing == true) {
          this.leggiCompatibilita('printing');
          this.leggiPromozione('printing');
        }
      })
      .catch(error => {
        console.log('OOPS, error', error)
      })

    //RAMO 5 (visualDisplay)
    this.crudService.readRamo('visualDisplay')
      .then(visualDisplay => {
        this.userVisualDisplay = visualDisplay;
        this.ramoVisualDisplay = String(visualDisplay)
        console.log('Yeah, valore visualDisplay ', this.ramoVisualDisplay);
        if (visualDisplay == true) {
          this.leggiCompatibilita('visualDisplay');
          this.leggiPromozione('visualDisplay');
        }
      })
      .catch(error => {
        console.log('OOPS, error', error)
      })

    //RAMO 6 (telefonia)
    this.crudService.readRamo('telefonia')
      .then(telefonia => {
        this.userTelefonia = telefonia;
        this.ramoTelefonia = String(telefonia)
        console.log('Yeah, valore telefonia ', this.ramoTelefonia);
        if (telefonia == true) {
          this.leggiCompatibilita('telefonia');
          this.leggiPromozione('telefonia');
        }
      })
      .catch(error => {
        console.log('OOPS, error', error)
      })

    //Aggiungi qui sotto eventuali altri rami (aggiungi anche a DB per utenti vecchi e su pag Signup)

  }


  //OK funzione generica: legge da DB i dati sulla promozione (esclusa la compatibilità che la legge da funzione apposita prima di chiamare la funzione di qua sotto)
  leggiPromozione(nomeRamoPromo) {
    //OK funzione su CRUD di lettura attributo "ATTIVO"
    this.crudService.readPromoChild(nomeRamoPromo, 'attivo')
      .then(valoreLetto => {
        this.attivo = valoreLetto;
        //this.STRattivo = String(valoreLetto) //debug
        console.log('Allora, il valore di attributo ATTIVO: ', this.attivo);
        //controlla se la promo arrediUff è attiva, se lo è leggi gli altri valori (dovrebbe controllare poi se al promo è compatibile con il cliente che appartiente 2 rami)
        if (this.attivo == true) {
          console.log('Dentro if attivo==true -> La promo ' + nomeRamoPromo + ' è attiva=> ', this.attivo);
          //leggi qua tutti gli altri valori

          console.log('Valore letto ramo:' + nomeRamoPromo + ',(con arredi) valore di attributo: ', String(this.compatibileArredi)); //debug
          console.log('Valore letto ramo:' + nomeRamoPromo + ',(con visual) valore di attributo: ', this.compatibileVisualDisplay); //debug
          console.log('userVisualDisplay valore di attributo: ', String(this.userVisualDisplay)); //debug          
          //controllo compatibilità (non devo eseguire altre operazioni se utenteRamo==true e compatibileRamo==false)
          if (((this.userArrediUff == true && this.userArrediUff == this.compatibileArredi) || (this.userArrediUff == false)) &&
            ((this.userGestioneDoc == true && this.userGestioneDoc == this.compatibileGestioneDoc) || (this.userGestioneDoc == false)) &&
            ((this.userPCServer == true && this.userPCServer == this.compatibilePCServer) || (this.userPCServer == false)) &&
            ((this.userPrinting == true && this.userPrinting == this.compatibilePrinting) || (this.userPrinting == false)) &&
            ((this.userVisualDisplay == true && this.userVisualDisplay == this.compatibileVisualDisplay) || (this.userVisualDisplay == false)) &&
            ((this.userTelefonia == true && this.userTelefonia == this.compatibileTelefonia) || (this.userTelefonia == false))
          )
          //se i rami vendita dell'utente sono compatibili con i rami compatibilità della promozione
          { //sono CONFERMATE TUTTE LE OPZIONI proseguo con la lettura della promozione e scrittura su variabili da mostrare

            //dataFINE -> funzione su CRUD di lettura attributo "DATAFINE" (se dataOdierna>dataFine non proseguire altrimenti viene mostrata la promo anche se scaduta)
            this.crudService.readPromoChild(nomeRamoPromo, 'dataFine')
              .then(valoreLetto => {
                this.i = this.recuperaIndice(nomeRamoPromo);
                this.dateFine[this.i].valore = valoreLetto;
                console.log('vettore dateFine[i]= e i=: ', this.dateFine[this.i].valore, this.i);
              })
              .catch(error => {
                console.log('OO, errore nella lettura crudService.readPromoChild(' + nomeRamoPromo + ',dataFine)', error)
              })
            //dataINIZIO -> funzione su CRUD di lettura attributo "DATAINIZIO"
            this.crudService.readPromoChild(nomeRamoPromo, 'dataInizio')
              .then(valoreLetto => {
                this.i = this.recuperaIndice(nomeRamoPromo);
                this.dateInizio[this.i].valore = valoreLetto;
                console.log('vettore dateInizio[i]= e i=: ', this.dateInizio[this.i].valore, this.i);
              })
              .catch(error => {
                console.log('OO, errore nella lettura crudService.readPromoChild(' + nomeRamoPromo + ',dataInizio)', error)
              })
            //MESSAGGIO -> funzione su CRUD di lettura attributo "MESSAGGIO"
            this.crudService.readPromoChild(nomeRamoPromo, 'messaggio')
              .then(valoreLetto => {
                this.i = this.recuperaIndice(nomeRamoPromo);
                this.messaggi[this.i].valore = valoreLetto;
                console.log('vettore messaggi[i]= e i=: ', this.messaggi[this.i].valore, this.i);
              })
              .catch(error => {
                console.log('OO, errore nella lettura crudService.readPromoChild(' + nomeRamoPromo + ',mesaggio)', error)
              })
            //SCONTO -> funzione su CRUD di lettura attributo "SCONTO"
            this.crudService.readPromoChild(nomeRamoPromo, 'sconto')
              .then(valoreLetto => {
                this.i = this.recuperaIndice(nomeRamoPromo);
                this.sconti[this.i].valore = valoreLetto;
                console.log('vettore sconti[i]= e i=: ', this.sconti[this.i].valore, this.i);
              })
              .catch(error => {
                console.log('OO, errore nella lettura crudService.readPromoChild(' + nomeRamoPromo + ',mesaggio)', error)
              })
            //TITOLO -> funzione su CRUD di lettura attributo "TITOLO"
            this.crudService.readPromoChild(nomeRamoPromo, 'titolo')
              .then(valoreLetto => {
                this.i = this.recuperaIndice(nomeRamoPromo);
                this.titoli[this.i].valore = valoreLetto;
                console.log('vettore titoli[i]= e i=: ', this.titoli[this.i].valore, this.i);
                this.mostraPromo = 0; //se eseguo questa istruzione, ho almeno una promozione e mostro il banner PROMO
              })
              .catch(error => {
                console.log('OO, errore nella lettura crudService.readPromoChild(' + nomeRamoPromo + ',titolo)', error)
              })

          } //fine if che controlla la compatibilità
          else console.log('RamoUtente e Promozione NON COMPATIBILI') //qua deve mostrare messaggio generico di NESSUNA PROMOZIONE

        }//fine if attivo=true
        else console.log('Promozione ' + nomeRamoPromo + ' NON ATTIVA') //qua deve mostrare messaggio generico di NESSUNA PROMOZIONE


      })
      .catch(error => {
        console.log('OO, errore nella lettura crudService.readPromoChild(' + nomeRamoPromo + ',attivo)', error)
      })


  }//fine leggiPromozione()


  //SANDRO OK -> recupera (da DB/Promozione/CompatibilitaUtenti) i dati di compatibilità della promozione ricevendo in ingresso il nome promozione e salvando su variabili booleani il valore letto
  leggiCompatibilita(nomeRamoPromo) {
    //leggo valori compatibilità
    //ramo arrediUff
    this.crudService.readPromoCompatibilita(nomeRamoPromo, 'arrediUff')
      .then(valoreLetto => {
        this.compatibileArredi = valoreLetto;
        console.log('COMPATIBILE ' + nomeRamoPromo + 'con arrediUff, valore di attributo: ', this.compatibileArredi);
      })
      .catch(error => {
        console.log('OOO, errore nella lettura crudService.readPromoCompatibilita(' + nomeRamoPromo + ',arrediUff)', error)
      })
    //ramo gestioneDoc
    this.crudService.readPromoCompatibilita(nomeRamoPromo, 'gestioneDoc')
      .then(valoreLetto => {
        this.compatibileGestioneDoc = valoreLetto;
        console.log('COMPATIBILE ' + nomeRamoPromo + 'con gestioneDoc, valore di attributo: ', this.compatibileGestioneDoc);
      })
      .catch(error => {
        console.log('OO, errore nella lettura crudService.readPromoCompatibilita(' + nomeRamoPromo + ',gestioneDoc)', error)
      })
    //ramo pcServer
    this.crudService.readPromoCompatibilita(nomeRamoPromo, 'pcServer')
      .then(valoreLetto => {
        this.compatibilePCServer = valoreLetto;
        console.log('COMPATIBILE ' + nomeRamoPromo + 'con pcServer, valore di attributo: ', this.compatibilePCServer);
      })
      .catch(error => {
        console.log('OO, errore nella lettura crudService.readPromoCompatibilita(' + nomeRamoPromo + ',pcServer)', error)
      })
    //ramo Printing
    this.crudService.readPromoCompatibilita(nomeRamoPromo, 'printing')
      .then(valoreLetto => {
        this.compatibilePrinting = valoreLetto;
        console.log('COMPATIBILE ' + nomeRamoPromo + 'con printing, valore di attributo: ', this.compatibilePrinting);
      })
      .catch(error => {
        console.log('OO, errore nella lettura crudService.readPromoCompatibilita(' + nomeRamoPromo + ',printing)', error)
      })

    //ramo visualDisplay
    this.crudService.readPromoCompatibilita(nomeRamoPromo, 'visualDisplay')
      .then(valoreLetto => {
        this.compatibileVisualDisplay = valoreLetto;
        console.log('COMPATIBILE ' + nomeRamoPromo + 'con visualDisplay, valore di attributo: ', this.compatibileVisualDisplay);
      })
      .catch(error => {
        console.log('OO, errore nella lettura crudService.readPromoCompatibilita(' + nomeRamoPromo + ',visualDisplay)', error)
      })

    //ramo Telefonia
    this.crudService.readPromoCompatibilita(nomeRamoPromo, 'telefonia')
      .then(valoreLetto => {
        this.compatibileTelefonia = valoreLetto;
        console.log('COMPATIBILE ' + nomeRamoPromo + 'con telefonia, valore di attributo: ', this.compatibileTelefonia);
      })
      .catch(error => {
        console.log('OO, errore nella lettura crudService.readPromoCompatibilita(' + nomeRamoPromo + ',telefonia)', error)
      })
  }//fine leggiCompatibilita()

  //recupero l'indice per mostrare il vettore di sconti (usabile da tutti i campi)
  recuperaIndice(nomeRamoPromo) {
    if (nomeRamoPromo == 'arrediUff') return 0// this.i=0;
    else if (nomeRamoPromo == 'gestioneDoc') return 1//this.i=1;
    else if (nomeRamoPromo == 'pcServer') return 2//this.i=2;
    else if (nomeRamoPromo == 'printing') return 3//this.i=3;
    else if (nomeRamoPromo == 'visualDisplay') return 4//this.i=4;
    else if (nomeRamoPromo == 'telefonia') return 5//this.i=5;
  }

  /******************************* fine funzioni per PROMOZIONI *******************************/
}

import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service'; // per prelevare dati userModel da memoria tramite: this.authenticationService.getUserData()
import { CrudService } from '../../services/crud.service'; // per leggere dati da realtime db tramite le funzioni su crud.service
import { UserModel } from '../../models/user.model'; // 

import { AppUtilService } from '../../services/app-util.service'; //per forzare la lettura immagini da http e non usare la cache

import { LoadingController, ToastController } from '@ionic/angular'; //per avviso di messaggio inviato
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.page.html',
  styleUrls: ['./promo.page.scss'],
  
})


export class PromoPage implements OnInit {

  mittente: string; //lo prelevo dalla mail dell'utente loggato
  destinatario: string = "solinonio2@gmail.com"; //destinatario di email
  nomeMittente: string; //lo prelevo dal nome dell'utente loggato
  telephoneMittente: string; //lo prelevo dal nome dell'utente loggato
  
  mailgunUrl: string;
  mailgunApiKey: string;

  user: any;
  userModel: UserModel; //prima si chiamava user : User e no userModel: UserModel

  nome: string;
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
  
  ramoV: string[]; //non dovrebbe servire
  //ramoVendita: string[];
  ///nomeUser: string;

  //variabili per lettura DB "Promozioni"
  attivo: boolean; //STRattivo: string; //debug
  //le seguenti 5 sono superflue perchè i dati li memorizzo anche sui vettori dedicati, ELIMINA QUESTE SOTTO
  dataFine:string; //cercare se esiste tipo di dato DATA
  dataInizio:string;
  messaggio:string;
  sconto: string; //posso mettere number ma uso il valore solo per scriverlo, tanto vale lo lascio string
  titolo: string;

  titoloInteresse:string;

  //vettori per lettura DB "Promozioni" e scrittura sull'HTML
  i: number=0;
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

  myRand: number;

  constructor(  /*private userModel: UserModel,*/ private fireauth: AngularFireAuth, private authenticationService: AuthenticationService, private crudService: CrudService, private appUtilService: AppUtilService, private toastController: ToastController, public cordovaHttp: HTTP) { 
    
    this.mailgunUrl = "sandbox1f6bb3091df0400ab1ac376e90285b9c.mailgun.org";  //"MAILGUN_URL_HERE" copier dominio mailgun
    //this.mailgunApiKey = window.btoa("api:5a135daf4f82f24d280dcc5ca34ad853-9b1bf5d3-60f81f71"); //api:key-MAILGUN_API_KEY_HERE -> copier api key
    this.mailgunApiKey = window.btoa("api:key-a026085504bec98d5d644fa0cbd417d1"); //api:key-MAILGUN_API_KEY_HERE -> copier private api key

  }

  ngOnInit() {
 //prova per prelevare dati da utente (usando user di model)
    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        console.log(this.user);
        this.mittente = this.user.email; //prelevo l'email dell'user loggato e lo uso come mittente per MAILGUN 
        this.nomeMittente = this.user.displayName; //prelevo l'email dell'user loggato e lo uso come mittente per MAILGUN
        this.crudService.readTelephone() //carica da Realtime Database i dati utente (telefono)
        .then(telephone=>{ //fa il debug su log
          console.log('Yeah, telephone ', telephone);
          this.telephoneMittente=telephone;
         })
         .catch(error=>{
         console.log('OOPS, error', error)
         }) 


        //prova-> prelevo dati userModel da memoria
/*        this.authenticationService.getUserData()
        .then((data) => {
          console.log('init then ', data);
          this.userModel = data;
          this.userModel.userName = data.userName;
          this.nomeUser =  this.userModel.userName;
          //this.userName = this.currentUser.userId;
        })
*/        
        this.myRand=this.appUtilService.random();
        this.Promozione();  //esegui le operazioni per caricare e mostrare, eventualmente, la promozione       
        

      } //if (user)
    }) //fireauth
    


  } //ngOnInit

  //FUNZIONI PRINCIPALE: esegui le istruzioni e funzioni per caricare e mostrare, eventualmente, la promozione
  Promozione(){
    //provare a caricare username da auth (meno dispendioso di caricare da db)
    this.crudService.readUsername() //carica da Realtime Database i dati utente (username)
    .then(username=>{ //fa il debug su log
      console.log('Yeah, username ', username);
      this.nome=username;
      ///this.userModel.userName=username;
     })
     .catch(error=>{
     console.log('OOPS, error', error)
     })
    
    //RAMO 1 (arredi) OK chiamata funzione ramo generico (inserendo come parametro il nome del ramo)
    this.crudService.readRamo('arrediUff')
    .then(arredi=>{
      this.userArrediUff = arredi;
      this.ramoArrediUff = String(arredi) //converte booleano in stringa
      console.log('Yeah, valore arrediUff ', this.ramoArrediUff);
        if (arredi==true){
          this.leggiCompatibilita('arrediUff');
          this.leggiPromozione('arrediUff');
            
            
        }
     })
     .catch(error=>{
     console.log('OOPS, error', error)
     }) 
     
    //RAMO 2 (gestioneDoc) OK chiamata funzione ramo generico (inserendo come parametro il nome del ramo)
    this.crudService.readRamo('gestioneDoc')
    .then(gestione=>{
      this.userGestioneDoc = gestione;
      this.ramoGestioneDoc = String(gestione)
      console.log('Yeah, valore gestioneDoc ', this.ramoGestioneDoc);
      if (gestione==true){
        this.leggiCompatibilita('gestioneDoc');
        this.leggiPromozione('gestioneDoc');    
      }

     })
     .catch(error=>{
     console.log('OOPS, error', error)
     })
     
    //RAMO 3 (pcServer)
    this.crudService.readRamo('pcServer')
    .then(pcServer=>{
      this.userPCServer = pcServer;
      this.ramoPCServer = String(pcServer)
      console.log('Yeah, valore pcServer ', this.ramoPCServer);
        if (pcServer==true){
          this.leggiCompatibilita('pcServer');
          this.leggiPromozione('pcServer');    
        }
     })
     .catch(error=>{
     console.log('OOPS, error', error)
     })

    //RAMO 4 (printing)
    this.crudService.readRamo('printing')
    .then(printing=>{
      this.userPrinting = printing;
      this.ramoPrinting = String(printing)
      console.log('Yeah, valore printing ', this.ramoPrinting);
        if (printing==true){
          this.leggiCompatibilita('printing');
          this.leggiPromozione('printing');    
        }
     })
     .catch(error=>{
     console.log('OOPS, error', error)
     })

    //RAMO 5 (visualDisplay)
    this.crudService.readRamo('visualDisplay')
    .then(visualDisplay=>{
      this.userVisualDisplay = visualDisplay;
      this.ramoVisualDisplay = String(visualDisplay)
      console.log('Yeah, valore visualDisplay ', this.ramoVisualDisplay);
        if (visualDisplay==true){
          this.leggiCompatibilita('visualDisplay');
          this.leggiPromozione('visualDisplay');    
        }
     })
     .catch(error=>{
     console.log('OOPS, error', error)
     })

//RAMO 6 (telefonia)
    this.crudService.readRamo('telefonia')
    .then(telefonia=>{
      this.userTelefonia = telefonia;
      this.ramoTelefonia = String(telefonia)
      console.log('Yeah, valore telefonia ', this.ramoTelefonia);
        if (telefonia==true){
          this.leggiCompatibilita('telefonia');
          this.leggiPromozione('telefonia');    
        }
     })
     .catch(error=>{
     console.log('OOPS, error', error)
     })
     //Aggiungi qui sotto eventuali altri rami (aggiungi anche a DB per utenti vecchi e su pag Signup)

  }


  //OK funzione generica: legge da DB i dati sulla promozione (esclusa la compatibilità che la legge da funzione apposita prima di chiamare la funzione di qua sotto)
  leggiPromozione(nomeRamoPromo){
    //OK funzione su CRUD di lettura attributo "ATTIVO"
    this.crudService.readPromoChild(nomeRamoPromo,'attivo')
    .then(valoreLetto=>{
      this.attivo = valoreLetto;
      //this.STRattivo = String(valoreLetto) //debug
      console.log('Allora, il valore di attributo ATTIVO: ', this.attivo);
        //controlla se la promo passata come parametro è attiva, se lo è leggi gli altri valori (controlla in precedenza con funziona apposita se la promo è compatibile con il cliente che appartiente ad altri rami)
        if(this.attivo==true){
          console.log('Dentro if attivo==true -> La promo '+nomeRamoPromo+' è attiva=> ', this.attivo);
          //leggi qua tutti gli altri valori

          console.log('Valore letto ramo:'+nomeRamoPromo+',(con arredi) valore di attributo: ', String(this.compatibileArredi)); //debug
          console.log('Valore letto ramo:'+nomeRamoPromo+',(con visual) valore di attributo: ', this.compatibileVisualDisplay); //debug
          console.log('userVisualDisplay valore di attributo: ', String(this.userVisualDisplay)); //debug
          console.log('userTelefonia valore di attributo: ', String(this.userTelefonia)); //debug           
          //controllo compatibilità (non devo eseguire altre operazioni se utenteRamo==true e compatibileRamo==false)
            if( ((this.userArrediUff==true && this.userArrediUff==this.compatibileArredi) || (this.userArrediUff==false)) &&
                ((this.userGestioneDoc==true && this.userGestioneDoc==this.compatibileGestioneDoc) || (this.userGestioneDoc==false)) &&
                ((this.userPCServer==true && this.userPCServer==this.compatibilePCServer) || (this.userPCServer==false)) &&
                ((this.userPrinting==true && this.userPrinting==this.compatibilePrinting) || (this.userPrinting==false)) &&
                ((this.userVisualDisplay==true && this.userVisualDisplay==this.compatibileVisualDisplay) || (this.userVisualDisplay==false)) &&
                ((this.userTelefonia==true && this.userTelefonia==this.compatibileTelefonia) || (this.userTelefonia==false))
              )
            //se i rami vendita dell'utente sono compatibili con i rami compatibilità della promozione
            { //sono CONFERMATE TUTTE LE OPZIONI proseguo con la lettura della promozione e scrittura su variabili da mostrare
            
            //dataFINE -> funzione su CRUD di lettura attributo "DATAFINE" (se dataOdierna>dataFine non proseguire altrimenti viene mostrata la promo anche se scaduta)
            this.crudService.readPromoChild(nomeRamoPromo,'dataFine')
            .then(valoreLetto=>{
              this.dataFine = valoreLetto;
              console.log('Allora, il valore di attributo dataFine: ', this.dataFine);
              this.i=this.recuperaIndice(nomeRamoPromo);
              this.dateFine[this.i].valore = valoreLetto; 
              console.log('vettore dateFine[i]= e i=: ', this.dateFine[this.i].valore, this.i);
            })
            .catch(error=>{
              console.log('OO, errore nella lettura crudService.readPromoChild('+nomeRamoPromo+',dataFine)', error)
            })
            //dataINIZIO -> funzione su CRUD di lettura attributo "DATAINIZIO"
            this.crudService.readPromoChild(nomeRamoPromo,'dataInizio')
            .then(valoreLetto=>{
              this.dataInizio = valoreLetto;
              console.log('Allora, il valore di attributo dataInizio: ', this.dataInizio);
              this.i=this.recuperaIndice(nomeRamoPromo);
              this.dateInizio[this.i].valore = valoreLetto; 
              console.log('vettore dateInizio[i]= e i=: ', this.dateInizio[this.i].valore, this.i);
            })
            .catch(error=>{
              console.log('OO, errore nella lettura crudService.readPromoChild('+nomeRamoPromo+',dataInizio)', error)
            })
            //MESSAGGIO -> funzione su CRUD di lettura attributo "MESSAGGIO"
            this.crudService.readPromoChild(nomeRamoPromo,'messaggio')
            .then(valoreLetto=>{
              this.messaggio = valoreLetto;
              console.log('Allora, il valore di attributo messaggio: ', this.messaggio);
              this.i=this.recuperaIndice(nomeRamoPromo);
              this.messaggi[this.i].valore = valoreLetto; 
              console.log('vettore messaggi[i]= e i=: ', this.messaggi[this.i].valore, this.i);
            })
            .catch(error=>{
            console.log('OO, errore nella lettura crudService.readPromoChild('+nomeRamoPromo+',mesaggio)', error)
            })
            //SCONTO -> funzione su CRUD di lettura attributo "SCONTO"
            this.crudService.readPromoChild(nomeRamoPromo,'sconto')
            .then(valoreLetto=>{
              this.sconto = valoreLetto;
              console.log('Allora, il valore di attributo sconto: ', this.sconto);
              this.i=this.recuperaIndice(nomeRamoPromo);
              this.sconti[this.i].valore = valoreLetto; 
              console.log('vettore sconti[i]= e i=: ', this.sconti[this.i].valore, this.i);
            })
            .catch(error=>{
            console.log('OO, errore nella lettura crudService.readPromoChild('+nomeRamoPromo+',mesaggio)', error)
            })           
            //TITOLO -> funzione su CRUD di lettura attributo "TITOLO"
            this.crudService.readPromoChild(nomeRamoPromo,'titolo')
            .then(valoreLetto=>{
              this.titolo = valoreLetto;
              console.log('Allora, il valore di attributo TITOLO: ', this.titolo);
              this.i=this.recuperaIndice(nomeRamoPromo);
              this.titoli[this.i].valore = valoreLetto; 
              console.log('vettore titoli[i]= e i=: ', this.titoli[this.i].valore, this.i);
            })
            .catch(error=>{
              console.log('OO, errore nella lettura crudService.readPromoChild('+nomeRamoPromo+',titolo)', error)
            })
          
            } //fine if che controlla la compatibilità
            else console.log('RamoUtente e Promozione NON COMPATIBILI') //qua deve mostrare messaggio generico di NESSUNA PROMOZIONE

        }//fine if attivo=true
        else console.log('Promozione '+nomeRamoPromo+' NON ATTIVA') //qua deve mostrare messaggio generico di NESSUNA PROMOZIONE
    
    
      })
     .catch(error=>{
     console.log('OO, errore nella lettura crudService.readPromoChild('+nomeRamoPromo+',attivo)', error)
     })


  }//fine leggiPromozione()


//SANDRO OK -> recupera (da DB/Promozione/CompatibilitaUtenti) i dati di compatibilità della promozione ricevendo in ingresso il nome promozione e salvando su variabili booleani il valore letto
  leggiCompatibilita(nomeRamoPromo){
    //leggo valori compatibilità
          //ramo arrediUff
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'arrediUff')
          .then(valoreLetto=>{
            this.compatibileArredi = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con arrediUff, valore di attributo: ', this.compatibileArredi);
          })
          .catch(error=>{
          console.log('OOO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',arrediUff)', error)
          })
          //ramo gestioneDoc
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'gestioneDoc')
          .then(valoreLetto=>{
            this.compatibileGestioneDoc = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con gestioneDoc, valore di attributo: ', this.compatibileGestioneDoc);
          })
          .catch(error=>{
          console.log('OO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',gestioneDoc)', error)
          })
          //ramo pcServer
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'pcServer')
          .then(valoreLetto=>{
            this.compatibilePCServer = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con pcServer, valore di attributo: ', this.compatibilePCServer);
          })
          .catch(error=>{
          console.log('OO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',pcServer)', error)
          })
          //ramo Printing
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'printing')
          .then(valoreLetto=>{
            this.compatibilePrinting = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con printing, valore di attributo: ', this.compatibilePrinting);
          })
          .catch(error=>{
          console.log('OO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',printing)', error)
          })
  
          //ramo visualDisplay
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'visualDisplay')
          .then(valoreLetto=>{
            this.compatibileVisualDisplay = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con visualDisplay, valore di attributo: ', this.compatibileVisualDisplay);
          })
          .catch(error=>{
          console.log('OO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',visualDisplay)', error)
          })
          //ramo visualDisplay
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'visualDisplay')
          .then(valoreLetto=>{
            this.compatibileVisualDisplay = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con visualDisplay, valore di attributo: ', this.compatibileVisualDisplay);
          })
          .catch(error=>{
          console.log('OO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',visualDisplay)', error)
          })
          //ramo Telefonia
          this.crudService.readPromoCompatibilita(nomeRamoPromo,'telefonia')
          .then(valoreLetto=>{
            this.compatibileTelefonia = valoreLetto;
            console.log('COMPATIBILE '+nomeRamoPromo+'con telefonia, valore di attributo: ', this.compatibileTelefonia);
          })
          .catch(error=>{
          console.log('OO, errore nella lettura crudService.readPromoCompatibilita('+nomeRamoPromo+',telefonia)', error)
          })
  }//fine leggiCompatibilita()


  //recupero l'indice per mostrare il vettore di sconti (usabile da tutti i campi)
  recuperaIndice(nomeRamoPromo){
    if(nomeRamoPromo=='arrediUff') return 0// this.i=0;
    else if(nomeRamoPromo=='gestioneDoc') return 1//this.i=1;
          else if(nomeRamoPromo=='pcServer') return 2//this.i=2;
           else if(nomeRamoPromo=='printing') return 3//this.i=3;
           else if(nomeRamoPromo=='visualDisplay') return 4//this.i=4;
           else if(nomeRamoPromo=='telefonia') return 5//this.i=5;
  }


  //Nuova funzione assistenza per template nuovo
  sendPromo(ramo:string) {   
    if(ramo=='0') {
    //TITOLO -> funzione su CRUD di lettura attributo "TITOLO"
    this.crudService.readPromoChild('arrediUff','titolo')
      .then(valoreLetto=>{
      this.titoloInteresse = valoreLetto;
      console.log('ramo==0 (arredi) il valore di attributo TITOLOINTERESSE: ', this.titoloInteresse);
      //se serve inviare per mail altre info della promo oltre il titolo, chiama crudService.readPromoChild('arrediUff','messaggio') e passa il valore letto messaggioInteresse come parametro a InviMail
      this.inviaMail(this.titoloInteresse);
      })
      .catch(error=>{
        console.log('OO, errore ', error)
      })
    }
    else if(ramo=='1'){
        this.crudService.readPromoChild('gestioneDoc','titolo')
          .then(valoreLetto=>{
            this.titoloInteresse = valoreLetto;
            console.log('ramo==1 il valore di attributo TITOLOINTERESSE: ', this.titoloInteresse);
            this.inviaMail(this.titoloInteresse);
          })
          .catch(error=>{
            console.log('OO, errore ', error)
          })
    }
    else if(ramo=='2')
    { //TITOLO -> funzione su CRUD di lettura attributo "TITOLO"
      this.crudService.readPromoChild('pcServer','titolo')
        .then(valoreLetto=>{
        this.titoloInteresse = valoreLetto;
        console.log('ramo==2, il valore di attributo TitoloInteresse: ', this.titoloInteresse);
        this.inviaMail(this.titoloInteresse);
        })
        .catch(error=>{
          console.log('OO, errore ', error)
        })
      } 
        else if(ramo=='3'){
            this.crudService.readPromoChild('printing','titolo')
              .then(valoreLetto=>{
                this.titoloInteresse = valoreLetto;
                console.log('ramo==3, il valore di attributo TITOLOINTERESSE: ', this.titoloInteresse);
                this.inviaMail(this.titoloInteresse);
              })
              .catch(error=>{
                console.log('OO, errore ', error)
              })
        }
        else if(ramo=='4'){
          this.crudService.readPromoChild('visualDisplay','titolo')
            .then(valoreLetto=>{
              this.titoloInteresse = valoreLetto;
              console.log('ramo==4, il valore di attributo TITOLOINTERESSE: ', this.titoloInteresse);
              this.inviaMail(this.titoloInteresse);
            })
            .catch(error=>{
              console.log('OO, errore ', error)
            })
      }
      else if(ramo=='5'){
        this.crudService.readPromoChild('telefonia','titolo')
          .then(valoreLetto=>{
            this.titoloInteresse = valoreLetto;
            console.log('ramo==5, il valore di attributo TITOLOINTERESSE: ', this.titoloInteresse);
            this.inviaMail(this.titoloInteresse);
          })
          .catch(error=>{
            console.log('OO, errore ', error)
          })
    }
  
/*
    let headers = {
      'Authorization': 'Basic ' + this.mailgunApiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    let body = {
      from: this.mittente, //mittente, variabile che preleva la mail dell'utente loggato
      to: this.destinatario, //destinatario, costante testuale dichiarata nelle variabili (solinonio2@gmail.com
      subject: 'Richiesta di promozione', //come oggetto del messaggio passo modello scansionato qr
      text: 'Richiesta di promozione da: '+this.nomeMittente+'\n'+ //contenuto della mail, accodo tutti i campi
      'Email: '+this.mittente+'\n'+
      'Telefono: '+this.telephoneMittente+'\n'+
      'Promozione di interesse: '+this.titoloInteresse+'\n'
    }
    let url = 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages';
      this.presentToast('Richiesta inoltrata', false, 'bottom', 1000); //avvisa con toast che ha inviato il messaggio
      
      console.log('Dopo invio mail. il valore di attributo TITOLOINTERESSE: ', this.titoloInteresse);

      return this.cordovaHttp.post(url, body, headers);
 */
  }

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }
  

  inviaMail(titoloInteres:string){
    let headers = {
      'Authorization': 'Basic ' + this.mailgunApiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    let body = {
      from: this.mittente, //mittente, variabile che preleva la mail dell'utente loggato
      to: this.destinatario, //destinatario, costante testuale dichiarata nelle variabili (solinonio2@gmail.com
      subject: 'Richiesta di promozione', //come oggetto del messaggio passo modello scansionato qr
      text: 'Richiesta di promozione da: '+this.nomeMittente+'\n'+ //contenuto della mail, accodo tutti i campi
      'Email: '+this.mittente+'\n'+
      'Telefono: '+this.telephoneMittente+'\n'+
      'Promozione di interesse: '+titoloInteres+'\n'
    }
    let url = 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages';
      this.presentToast('Richiesta inoltrata', false, 'bottom', 1000); //avvisa con toast che ha inviato il messaggio
      
      console.log('Funzione esterna invio mail. Valore di attributo TITOLOINTERES: ', titoloInteres);

      return this.cordovaHttp.post(url, body, headers);
  }


} //PromoPage onInit

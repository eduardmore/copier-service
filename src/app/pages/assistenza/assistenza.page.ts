/*ASSISTENZA PAGE IN FASE DI SVULUPPO, OK QR ma non invia più mail con mailgun*/
/* CONTIENE FORM classico PER INVIARE mail tramite MAILGUN (da fare: conferma messaggio inviato e azzeramento form)*/
import { Component, OnInit } from '@angular/core';
//import { EmailComposer } from '@ionic-native/email-composer/ngx'; //inviare mail da client posta
import { HTTP } from '@ionic-native/http/ngx';

import { AngularFireAuth } from '@angular/fire/auth';

import { LoadingController, ToastController } from '@ionic/angular'; //per avviso di messaggio inviato

import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx'; //lettore QR
import { CrudService } from '../../services/crud.service'; // per leggere dati da realtime db tramite le funzioni su crud.service


@Component({
  selector: 'app-assistenza',
  templateUrl: './assistenza.page.html',
  styleUrls: ['./assistenza.page.scss'],
})
export class AssistenzaPage implements OnInit {

  mittente: string; //lo prelevo dalla mail dell'utente loggato
  destinatario: string = "solinonio2@gmail.com"; //destinatario di email
  scansionato: string; //lo prelevo dal QR
  nomeMittente: string; //lo prelevo dal nome dell'utente loggato
  telephoneMittente: string; //lo prelevo dal nome dell'utente loggato
  
  mailgunUrl: string;
  mailgunApiKey: string;

  user: any;
  email: string = '';
  username: string = '';
  nome: string;
  //variabili per scansione QR
  zbarOptions:any;
  scannedResult:any;

  RichToner:string; Qual:string; Incepp:string; Altr:string;

  richiesta: any;

  constructor(public cordovaHttp: HTTP/*, private emailComposer: EmailComposer*/, private fireauth: AngularFireAuth, private toastController: ToastController, private zbar: ZBar,private crudService: CrudService) {
    this.mailgunUrl = "sandbox1f6bb3091df0400ab1ac376e90285b9c.mailgun.org";  //"MAILGUN_URL_HERE" copier dominio mailgun
    //this.mailgunApiKey = window.btoa("api:5a135daf4f82f24d280dcc5ca34ad853-9b1bf5d3-60f81f71"); //api:key-MAILGUN_API_KEY_HERE -> copier api key
    this.mailgunApiKey = window.btoa("api:key-a026085504bec98d5d644fa0cbd417d1"); //api:key-MAILGUN_API_KEY_HERE -> copier private api key

    //scansione QR - inizializzazione variabili
    this.zbarOptions = {
    flash: 'off',
    drawSight: false
    }
  }


  ngOnInit() {

  }


  ionViewDidEnter() {
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
      }
    })
  }

      //Nuova funzione assistenza per template nuovo
      sendAssistenza(richiesta:string) {   
        let headers = {
          'Authorization': 'Basic ' + this.mailgunApiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        let body = {
          from: this.mittente, //mittente, variabile che preleva la mail dell'utente loggato
          to: this.destinatario, //destinatario, costante testuale dichiarata nelle variabili (solinonio2@gmail.com
          subject: 'Richiesta assistenza da APP - '+this.scansionato, //come oggetto del messaggio passo modello scansionato qr
          text: 'Richiesta di assistenza da: '+this.nomeMittente+'\n'+ //contenuto della mail, accodo tutti i campi
          'Email: '+this.mittente+'\n'+
          'Telefono: '+this.telephoneMittente+'\n'+
          'Modello stampante: '+this.scansionato+'\n'+
          'Motivo richiesta: '+richiesta+'\n'
        }
        let url = 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages';
          this.presentToast('Richiesta inoltrata', false, 'bottom', 1000); //avvisa con toast che ha inviato il messaggio
          
          return this.cordovaHttp.post(url, body, headers);
     
      }
  
    //Nuova funzione assistenza per template nuovo
/*    sendAssist(nome:string, email: string, telephone:string, ubicazione:string, sede:string, numerocopie:string,RichiestaToner:boolean, Qualita:boolean, Inceppamenti:boolean, Altro:boolean, numeroriassunto:string) {
      //se il checkbox del tipo prodotto è attivo, prendo la frase da inserire nella mail, altrimenti metto trattino 
    if(RichiestaToner==true){
      this.RichToner='Richiesta toner\n'
    }else this.RichToner='-\n'
    if(Qualita==true){
      this.Qual='Qualità copia\n'
    }else this.Qual='-\n'
    if(Inceppamenti==true){
      this.Incepp='Inceppamenti carta\n'
    }else this.Incepp='-\n'
    if(Altro==true){
      this.Altr='Altri problemi tecnici\n'
    }else this.Altr='-\n'
      
      let headers = {
        'Authorization': 'Basic ' + this.mailgunApiKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      let body = {
        from: this.mittente, //mittente, variabile che preleva la mail dell'utente loggato
        to: this.destinatario, //destinatario, costante testuale dichiarata nelle variabili (solinonio2@gmail.com
        subject: 'Richiesta assistenza da APP - '+this.scansionato, //come oggetto del messaggio passo modello scansionato qr
        text: 'Assistenza richiesto da: '+nome+'\n'+ //contenuto della mail, accodo tutti i campi
        'Email: '+email+'\n'+
        'Telefono: '+telephone+'\n'+
        'Ubicazione: '+ubicazione+'\n'+
        'Sede: '+sede+'\n'+
        'Modello stampante: '+this.scansionato+'\n'+
        'Numero di copie: '+numerocopie+'\n'+
        'Tipologia chiamata: \n'+
        this.RichToner+
        this.Qual+
        this.Incepp+
        this.Altr+
        'Riassunto problema: '+numeroriassunto+'\n'
      }
      let url = 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages';
        this.presentToast('Richiesta inoltrata', false, 'bottom', 1000); //avvisa con toast che ha inviato il messaggio
        
        return this.cordovaHttp.post(url, body, headers);
   
    }*/
  
  //OK SANDRO -> invia la mail tramite MAILGUN prelevando il contenuto dal form (testare con QR)
/*  sendAssistance(subject: string, message: string) {
    let headers = {
      'Authorization': 'Basic ' + this.mailgunApiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    let body = {
      from: this.mittente, //mittente, variabile che preleva la mail dell'utente loggato
      to: this.destinatario, //destinatario, costante testuale dichiarata nelle variabili (solinonio2@gmail.com)
      subject: subject, //oggetto del messaggio, lo prende dal form (come oggetto posso prendere il modello letto da QR)
      //text: message //contenuto del messaggio, lo prende dal form
      text: this.scansionato //PROVA contenuto del messaggio SOLO testo scansionato, lo prende dal QR con funzione scan

    }
    let url = 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages';
      this.presentToast('Richiesta inoltrata', false, 'bottom', 1000); //avvisa con toast che ha inviato il messaggio
      
      return this.cordovaHttp.post(url, body, headers);
 
  }
*/

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }


//OK scansione QR
scanCode(){
  this.zbar.scan(this.zbarOptions)
 .then(result => {
    console.log(result); // Scanned code
    this.scannedResult = result;
    this.scansionato = this.scannedResult; //SP da testare
 })
 .catch(error => {
    alert(error); // Error message
 });
}



}

/* CONTIENE FORM classico PER INVIARE mail tramite MAILGUN (da fare: conferma messaggio inviato e azzeramento form)*/
import { Component, OnInit } from '@angular/core';
//import { EmailComposer } from '@ionic-native/email-composer/ngx'; //inviare mail da client posta
import { HTTP } from '@ionic-native/http/ngx';

import { AngularFireAuth } from '@angular/fire/auth';

import { LoadingController, ToastController } from '@ionic/angular'; //per avviso di messaggio inviato
import { CrudService } from '../../services/crud.service'; // per leggere dati da realtime db tramite le funzioni su crud.service


@Component({
  selector: 'app-preventivi',
  templateUrl: './preventivi.page.html',
  styleUrls: ['./preventivi.page.scss'],
})
export class PreventiviPage implements OnInit {

  mittente: string; //lo prelevo dalla mail dell'utente loggato
  destinatario: string = "solinonio2@gmail.com"; //destinatario di email
  nomeMittente: string; //lo prelevo dal nome dell'utente loggato
  telephoneMittente: string; //lo prelevo dal nome dell'utente loggato

  mailgunUrl: string;
  mailgunApiKey: string;

  user: any;

  multStamp:string; pcServ:string; monLavVisDisp:string;

  myRand: any;

  constructor(public cordovaHttp: HTTP/*, private emailComposer: EmailComposer*/, private fireauth: AngularFireAuth, private toastController: ToastController, private crudService: CrudService) {
    this.mailgunUrl = "sandbox1f6bb3091df0400ab1ac376e90285b9c.mailgun.org";  //"MAILGUN_URL_HERE" copier dominio mailgun
    //this.mailgunApiKey = window.btoa("api:5a135daf4f82f24d280dcc5ca34ad853-9b1bf5d3-60f81f71"); //api:key-MAILGUN_API_KEY_HERE -> copier api key
    this.mailgunApiKey = window.btoa("api:key-a026085504bec98d5d644fa0cbd417d1"); //api:key-MAILGUN_API_KEY_HERE -> copier private api key
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
  

  async presentToast(message, show_button, position, duration) {
    const toast = await this.toastController.create({
      message: message,
      position: position,
      duration: duration
    });
    toast.present();
  }

  /* send per inviare da client di posta (dichiarare   //subject='';  //body='';  //to='info@tinxy.it';)
  send(){
    let email = {
      to: this.to,
      cc:[],
      bcc:[],
      attachments:[],
      subject: this.subject,
      body: this.body,
      isHtml: false,
      app: "Gmail"
    }
    this.emailComposer.open(email);
  }
*/

//OK SANDRO -> invia la mail tramite MAILGUN prelevando il ramo dalla stringa preventivi.page.html e l'utente loggato
sendPreventivo(ramo:string) {
  
  let headers = {
    'Authorization': 'Basic ' + this.mailgunApiKey,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  let body = {
    from: this.mittente, //mittente, variabile che preleva la mail dell'utente loggato
    to: this.destinatario, //destinatario, costante testuale dichiarata nelle variabili (solinonio2@gmail.com
    subject: 'Richiesta preventivo da APP', //come oggetto del messaggio passo l'email dello scrivente
    //text: message //contenuto del messaggio, lo prende dal form
    text: 'Preventivo richiesto da: '+this.nomeMittente+'\n'+ //contenuto della mail, accodo tutti i campi
          'Email: '+this.mittente+'\n'+
          'Telefono: '+this.telephoneMittente+'\n'+
          'Vorrei maggiori informazioni su: '+ramo+'\n'
  }
  let url = 'https://api.mailgun.net/v3/' + this.mailgunUrl + '/messages';
    this.presentToast('Richiesta inoltrata', false, 'bottom', 1000); //avvisa con toast che ha inviato il messaggio
    
    return this.cordovaHttp.post(url, body, headers);

}


}

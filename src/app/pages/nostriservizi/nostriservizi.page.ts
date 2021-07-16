import { Component, OnInit } from '@angular/core';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import { AppUtilService } from '../../services/app-util.service'; //per forzare la lettura immagini da http e non usare la cache


@Component({
  selector: 'app-nostriservizi',
  templateUrl: './nostriservizi.page.html',
  styleUrls: ['./nostriservizi.page.scss'],
})
export class NostriserviziPage implements OnInit {

 /* //non viene più usato dopo la modifica al template, carico img da html 
  servizi = [
    {
      //imgs: 'assets/images/fruits/apple.jpeg',
      name: 'Arredi',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/arredi.jpg', //per caricare immagine da ftp
      urlIAB: "https://www.copierservice.it/arredi-ufficio/" //link del sito internet della categoria dei servizi
    },
    {
      //imgs: 'assets/images/fruits/bananas.jpg',
      name: 'Telefonia',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/telefonia.jpg',
      urlIAB: "https://www.copierservice.it/telefonia/"
    },
    {
      //imgs: 'assets/avatars/3.jpg',
      name: 'Visual Display',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/visual.jpg',
      urlIAB: "https://www.copierservice.it/visualdisplay/"
    },
    {
      //imgs: 'assets/avatars/5.jpg',
      name: 'Printing solution',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/printing.jpg',
      urlIAB: "https://www.copierservice.it/printing-solution/"
    },
    {
      //imgs: 'assets/avatars/6.jpg',
      name: 'Gestione documentale',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/doc.jpg',
      urlIAB: "https://www.copierservice.it/gestione-documentale/"
    },
    {
      //imgs: 'assets/avatars/7.jpg',
      name: 'Pc e Server',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/pc.jpg',
      urlIAB: "https://www.copierservice.it/pc-e-server/"
    },/*
    {
      //imgs: 'assets/avatars/4.jpg',
      name: 'Assistenza',
      urlservftp: 'https://www.tinxy.it/copier/imgcat/assistenza.jpg',
      urlIAB: "https://lnx.copierservice.it/wp/"
    },
    {
      //imgs: 'assets/avatars/8.jpg',
      name: 'Imagine', //<-Assistenza
      urlservftp: 'https://www.tinxy.it/copier/imgcat/assistenza.jpg',
      urlIAB: "https://lnx.copierservice.it/wp/"
    },
  ];
*/

  constructor(private iab: InAppBrowser, private appUtilService: AppUtilService ) { }

  ngOnInit() {
  }

  //OK SANDRO->apertura link della categoria del sito copierservice.it ( InAppBrowser )
  goToURL(url){
    //let target = "_blank"; //attiva per navigazione in app (InAppBrowser)
    let target = "_system"; //apri link su browser principale (SystemBrowser) -> NON LA USO PIU' perchè lo fa HTML
    //this.iab.create(this.servizi[i].urlIAB,target); //non viene più usato dopo la modifica al template, carico img da html
    const options: InAppBrowserOptions = {
      clearcache: "yes",
      footer: "no",
      fullscreen: "yes",
      hardwareback: "yes",
      hidespinner: "no",
      presentationstyle: "pagesheet",
      toolbar: "no",
      hidden: "yes",
      closebuttoncaption: "Close",
      hidenavigationbuttons: "yes",
      hideurlbar: "yes",
      beforeload: "yes",
      location: "yes"
    }

    const browser = this.iab.create(url, '_system', options);

    browser.on('loadstart').subscribe(event => {
    });
    browser.on('loadstop').subscribe(event => {
      browser.show();
    });
    browser.on('exit').subscribe(event => {
      browser.close();
    });
  }


//test per richiamare img ogni volta senza cache
myRand: number;

ionViewDidEnter() {
  this.myRand=this.appUtilService.random();
 }



}

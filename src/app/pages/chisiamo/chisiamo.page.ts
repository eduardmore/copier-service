import { Component, OnInit } from '@angular/core';
import { PdfViewerService } from "./../../services/pdf-viewer.service"; //per scaricare e aprire PDF
import { AppUtilService } from '../../services/app-util.service'; //per forzare la lettura immagini da http e non usare la cache

@Component({
  selector: 'app-chisiamo',
  templateUrl: './chisiamo.page.html',
  styleUrls: ['./chisiamo.page.scss'],
})
export class ChisiamoPage implements OnInit {

  myRand: number;

  constructor(private pdf: PdfViewerService, private appUtilService: AppUtilService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.myRand=this.appUtilService.random();
  }

  //OK SANDRO -> richiama funzione su pdf-viewer.service.ts per scaricare e aprire pdf con lettore pdf
  download(url, title) {
    this.pdf.download(url, title);
  }

}

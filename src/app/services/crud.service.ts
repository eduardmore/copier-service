/* CRUD Realtime Database (Create, Read, Update, Delete) */
import { Injectable } from '@angular/core';
import firebase from '@firebase/app'; 

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor() { }

    //Leggere dati da db -> l'utente lo legge nel log della pagina profilo e lo mostra nell'html (seppure lento)
    readUsername(){
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/users/' + userId+ '/username').once('value').then(function(snapshot) {
        return snapshot.val() || 'Anoynymous';
      });
    }

    readTelephone(){
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/users/' + userId+ '/telephone').once('value').then(function(snapshot) {
        return snapshot.val();
      });
    }

    //funzione specifica per leggere ramo1, sostituita da funzione generica readRamo(ramo)
/*    readRamo1(){
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/users/' + userId+ '/ramo/arredi').once('value').then(function(snapshot) {
        return snapshot.val();
      });
    }
*/

    //SANDRO OK-> funzione generica che riceve il nome del ramo figlio di USERS e restituisce il valore booleano di quel ramo
    async readRamo(nomeRamo){
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/users/' + userId+ '/ramo/' + nomeRamo).once('value').then(function(snapshot) {
        return snapshot.val();
      });
    }

    // funzione generica che riceve il nome del child figlio di PROMOZIONI e restituisce il valore di quell'attributo
    async readPromoChild(nomeRamoPromo,nomeChild){
      return firebase.database().ref('/promozioni/' +nomeRamoPromo+ '/' + nomeChild).once('value').then(function(snapshot) {
        return snapshot.val();
      });
    }

        // funzione generica che riceve il nome del ramo della promozione e il nome ramo compatibile di PROMOZIONI e restituisce il valore di quell'attributo
        async readPromoCompatibilita(nomeRamoPromo,nomeRamoComp){
          return firebase.database().ref('/promozioni/' +nomeRamoPromo+ '/compatibileUtenti/' + nomeRamoComp).once('value').then(function(snapshot) {
            return snapshot.val();
          });
        }

    
}

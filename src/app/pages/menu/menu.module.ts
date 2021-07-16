import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/main',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      //elencare qui le varie voci del menu (creare la pagine dentro pages/NuovaPagina)
      { 
        path: 'main',
        loadChildren: () => import('../main/main.module').then( m => m.MainPageModule)
      },
      { 
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      { 
        path: 'chisiamo',
        loadChildren: () => import('../chisiamo/chisiamo.module').then( m => m.ChisiamoPageModule)
      },
      { 
        path: 'nostriservizi',
        loadChildren: () => import('../nostriservizi/nostriservizi.module').then( m => m.NostriserviziPageModule)
      },
      { 
        path: 'assistenza',
        loadChildren: () => import('../assistenza/assistenza.module').then( m => m.AssistenzaPageModule)
      },
      { 
        path: 'preventivi',
        loadChildren: () => import('../preventivi/preventivi.module').then( m => m.PreventiviPageModule)
      },
      { 
        path: 'promo',
        loadChildren: () => import('../promo/promo.module').then( m => m.PromoPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}

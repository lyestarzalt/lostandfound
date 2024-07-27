// src/app/tabs/tabs-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {HomePageModule} from '../home/home.module'
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'my-listings',
        loadChildren: () => import('../my-listings/my-listings.module').then(m => m.MyListingsPageModule)
      },
      {
        path: 'account-settings',
        loadChildren: () => import('../account-settings/account-settings.module').then(m => m.AccountSettingsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  {
    path: 'tabs',
    loadChildren: () => import('./nav_bar/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'add-item', loadChildren: () => import('./pages/add-item/add-item.module').then(m => m.AddItemPageModule) },
  { path: 'item-detail/:id', loadChildren: () => import('./pages/item-detail/item-detail.module').then(m => m.ItemDetailPageModule) },
  {
    path: 'edit-item/:id',
    loadChildren: () => import('./pages/edit-item/edit-item.module').then(m => m.EditItemPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';

const routes: Routes = [
  {
    path: '',
    component: FolderPage
  },
  {
    path: 'customer-returns',
    loadChildren: () => import('./customer-returns/customer-returns.module').then( m => m.CustomerReturnsPageModule)
  },
  {
    path: 'create-rma',
    loadChildren: () => import('./create-rma/create-rma.module').then( m => m.CreateRmaPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}

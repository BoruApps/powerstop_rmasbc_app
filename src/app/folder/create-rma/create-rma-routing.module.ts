import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateRmaPage } from './create-rma.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRmaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRmaPageRoutingModule {}

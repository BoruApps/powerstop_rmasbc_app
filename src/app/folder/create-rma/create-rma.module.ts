import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRmaPageRoutingModule } from './create-rma-routing.module';

import { CreateRmaPage } from './create-rma.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRmaPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [CreateRmaPage]
})
export class CreateRmaPageModule {}

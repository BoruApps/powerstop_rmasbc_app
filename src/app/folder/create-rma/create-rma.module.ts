import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRmaPageRoutingModule } from './create-rma-routing.module';

import { CreateRmaPage } from './create-rma.page';

import {ChecklistPage} from './checklist/checklist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateRmaPageRoutingModule,ReactiveFormsModule
  ],
  declarations: [CreateRmaPage,ChecklistPage],
  entryComponents: [ChecklistPage]
})
export class CreateRmaPageModule {}

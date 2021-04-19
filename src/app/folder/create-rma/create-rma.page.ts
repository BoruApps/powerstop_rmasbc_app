import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl , FormArray} from "@angular/forms";
import {ApiRequestService} from '../customer-returns/api-request.service';
import Swal from 'sweetalert2';
import {NavController, ToastController, AlertController, ModalController} from '@ionic/angular';
import {ChecklistPage} from './checklist/checklist.page';
@Component({
  selector: 'app-create-rma',
  templateUrl: './create-rma.page.html',
  styleUrls: ['./create-rma.page.scss'],
})
export class CreateRmaPage implements OnInit {
  formGroup: FormGroup;
  userdata: Object;
  num_row: number = 1;
  constructor(
      public formBuilder: FormBuilder,
      public apiRequestService: ApiRequestService,
      private navCtrl: NavController,
      public modalCtrl: ModalController
  ) {
    this.formGroup = this.formBuilder.group({
      customerName: [
        "",
        Validators.compose([
          //Validators.pattern("[0-9a-z-A-Z-_]*"),
          Validators.required
        ])
      ],
      phoneNumber: [
        "",
        Validators.compose([
        ])
      ],
      purchaseOrder: [
        "",
        Validators.compose([
        ])
      ],
      trackingNumber: [
        "",
        Validators.compose([
        ])
      ],
      /*partNumber: [
        "",
        Validators.compose([
          Validators.required
        ])
      ],*/
      partNumbers     : this.formBuilder.array([])
    });
  }

  get partNumbers() {
    return this.formGroup.controls["partNumbers"] as FormArray;
  }


  ngOnInit() {
    this.apiRequestService.isLogged().then(result => {
      if (!(result == false)) {
        console.log('loading storage data (within param route function)', result);
        this.userdata = result;
        this.addNewRow();
      } else {
        console.log('nothing in storage, going back to login');
        this.apiRequestService.logout();
      }
    });
  }
  createRMA(formData: any){
    console.log(formData);
    var form = this.formGroup;
    this.apiRequestService.showLoading();
    this.apiRequestService.post(this.apiRequestService.ENDPOINT_CREATERMA, formData).subscribe(response => {
      console.log(response);
      if (response.body.success){
        this.openModal(response.body.data);
      }else{
        Swal.fire(response.body.message);
        this.apiRequestService.hideLoading();
      }
    },  error => {
      Swal.fire('Can not connect to Server.');
      this.apiRequestService.hideLoading();
    });

  }
  addNewRow(){
    const partNumberForm = this.formBuilder.group({
      partNumber: ['', Validators.required]
    });
    this.partNumbers.push(partNumberForm);
  }

  deleteRow(i:number){
    this.partNumbers.removeAt(i);
  }

  async openModal(data){
    const modal = await this.modalCtrl.create({
      component: ChecklistPage,
      cssClass: 'checklist-modal',
      componentProps: {
        "assets": data
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
    });
    this.apiRequestService.hideLoading();
    return await modal.present();
  }
}

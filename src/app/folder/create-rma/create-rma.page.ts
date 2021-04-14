import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {ApiRequestService} from '../customer-returns/api-request.service';
import Swal from 'sweetalert2';
import {NavController, ToastController, AlertController, ModalController} from '@ionic/angular';
@Component({
  selector: 'app-create-rma',
  templateUrl: './create-rma.page.html',
  styleUrls: ['./create-rma.page.scss'],
})
export class CreateRmaPage implements OnInit {
  formGroup: FormGroup;
  userdata: Object;
  constructor(
      public formBuilder: FormBuilder,
      public apiRequestService: ApiRequestService,
      private navCtrl: NavController
  ) {
    this.formGroup = formBuilder.group({
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
      partNumber: [
        "",
        Validators.compose([
          Validators.required
        ])
      ]
    });
  }

  ngOnInit() {
    this.apiRequestService.isLogged().then(result => {
      if (!(result == false)) {
        console.log('loading storage data (within param route function)', result);
        this.userdata = result;
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
        Swal.fire(response.body.message).then(function(result) {
          form.reset()
        });

      }else{
        Swal.fire(response.body.message);
      }
      this.apiRequestService.hideLoading();
    },  error => {
      Swal.fire('Can not connect to Server.');
      this.apiRequestService.hideLoading();
    });

  }
}

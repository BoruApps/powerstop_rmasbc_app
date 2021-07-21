import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ApiRequestService} from './api-request.service';
import {ChecklistModalPage} from './checklist-modal/checklist-modal.page';
import {NavController, ToastController, AlertController, ModalController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-customer-returns',
  templateUrl: './customer-returns.page.html',
  styleUrls: ['./customer-returns.page.scss'],
})
export class CustomerReturnsPage implements OnInit {

  constructor(
      public apiRequestService: ApiRequestService,
      public modalCtrl: ModalController,
      public storage: Storage,
      private navCtrl: NavController,
      private router: Router,
      public alertController: AlertController
  ) { }
  
  public barcode: any = '';
  userdata: Object;

  async showBarcodeModal(){
    //Swal.fire('Testing', 'Test', 'success'); //this works
    const {value: barcode } = await Swal.fire({
      title: 'Scan or Enter Barcode',
      input: 'text',  
      inputPlaceholder: 'Enter Barcode #',
      inputLabel: "Barcode #"
    });
    this.addSwalEventListener();
    if (barcode) { 
      this.barcode = barcode;
      var params = {
        barcode: barcode
      }
      this.apiRequestService.showLoading();
      this.apiRequestService.post(this.apiRequestService.ENDPOINT_CHECK_BARCODE, params).subscribe(response => {
        console.log(response);
        if (response.body.success){
          var data = response.body.data;
          if(data.scan_so == 1){
            this.showConfirmMismatch(barcode, response.body.message);
            //Swal.fire(response.body.message);
          }else{
              //scan line item, show checklist
            this.openModal(data,0);
          }
        }else{
          if(response.body.message == 'Item already full scanned.'){
            var data = response.body.data;
            if(Object.keys(data.ass_detail).length > 0){
              this.showConfirm(data);
            }
            // tslint:disable-next-line:triple-equals
          } else if (response.body.code == 1){
              this.showConfirmMismatch(barcode, response.body.message);
          } else {
            Swal.fire(response.body.message);
          }
        }
        this.apiRequestService.hideLoading();
      },  error => {
        Swal.fire('Can not connect to Server.');
        this.apiRequestService.hideLoading();
      });
    }
  }

  async showConfirm(data){
  const alert =  await this.alertController.create({
    cssClass: 'confirm',
    header: 'Confirm!',
    message: "Item full scanned. Would you like you like to make updates to the Inspection Checklist? ",
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.openModal(data,1);
        }
      }
    ]
  });
  return await alert.present();
}

  addSwalEventListener(){ 
    console.log('doing')
    document.getElementById('swal2-input').addEventListener('input', function() {
      console.log('updated')
      let confirm: HTMLElement  = document.querySelector('.swal2-confirm') as HTMLElement;
      confirm.click();
    })
  }

  async openModal(data, is_update) {
  const modal = await this.modalCtrl.create({
    component: ChecklistModalPage,
    cssClass: 'checklist-modal',
    componentProps: {
      "recordid": data.record,
      "seq_no": data.seq_no,
      "ass_detail": data.ass_detail,
      "is_update": is_update,
      "part_number": data.part_number,
      "description": data.description,
    }
  });

  modal.onDidDismiss().then((dataReturned) => {
  });

  return await modal.present();
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

  ngAfterContentInit(){ 
   //console.log(document.getElementById('showbarc'))
    
  }
  createRMA(){
    this.navCtrl.navigateForward('/folder/Home/create-rma');
  }

  public async showConfirmMismatch(barcode: string, message: string): Promise<any> {
      const self = this;
      const alert =  await this.alertController.create({
          cssClass: 'confirm',
          header: 'Confirm!',
          message: 'Doesn\'t match anything on the RMA, would you like to add this to the RMA as a mismatched item?',
          buttons: [
              {
                  text: 'No',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {
                    Swal.fire(message);
                  }
              }, {
                  text: 'Yes',
                  handler: () => {
                    self.showMismatchPopup(barcode);
                  }
              }
          ]
      });
      return await alert.present();
  }

  public async showMismatchPopup(barcode: string): Promise<any>{
      const self = this;
      const {value: itemCode } = await Swal.fire({
          title: 'Scan or Enter Product SKU#',
          input: 'text',
          inputPlaceholder: 'Enter Product SKU#',
          inputLabel: 'Product SKU #'
      });
      if (itemCode) {
          const params = {
              rmaCode: barcode,
              productCode: itemCode
          };
          self.apiRequestService.showLoading();
          self.apiRequestService.post(this.apiRequestService.ENDPOINT_MISMATCH, params).subscribe(response => {
              self.apiRequestService.hideLoading();
              if (response.body.message){
                  Swal.fire(response.body.message);
              }
          },  error => {
              self.apiRequestService.hideLoading();
              Swal.fire('Can not connect to Server.');
          });
      }
  }
}

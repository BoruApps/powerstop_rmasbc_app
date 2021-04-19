import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ApiRequestService} from '../../customer-returns/api-request.service';
import {NavController, ToastController, AlertController, ModalController,NavParams} from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl , FormArray} from "@angular/forms";

@Component({
    selector: 'app-checklist',
    templateUrl: './checklist.page.html',
    styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
    assets: any;
    userdata: Object;
    formGroup: FormGroup;
    constructor(
        public formBuilder: FormBuilder,
        public apiRequestService: ApiRequestService,
        public modalCtrl: ModalController,
        private navParams: NavParams,
    ) {
        this.formGroup = this.formBuilder.group({
            partNumbers     : this.formBuilder.array([])
        });
    }

    get partNumbers() {
        return this.formGroup.controls["partNumbers"] as FormArray;
    }

    addNewRow(asset){
        const partNumberForm = this.formBuilder.group({
            correct_part: ['', Validators.required],
            actual_condition: ['', Validators.required],
            inspected_condition: ['', Validators.required]
        });
        this.partNumbers.push(partNumberForm);
    }

    ngOnInit() {
        this.apiRequestService.isLogged().then(result => {
            if (!(result == false)) {
                console.log('loading storage data (within param route function)', result);
                this.userdata = result;
                this.loadData();
            } else {
                console.log('nothing in storage, going back to login');
                this.apiRequestService.logout();
            }
        });
    }
    loadData() {
        this.assets = this.navParams.data.assets;
        this.assets.forEach((key, value) => {
            console.log(value+':-:'+key);
            this.addNewRow(value);
        });
    }

    addUpdate(event) {
        var fieldname = event.target.name;
        console.log(fieldname);
        var is_checked = event.detail.checked;
        console.log(is_checked);
    }

    SaveCheckList(formData: any){
        console.log(formData);
        console.log('Save checklist');
        var params = {};
        return;
        this.apiRequestService.post(this.apiRequestService.ENDPOINT_SAVE_CHECKLIST, params).subscribe(response => {
            console.log(response);
            Swal.fire(response.body.message);
            this.modalCtrl.dismiss();
        },  error => {
            Swal.fire('Can not connect to Server.');
        });
    }
    closeModal() {
        this.modalCtrl.dismiss();
    }


}
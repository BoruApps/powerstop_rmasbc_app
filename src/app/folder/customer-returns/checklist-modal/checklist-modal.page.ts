import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ApiRequestService} from '../api-request.service';
import {NavController, ToastController, AlertController, ModalController,NavParams} from '@ionic/angular';

@Component({
    selector: 'app-checklist-modal',
    templateUrl: './checklist-modal.page.html',
    styleUrls: ['./checklist-modal.page.scss'],
})
export class ChecklistModalPage implements OnInit {
    isCorrectPartYes: boolean=false;
    isCorrectPartNo: boolean=false;
    isActualConditionNo: boolean=false;
    isActualConditionYes: boolean=false;
    inspectedCondition: any;
    userdata: Object;
    recordid :any;
    seq_no : any;
    ass_detail : any;
    is_update : any;
    constructor(
        public apiRequestService: ApiRequestService,
        public modalCtrl: ModalController,
        private navParams: NavParams,
    ) {
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
        this.recordid = this.navParams.data.recordid;
        this.seq_no = this.navParams.data.seq_no;
        this.ass_detail = this.navParams.data.ass_detail;
        this.is_update = this.navParams.data.is_update;
        if(Object.keys(this.ass_detail).length > 0){
            if(this.ass_detail.cf_correct_part == 1){
                this.isCorrectPartYes = true;
            }else if(this.ass_detail.cf_correct_part == 0){
                this.isCorrectPartNo = true;
            }

            if(this.ass_detail.cf_condition_part_match == 1){
                this.isActualConditionYes = true;
            }else if(this.ass_detail.cf_condition_part_match == 0){
                this.isActualConditionNo = true;
                this.inspectedCondition = this.ass_detail.cf_condition;
            }
        }
    }

    addUpdate(event) {
        var fieldname = event.target.name;
        console.log(fieldname);
        var is_checked = event.detail.checked;
        console.log(is_checked);
        if(fieldname == 'actual_condition_no'){
            if(is_checked) {
                this.isActualConditionNo = true;
                this.isActualConditionYes = false;
            }else{
                this.isActualConditionNo = false;
            }

        }
        if(fieldname == 'actual_condition_yes'){
            if(is_checked) {
                this.isActualConditionYes = true;
                this.isActualConditionNo = false;
                this.inspectedCondition = '';
            }else{
                this.isActualConditionYes = false;
            }

        }
        if(fieldname == 'correct_part_yes'){
            if(is_checked) {
                this.isCorrectPartYes = true;
                this.isCorrectPartNo = false;
            }else{
                this.isCorrectPartYes = false;
            }

        }
        if(fieldname == 'correct_part_no'){
            if(is_checked) {
                this.isCorrectPartNo = true;
                this.isCorrectPartYes = false;
            }else{
                this.isCorrectPartNo = false;
            }

        }

        if(fieldname == 'inspected_condition'){
            this.inspectedCondition = event.target.value;
        }
        console.log('xxx isCorrectPartYes '+ this.isCorrectPartYes);
        console.log('xxx isCorrectPartNo'+ this.isCorrectPartNo);
    }

    SaveCheckList(){
        console.log('Save checklist');
        var params = {
            recordid: this.recordid,
            seq_no: this.seq_no,
            isCorrectPartNo: this.isCorrectPartNo,
            isCorrectPartYes: this.isCorrectPartYes,
            inspectedCondition: this.inspectedCondition,
            isActualConditionYes: this.isActualConditionYes,
            isActualConditionNo: this.isActualConditionNo,
            is_update: this.is_update,
        }
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
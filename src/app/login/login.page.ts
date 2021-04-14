import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {ApiRequestService} from '../folder/customer-returns/api-request.service';
import { Storage } from '@ionic/storage';
import {ToastController, NavController, MenuController} from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      public apiRequestService: ApiRequestService,
      public storage: Storage,
      private navCtrl: NavController,
      public menuCtrl: MenuController
  ) {
  }

  userdata: Object;


  ngOnInit() {
    this.menuCtrl.enable(false);
    this.apiRequestService.isLogged().then(result => {
      if (!(result == false)) {
        console.log('loading storage data', result);
        this.login(result, "auto");
      } else {
        console.log('init login failed');
      }
    })
  }

  login(form: any, origin: any) {
    //TODO: Wrap storage setting and data setting to API call return
    console.log('login function accessed');
    this.apiRequestService.showLoading();
    if (origin == 'manual') {
      console.log('login clicked');
      var data = form.value;
      var username = data.email;
      var password = data.password;
      console.log(form.value);
      this.apiRequestService.post(this.apiRequestService.ENDPOINT_LOGIN, form.value).subscribe(response => {
        //this.hideLoading();
        console.log(response['body']);
        var verified = response['body']['success'];
        console.log('login response was', verified);

        if (verified == true) {
          var userdata = response['body']['data'];
          console.log('usersdata', userdata);
          //this.storage.ready().then(() => {
          this.userdata = userdata;
          this.storage.set('userdata', this.userdata);
          this.navCtrl.navigateForward('/folder/Home');
          this.menuCtrl.enable(true);
          // })
        } else {
          console.log('login failed');
          Swal.fire('Login failed. Please try again');
        }
        this.apiRequestService.hideLoading();
      }, error => {
        this.apiRequestService.hideLoading();
        //console.log(error);
        //console.log(error.message);
        console.log('login failed');
        Swal.fire('Login failed. Please try again');
      });
      /* Verify user login */

    } else if (origin == 'auto') {
      //this.hideLoading();
      console.log('auto login from session');
      //return this.router.navigate(["/tabs/services", form]);
      this.navCtrl.navigateForward('/folder/Home/customer-returns');
    }

    return false;
  }

  movefocus(e, ref) {
    if (e.key == "Enter") {
      console.log(e.key);
      ref.setFocus();
    }
  }

  submit(e, ref) {
    if (e.key == "Enter") {
      console.log('submitting');
      let el: HTMLElement = document.getElementById('submit-button') as HTMLElement;
      el.click()
    }
  }

}

import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {ApiRequestService} from './folder/customer-returns/api-request.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/Home', icon: 'home' },
    { title: 'Customer Returns Flow', url: '/folder/Home/customer-returns', icon: 'cart' },
  ];
  public utilityPages = [
    { title: 'Profile', url: '/folder/Profile', icon: 'person-circle' },
  ];
  constructor(
      public storage: Storage,
      public apiRequestService: ApiRequestService
  ) {
    this.storage.create();
  }

  logout(){
    this.apiRequestService.logout();
  }

  ngOnInit() {
    this.apiRequestService.isLogged().then(result => {
      if (!(result == false)) {
      } else {
        console.log('nothing in storage, going back to login');
        this.apiRequestService.logout();
      }
    });
  }
}

import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { OffersPage } from '../offers/offers';
import { ProfilePage } from '../profile/profile';
import { Company } from '../../models/company';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userInfo: any = {};
  isUserLoggedIn: boolean = false;
  company: Company = new Company;
  constructor(public platform: Platform,
    public navCtrl: NavController, 
    private toast: Toast,
    public userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    if (this.platform.is('core')) {    }
    this.userInfo = this.userService.getUser();
    console.log('HomePage : ionViewDidLoad : line 32 : this.userInfo ' , this.userInfo);    
    this.isUserLoggedIn = this.userInfo.isUserLoggedIn;
    this.company = this.userService.getCompany();
  }

  public showWelcomeToast(){
    this.toast.show(this.userInfo.first_name, '5000', 'center').subscribe(
      toast => {
        console.log(this.userInfo.first_name);
      }
    );
  }
  
  public goOffersPage(){
    this.navCtrl.setRoot(OffersPage);    
  }
  public goProfilePage(){
    this.navCtrl.setRoot(ProfilePage);    
  }
}

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Facebook} from '@ionic-native/facebook'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  isUserLoggedIn: any = false;
  userInfo: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  loginWithFB(){
    this.fb.login(["public_profile","email"]).then( loginRes => {
      this.fb.api('me/?fields=id,email,first_name,picture',["public_profile","email"]).then( apiRes => {
        
        this.userInfo = apiRes;
        this.isUserLoggedIn = true;

      }).catch( apiErr => console.log(apiErr));

    }).catch( loginErr => console.log(loginErr) )
  }

  logout(){
    this.fb.logout().then( logoutRes => 
      this.isUserLoggedIn = false
    ).catch(logoutErr => 
      console.log(logoutErr)
    );
  }
  
  public onClickCancel() {
    this.navCtrl.pop();
  }
}

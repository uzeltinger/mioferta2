import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { Toast } from '@ionic-native/toast';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the LoginFacebookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-facebook',
  templateUrl: 'login-facebook.html',
})
export class LoginFacebookPage {

  showSplash = true; // <-- show animation
  isUserLoggedIn: any = false;
  user: User = new User;
  facebookUserData = new User;
  userInfo: any;
  errorMessage: string;

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public fb: Facebook, 
    private toast: Toast,
    public userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginFacebookPage');

    if (this.platform.is('core')) {
      this.loginWithFBCore();   
    }
    
    if (this.platform.is('android')) {
      this.loginWithFB();   
    }
  }

  loginWithFBCore(){
        this.isUserLoggedIn = false;     
        this.facebookUserData.isUserLoggedIn = false;   
        this.facebookUserData.facebook_id = "123456";
        this.facebookUserData.google_id = null;
        this.facebookUserData.email = "fabiouz@gmail.com";
        this.facebookUserData.first_name = "Fabio";
        this.facebookUserData.last_name = "Uzeltinger";
        this.facebookUserData.picture = "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10156529424594907&height=50&width=50&ext=1532533092&hash=AeTtgpZ8u1AifWe2";
        
        //this.userInfo = this.facebookUserData;
        console.log('line: 55 this.userInfo',this.userInfo);

        this.userService.setUserFacebook(this.facebookUserData)
        .subscribe(
          userRegisteredData => {
            console.log('userRegisteredData: ',userRegisteredData);
            if(userRegisteredData.error){
              console.log('userRegisteredData.error : ',userRegisteredData.error);
              this.showSplash = false;
            }else{
              this.userInfo = userRegisteredData.userData;
              this.userService.setUserToken(userRegisteredData.userData.token);
              this.goProfilePage();
              this.showSplash = false;
            }
            
          },
          error => {
            this.errorMessage = <any>error;
            //console.log('error: ',error);          
          }
        );       
  }

  loginWithFB(){
    this.fb.login(["public_profile","email"]).then( loginRes => {
      this.fb.api('me/?fields=id,email,first_name,last_name,picture',["public_profile","email"]).then( apiRes => {
        
        this.userInfo = apiRes;
        this.facebookUserData.isUserLoggedIn = false;   
        this.facebookUserData.facebook_id = apiRes.id;
        this.facebookUserData.google_id = "";
        this.facebookUserData.email = apiRes.email;
        this.facebookUserData.first_name = apiRes.first_name;
        this.facebookUserData.last_name = apiRes.last_name;
        this.facebookUserData.picture = apiRes.picture.data.url;        
        this.isUserLoggedIn = false;
        console.log('line: 65  apiRes',apiRes);
        console.log('line: 65 this.userInfo',this.userInfo);
        
        this.userService.setUserFacebook(this.facebookUserData)
        .subscribe(
          userRegisteredData => {
            if(userRegisteredData.error){
              console.log('userRegisteredData.error : ',userRegisteredData.error);
              this.showSplash = false;
            }else{
              console.log('userRegisteredData: ',userRegisteredData);  
              this.userInfo = userRegisteredData.userData;
              this.userService.setUserToken(userRegisteredData.userData.token);
              this.goProfilePage();
              this.showSplash = false;
            }
          },
          error => {
            this.errorMessage = <any>error;
            //console.log('error: ',error);          
          }
        );
        
        this.toast.show('Bienvenido ' + this.userInfo.first_name, '3000', 'bottom').subscribe(
          toast => {
            console.log('line: 109  toast this.userInfo.first_name ',this.userInfo.first_name);
          }
        );

      }).catch( apiErr => console.log(apiErr));

    }).catch( loginErr => console.log(loginErr) )
  }

  logout(){
    if (this.platform.is('core')) {
      this.isUserLoggedIn = false;
      this.userService.logoutUser(this.userInfo);
      this.onClickCancel();
    }
    this.fb.logout().then( logoutRes => 
      function (){this.isUserLoggedIn = false;
        this.userService.logoutUser(this.userInfo);}
    ).catch(logoutErr => 
      console.log(logoutErr)
    );
  }
  
  public onClickCancel() {
    //this.navCtrl.pop();
    this.navCtrl.push(ProfilePage);
  }
  goProfilePage(){
    this.navCtrl.setRoot(ProfilePage);
  }
}

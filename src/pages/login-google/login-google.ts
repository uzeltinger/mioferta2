import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { GooglePlus } from '@ionic-native/google-plus';
import { User } from '../../models/user';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the LoginGooglePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-google',
  templateUrl: 'login-google.html',
  providers: [GooglePlus]
})
export class LoginGooglePage {
  showSplash = true; // <-- show animation
  isUserLoggedIn: any = false;
  user: User = new User;
  userInfo: any;
  errorMessage: string;
  googleUserData: any = {};  
  isLoggedIn:boolean = false;

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private toast: Toast,
    private googlePlus: GooglePlus,
    public userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginGooglePage');

      if (this.platform.is('core')) {
        this.loginCore();   
      }
      
      if (this.platform.is('android')) {
        this.login();   
      }

  }
  loginCore(){
    this.isUserLoggedIn = false;     
        this.googleUserData.isUserLoggedIn = false;   
        this.googleUserData.facebook_id = null;
        this.googleUserData.google_id = "123456";
        this.googleUserData.email = "emiliouzeltinger@gmail.com";
        this.googleUserData.first_name = "Emilio";
        this.googleUserData.last_name = "Uzeltinger";
        this.googleUserData.picture = "https://scontent.fbhi1-1.fna.fbcdn.net/v/t1.0-1/p160x160/12494725_624104577728266_2934891491423222463_n.jpg?_nc_cat=0&oh=e510dd6c3bb1f09350ce58bb60169a56&oe=5C064A5A";
        
        //this.userInfo = this.googleUserData;
        console.log('line: 55 this.userInfo',this.userInfo);

        this.userService.setUserGoogle(this.googleUserData)
        .subscribe(
          userRegisteredData => {
            if(userRegisteredData.error){
              console.log('userRegisteredData.error : ',userRegisteredData.error);
              this.showSplash = false;
            }else{
              console.log('userRegisteredData: ',userRegisteredData);  
              this.userInfo = userRegisteredData.userData;
              //this.goProfilePage();
              this.showSplash = false;
              this.userService.setUserToken(userRegisteredData.userData.token);
              this.goProfilePage();
            }
          },
          error => {
            this.errorMessage = <any>error;
            //console.log('error: ',error);          
          }
        );    
  }
  login() {
    this.googlePlus.login({})
      .then(res => {
        console.log('LoginGooglePage login : res : line 94', res);
        
        //this.accessToken = res.accessToken;


        this.isUserLoggedIn = false;     
        this.googleUserData.isUserLoggedIn = false;   
        this.googleUserData.facebook_id = "";
        this.googleUserData.google_id = res.userId;
        this.googleUserData.email = res.email;
        this.googleUserData.first_name = res.givenName;
        this.googleUserData.last_name = res.familyName;
        this.googleUserData.picture = res.imageUrl;
        

        this.userService.setUserGoogle(this.googleUserData)
        .subscribe(
          userRegisteredData => {
            if(userRegisteredData.error){
              console.log('LoginGooglePage setUserGoogle userRegisteredData.error 119: ',userRegisteredData.error);
              this.showSplash = false;
            }else{
              console.log('LoginGooglePage setUserGoogle userRegisteredData: 122',userRegisteredData);  
              //this.userInfo = userRegisteredData.userData;
              //this.goProfilePage();
              this.userService.setUserToken(userRegisteredData.userData.token);
              this.showSplash = false;
              this.goProfilePage();
            }
          },
          error => {
            this.errorMessage = <any>error;
            //console.log('error: ',error);          
          }
        );
        
        this.toast.show('Bienvenido ' + this.googleUserData.first_name, '3000', 'bottom').subscribe(
          toast => {
            console.log('LoginGooglePage line: 109  toast this.userInfo.first_name ',this.googleUserData.first_name);
          }
        );


      })
      .catch(err => console.error('LoginGooglePage login : err : line 128: ',err));
  }

  logout() {
    this.googlePlus.logout()
      .then(res => {
        console.log('LoginGooglePage logout : res : line 134', res);        
        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
  }
  goProfilePage(){
    this.navCtrl.setRoot(ProfilePage);
  }
}

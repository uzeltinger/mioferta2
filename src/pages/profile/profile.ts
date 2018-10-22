import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { HomePage } from '../home/home';
import { LoginFacebookPage } from '../login-facebook/login-facebook';
import { LoginGooglePage } from '../login-google/login-google';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Toast } from '@ionic-native/toast';
import { EditOffersPage } from '../edit-offers/edit-offers';
import { EditOfferPage } from '../edit-offer/edit-offer';
import { ProfileAutocompleteAddressPage } from '../profile-autocomplete-address/profile-autocomplete-address';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  isUserLoggedIn: boolean = false;
  userInfo: User = new User;
  company: Company = new Company;
  showSplash: boolean;
  errorMessage: any;
  profileAddress: any = { "place": "" };
  latitude: string;
  longitude: string;
  address: string;
  street_number: string;
  countryId: number;
  county: string;
  province: string;
  city: string;
  postal_code: string;

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: Facebook,
    private toast: Toast,
    private googlePlus: GooglePlus,
    public userService: UserServiceProvider,
    private modalCtrl: ModalController,
    private push: Push) { }

  ionViewDidLoad() {
    this.showSplash = true;
    this.suscribeUserInfo();    
    //this.userInfo = this.userService.getUser();
    //this.isUserLoggedIn = this.userInfo.isUserLoggedIn;
    //this.company = this.userService.getCompany();
    let date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    var toDay = new Date();
    var options = {
      year: "numeric", month: "short", day: "numeric"
    };
    console.log('toLocaleDateString', date.toLocaleDateString("es-ar", options));

  }
  suscribeGetCompany() {
    this.userService.suscribeGetCompany()
      .subscribe(
        (data) => {
          setTimeout(() => {
            console.log('suscribeGetCompany', data);
            this.company = data;
            this.showSplash = false;
            setTimeout(() => {
              this.formatCompanyAddress(this.company);
            }, 100);
          }, 100);
        },
        (error) => {
          console.log('error', error);
          this.showSplash = false;
        }
      )
  }
  suscribeUserInfo() {
    this.userService.suscribeUserInfo()
      .subscribe(
        (data) => {
          setTimeout(() => {
            console.log('suscribeUserInfo', data);
            this.checkUserData(data);
          }, 500);
        },
        (error) => {
          console.log('error', error);
          this.showSplash = false;
        }
      )
  }
  checkUserData(data) {
    this.userInfo = data;    
    this.isUserLoggedIn = data.isUserLoggedIn;    
    if(!this.isUserLoggedIn){
      
      this.showSplash = false;
  //    this.userService.logoutUser(this.userInfo);
    }else{
      this.suscribeGetCompany();
      
    }
    if (this.platform.is('android')) {
      if(this.isUserLoggedIn){
        this.pushNotifications(data);
      }
    }
  }

  formatCompanyAddress(company) {
    let addressFormated = company.address + ' ' + company.street_number;
    addressFormated = addressFormated + ', ' + company.city;
    addressFormated = addressFormated + ', ' + company.county;
    addressFormated = addressFormated + ', Argentina';
    this.profileAddress.place = addressFormated;
    console.log('formatCompanyAddress',addressFormated);
  }

  logout() {
    if (this.platform.is('android')) {
      console.log('Perfil logout line 44 platform.is.android');
      this.fb.getLoginStatus()
        .then(res => {
          console.log('Perfil logout line 48 res.status: ', res.status);
          if (res.status === "connect") {
            this.fb.logout().then(logoutRes => {
              this.isUserLoggedIn = false;
              this.userService.logoutUser(this.userInfo);
              console.log('Perfil logout line 61 logoutRes', logoutRes);
              //this.navCtrl.setRoot(HomePage);
            }
            ).catch(logoutErr =>
              console.log('logoutErr', logoutErr)
            );
          } else {
            this.logoutFromGoogle();
          }
        })
        .catch(e => console.log(e)
        );
    }

    if (this.platform.is('core')) {
      this.isUserLoggedIn = false;
      this.userService.logoutUser(this.userInfo);
      console.log('Perfil logout line 84 logoutUser');
      this.navCtrl.setRoot(HomePage);
    }

  }

  public logoutFromGoogle() {
    this.googlePlus.trySilentLogin().then(res => {
      console.log('LoginGooglePage logout : trySilentLogin : line 86', res);
    })
      .catch(
        err => console.error('error logout line 89: ', err)
      );

    this.googlePlus.logout()
      .then(res => {
        console.log('LoginGooglePage logout : res : line 95', res);
        this.isUserLoggedIn = false;
        this.userService.logoutUser(this.userInfo);
      })
      .catch(err => {
        console.error('error logout line 99: ', err);
        this.isUserLoggedIn = false;
        this.userService.logoutUser(this.userInfo);
      }
      );
  }

  public goLoginFacebookPage() {
    this.navCtrl.push(LoginFacebookPage);
  }
  public goLoginGooglePage() {
    this.navCtrl.push(LoginGooglePage);
  }
  public goEditOffersPage() {
    this.navCtrl.push(EditOffersPage);
  }
  goNewOfferPage() {
    let newOffer: object = { 'id': '0' };
    console.log('newOffer', newOffer);
    this.navCtrl.push(EditOfferPage, {
      offer: newOffer
    });
  }

  companyForm(form) {
    console.log('form this.company: ', this.company);
    this.showSplash = true;
    //this.showSplash = true;
    this.userService.sendCompanyData(this.company)
      .subscribe(
        companyData => {
          console.log('companyData: ', companyData);
          if (companyData.error) {
            console.log('companyData.error : ', companyData.error);
            this.showSplash = false;
            this.showToast('Error: ' + companyData.error);
          } else {
            //this.userInfo = companyData.userData;
            //this.goProfilePage();
            this.showSplash = false;
            this.showToast('Comercio actualizado');
          }

        },
        error => {
          this.errorMessage = <any>error;
          this.showToast('Error: ' + this.errorMessage);
          this.showSplash = false;
          //console.log('error: ',error);          
        }
      );
  }




  showAddressModal() {
    let modal = this.modalCtrl.create(ProfileAutocompleteAddressPage);
    //let me = this;
    modal.onDidDismiss(data => {
      console.log('aca', typeof data);
      if (typeof data != "undefined" && data != null) {
        console.log('data', data);
        this.profileAddress.place = data.formatted_address;
        this.placeToAddress(data);
        console.log('this.profileAddress.place', this.profileAddress.place);
      }

    });
    modal.present();
  }

  placeToAddress(place) {
    this.company.latitude = place.geometry.location.lat();
    this.company.longitude = place.geometry.location.lng();
    place.address_components.forEach(c => {
      switch (c.types[0]) {
        case 'street_number':
          this.company.street_number = c.long_name;
          break;
        case 'route':
          this.company.address = c.long_name;
          break;
        case 'neighborhood': case 'locality':    // North Hollywood or Los Angeles?
          this.company.city = c.long_name;
          break;
        case 'administrative_area_level_1':     //  Note some countries don't have states
          this.company.county = c.long_name;
          break;
        case 'postal_code':
          this.company.postal_code = c.long_name;
          break;
        case 'administrative_area_level_2':
          this.company.province = c.long_name;
          break;
      }
    });

    console.log('street_number', this.company.street_number);
    console.log('address', this.company.address);
    console.log('city', this.company.city);
    console.log('county', this.company.county);
    console.log('postal_code', this.company.postal_code);
    console.log('province', this.company.province);
  }



  showToast(text: string, duration: string = '3000', position: string = 'bottom') {
    if (this.platform.is('android')) {
      this.toast.show(text, duration, position).subscribe(
        toast => {
          console.log('line: 109  toast this.userInfo.first_name ', this.userInfo.first_name);
        }
      );
    }

  }



  pushNotifications(data) {
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });

    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };
    const pushObject: PushObject = this.push.init(options);


    pushObject.on('registration').subscribe(
      (registration: any) => {
        console.log('Device registered', registration);
        this.sendTokenToServer(data,registration);
      }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }



  sendTokenToServer(datosUsuario,registration) {
    let sendData = datosUsuario//;{'datosUsuario':datosUsuario,'registration':registration};
    sendData.registrationId = registration.registrationId;
    this.userService.sendTokenToServer(sendData)
      .subscribe(
        (data) => {
          setTimeout(() => {
            console.log('data', data);
          }, 1000);
        },
        (error) => {
          console.log('error', error);
        }
      )
  }
}

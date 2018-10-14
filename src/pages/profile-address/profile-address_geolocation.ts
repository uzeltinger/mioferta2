import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

/**
 * Generated class for the ProfileAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-address',
  templateUrl: 'profile-address.html',
})
export class ProfileAddressPage {
  options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  profileAddres:NativeGeocoderReverseResult;
  latitude:string;
  longitude: string;
  address: string;
  street_number: string;
  countryId: number;
  county: string;
  city: string;
  showSplash: boolean;

  constructor(private platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
      this.profileAddres =  {} as NativeGeocoderReverseResult;
      /**/
  }

  ionViewDidLoad() {

this.showSplash = true;
if (this.platform.is('core')) {
  this.profileAddres.countryCode='AR';
      this.profileAddres.countryName='Argentina';
      this.profileAddres.postalCode='B8000';
      this.profileAddres.administrativeArea='Buenos Aires';
      this.profileAddres.subAdministrativeArea='Bahía Blanca';
      this.profileAddres.locality='Bahía Blanca';
      this.profileAddres.thoroughfare='Avenida General Arias';
      this.profileAddres.subThoroughfare='1836'; 
      this.showSplash = false;

      this.address = this.profileAddres.thoroughfare;
      this.street_number = this.profileAddres.subThoroughfare;
      this.countryId = 11;
      this.county = this.profileAddres.administrativeArea;
      this.city = this.profileAddres.locality;
      this.latitude = this.latitude;
      this.longitude = this.longitude;
}else{
   console.log('ionViewDidLoad ProfileAddressPage');
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('latitud', resp.coords.latitude);
      console.log('longitude', resp.coords.longitude);
      this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, this.options)
      .then((result: NativeGeocoderReverseResult[]) => {
        console.log(JSON.stringify(result[0]));
        console.log('reverseGeocode', result);
        this.profileAddres = result[0];
        this.showSplash = false;
        }
      )
      .catch((error: any) => {
        console.log(error);
        this.showSplash = false;
      }
      );
     }).catch((error) => {
       console.log('Error getting location', error);
       this.showSplash = false;
     });
  }
}
}

/*
<ion-content padding>
<br>  countryCode: {{profileAddres.countryCode}}
<br>  countryName: {{profileAddres.countryName}}
<br>  postalCode: {{profileAddres.postalCode}}
<br>  administrativeArea: {{profileAddres.administrativeArea}}
<br>  subAdministrativeArea: {{profileAddres.subAdministrativeArea}}
<br>  locality: {{profileAddres.locality}}
<br>  thoroughfare: {{profileAddres.thoroughfare}}
<br>  subThoroughfare: {{profileAddres.subThoroughfare}}

</ion-content>
*/
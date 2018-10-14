import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { ProfileAutocompleteAddressPage } from '../profile-autocomplete-address/profile-autocomplete-address';

@Component({
    selector: 'page-profile-address',
    templateUrl: 'profile-address.html',
})
export class ProfileAddressPage {

    //address;

    profileAddress// any = {"place":""};

    latitude: string;
    longitude: string;
    address: string;
    street_number: string;
    countryId: number;
    county: string;
    province: string;
    city: string;
    postal_code: string;
    showSplash: boolean;

    constructor(private platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private modalCtrl:ModalController) {
        //this.profileAddress = {};
        /**/
        this.profileAddress = {
            place: ""
          };
    }

    showAddressModal () {
        let modal = this.modalCtrl.create(ProfileAutocompleteAddressPage);
        //let me = this;
        modal.onDidDismiss(data => {
            this.profileAddress.place = data.formatted_address;
            this.placeToAddress(data);
            console.log('this.profileAddress.place',this.profileAddress.place);
        });
        modal.present();
      }
      
      placeToAddress(place){
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        place.address_components.forEach( c =>  {
            switch(c.types[0]){
                case 'street_number':
                    this.street_number = c.long_name;
                    break;
                case 'route':
                    this.address = c.long_name;
                    break;
                case 'neighborhood': case 'locality':    // North Hollywood or Los Angeles?
                    this.city = c.long_name;
                    break;
                case 'administrative_area_level_1':     //  Note some countries don't have states
                    this.county = c.long_name;
                    break;
                case 'postal_code':
                    this.postal_code = c.long_name;
                    break;
                case 'administrative_area_level_2':
                    this.province = c.long_name;
                    break;                
            }
        });
        console.log('street_number',this.street_number);
        console.log('address',this.address);
        console.log('city',this.city);
        console.log('county',this.county);
        console.log('postal_code',this.postal_code);
        console.log('province',this.province);
    }







    ionViewDidLoad() {

        this.showSplash = true;
        if (this.platform.is('core')) {
            this.showSplash = false;
            this.address = '';
            this.street_number = '';
            this.countryId = 11;
            this.county = '';
            this.city = '';
            this.latitude = this.latitude;
            this.longitude = this.longitude;
        } else {
            console.log('ionViewDidLoad ProfileAddressPage');
            this.showSplash = false;
        }
    }
}


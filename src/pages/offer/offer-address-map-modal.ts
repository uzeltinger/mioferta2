import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {FormControl} from "@angular/forms";
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
//import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
    selector: 'page-offer-address-map-modal',
    templateUrl: 'offer-address-map-modal.html',
  })
  export class OfferAddressMapModalPage {
    public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;
    public googlePlace: any;
    @ViewChild("search")
    public searchElementRef;

    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        private mapsAPILoader: MapsAPILoader,
        public viewCtrl: ViewController,
        private ngZone: NgZone) {
            console.log('latitude', navParams.get('latitude'));
            console.log('longitude', navParams.get('longitude'));
          /*this.zoom = 12;
          this.latitude = -34.6611394;
          this.longitude = -58.550512;
          //create search FormControl
          this.searchControl = new FormControl();*/
          //set current position
          this.setCurrentPosition();          
      }

      ionViewDidLoad() {
        console.log('ionViewDidLoad ProfileAutocompleteAddressPage');
        //set google maps defaults
        this.zoom = 12;
        this.latitude = this.navParams.get('latitude');
        this.longitude = this.navParams.get('longitude');
        //create search FormControl
        this.searchControl = new FormControl();
        //set current position
        this.setCurrentPosition();
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            /*let nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
            let autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
                types: ["address"]
            });*/
            /*autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                    this.googlePlace = place;
                    console.log(place);
                });
            });*/
        });
      }

    private setCurrentPosition() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 12;
        });
    }
}

dismiss(){
        this.viewCtrl.dismiss(null);
    }

  
  }
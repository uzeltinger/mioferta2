import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { OfferAddressMapModalPage } from './offer-address-map-modal';
import { OfferServiceProvider } from '../../providers/offer-service/offer-service';
/**
 * Generated class for the OfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html',
})
export class OfferPage {
  offer: any
  latitude: number;
  longitude: number;
  mapUrl: string;
  public zoom: number;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public offerService: OfferServiceProvider) {
    this.offer = navParams.data.offer;
    console.log('this.offer', this.offer);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferPage');
    this.latitude = 0;
    this.longitude = 0;
    this.setCurrentPosition();

    this.offer.showDiscount = "-" + this.offer.priceDiscount + "%";
    this.offer.dosporuno = false;
          if(this.offer.price/2==this.offer.specialPrice){
            this.offer.showDiscount = "2x1";
            this.offer.dosporuno = true;
          }

  }

  increaseWhatsappClick(offer){
    console.log('increaseWhatsappClick');
    this.offerService.increaseWhatsappClick(offer)
    .subscribe(
      data => {
        console.log('increaseWhatsappClick data: ',data);        
      },
      error => {
        console.log('increaseWhatsappClick error: ',error);             
      }
    ); 
  }

  showAddressMapModal(offer) {
    console.log('offer', offer);
    let mapUrl = 'https://maps.google.com/?saddr='+offer.latitude+',';
    mapUrl = mapUrl + offer.longitude+'&daddr='+this.latitude+','+this.longitude;
    console.log('mapUrl', mapUrl);    
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
}


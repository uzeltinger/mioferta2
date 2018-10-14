import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Offer } from '../../models/offer';

/**
 * Generated class for the OfferDetailTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer-detail-test',
  templateUrl: 'offer-detail-test.html',
})
export class OfferDetailTestPage {
offer: Offer = new Offer;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.offer.id = 290;
    this.offer.phone = "2916481551";
    this.offer.address = "Avenida Colón";
    this.offer.categories = [];
    this.offer.categories.push("105");
    this.offer.city = "Bahía Blanca";
    this.offer.county = "Buenos Aires";
    this.offer.description = "amd 643";
    this.offer.full_address = "24 Avenida Colón, Bahía Blanca, Buenos Aires, Bahía Blanca";
    this.offer.latitude = "-38.7188563";
    this.offer.longitude = "-62.2668093";
    this.offer.main_subcategory = "105";
    this.offer.picture_path = "/offers/290/1534261581.jpg";
    this.offer.priceDiscount = "20.0";
    this.offer.priceFormated = "$5.000";
    this.offer.province = "Bahía Blanca";
    this.offer.specialPriceFormated = "$4.000";
    this.offer.start_to_end_date = "19 Ago 2018 - 20 Oct 2018";
    this.offer.endDate = "2018-10-20";
    this.offer.subject = "PC escritorio y oficina";
    this.offer.user_id = "706";
    this.offer.company_name = "Uzel Store";


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferDetailTestPage');
    
  }

}
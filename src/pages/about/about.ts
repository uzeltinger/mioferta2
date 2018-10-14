import { Component } from '@angular/core';
import { Nav, IonicPage, NavController, NavParams } from 'ionic-angular';
import { OffersPage } from '../offers/offers';
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
offer: any;
  constructor(public nav: Nav, public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {   
  }
  goOffersPage(){
    this.nav.setRoot(OffersPage);
  }
}
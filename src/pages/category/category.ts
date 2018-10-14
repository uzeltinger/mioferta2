import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProveedorProvider } from '../../providers/proveedor/proveedor';
import { OfferPage } from '../offer/offer';

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  category: any;
  offers: any;
  showSplash = true; // <-- show animation
  constructor(public navCtrl: NavController, 
    public proveedor:ProveedorProvider, 
    public navParams: NavParams) {
    this.category = navParams.data.category;
    console.log('this.category',this.category);
    this.getOffersCategory(this.category.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }
  
  getOffersCategory(catid: number){
    this.proveedor.getOffersCategory(catid)
    .subscribe(
      (data)=> {         
        this.offers = data; 
        this.showSplash = false;
        console.log('data',data) ;
      },
      (error)=>{console.log('error',error);}
    )
  }
  navToOfferPage(event, offer){
    this.navCtrl.push(OfferPage, {
      offer: offer
    });
  }
}

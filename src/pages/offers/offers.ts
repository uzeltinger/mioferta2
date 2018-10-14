import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, BlockerDelegate } from 'ionic-angular';
import { OfferPage } from '../offer/offer';
import { StatusBar } from '@ionic-native/status-bar';
import { ProveedorProvider } from '../../providers/proveedor/proveedor';
import { ModalController } from 'ionic-angular';
import { ModalSearchPage } from '../modal-search/modal-search';
import { OfferServiceProvider } from '../../providers/offer-service/offer-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the OffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage {

  offers: any
  whatsappText:string
  showSplash = true; // <-- show animation
  categoriesFiltered: any = [];
  citiesFiltered: any = [];
  latitude: number = 0;
  longitude: number = 0;
  filtrosAplicados: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public proveedor:ProveedorProvider, 
    public offerService: OfferServiceProvider, 
    private alertController: AlertController,
    public statusBar: StatusBar,
    public modalCtrl: ModalController) {
    this.whatsappText = "Dentro%20de%20las%2048hs.%20paso%20a%20retirar%20la%20oferta.%0AMuchas%20gracias.%0A";
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
    //this.statusBar.hide();
    //setTimeout(() => {
      this.setCurrentPosition();
      //this.getOffers();
     //}, 1000);
  }
  setCurrentPosition() {
    console.log('setCurrentPosition');
    if ("geolocation" in navigator) {
      console.log('geolocation');
      //navigator.geolocation.getCurrentPosition(success, error, options)
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            console.log('setCurrentPosition latitude'+this.latitude);
            this.getOffers();
        }, 
        (error) => {
          console.warn('ERROR(' + error.code + '): ' + error.message);
          this.getOffers();
        },options
        );
    }else{
      console.log('NO geolocation');
      this.getOffers();
    }
}
  getOffers(){
    this.getCitiesFiltered();
    this.getCategoriesFiltered();
    
    if(this.citiesFiltered.length > 0 || this.categoriesFiltered.length > 0){
      console.log('filtrosAplicados');
      this.filtrosAplicados = true;
    }else{
      this.filtrosAplicados = false;
    }
    let sendData = {"cities":this.citiesFiltered,"categories":this.categoriesFiltered,"latitude":this.latitude,"longitude":this.longitude};
    this.proveedor.obtenerOfertas(sendData)
    .subscribe(
      (data)=> {         
        this.offers = data; 
        this.offers.forEach((element : any) => {
          if(element.distance!=null){
            element.distance = Math.round(element.distance * 100) / 100;
          }          
        });
        
        this.showSplash = false;
        console.log('data',data) ;
        console.log('this.offers',this.offers) ;
      },
      (error)=>{
        console.log('error',error);
        this.showSplash = false;
        this.navCtrl.setRoot(HomePage);    
        this.showAlert('Ocurrió un error',error);
      }
    )
  }
  navToOfferPage(event, offer){
    this.navCtrl.push(OfferPage, {
      offer: offer
    });
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

  presentModal() {
    const modal = this.modalCtrl.create(ModalSearchPage);
    modal.onDidDismiss(data => {
      console.log(data);
      this.showSplash = true;
      this.getOffers();
    });
    modal.present();
    this.showSplash = true;
  }

  getCitiesFiltered(){
    if (localStorage.getItem("citiesFiltered") === null) {
      this.citiesFiltered = [];
    }else{
      this.citiesFiltered = JSON.parse(localStorage.getItem("citiesFiltered"));
    }
  }

  getCategoriesFiltered(){
    if (localStorage.getItem("categoriesFiltered") === null) {
      this.categoriesFiltered = [];
    }else{
      this.categoriesFiltered = JSON.parse(localStorage.getItem("categoriesFiltered"));
    }
  }

  showAlert(title_: string, subTitle_: string) {
    const alert = this.alertController.create({
      title: title_,
      subTitle: subTitle_,
      buttons: ['OK']
    });
    alert.present();
  }


}

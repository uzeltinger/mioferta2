import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  items: any = [];
  offersLimitStart: number = 0;
  offersLimit: number = 10;
  offersShowAll: boolean = false;

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
    console.log('this.citiesFiltered',this.citiesFiltered);
    console.log('this.categoriesFiltered',this.categoriesFiltered);

    if(this.citiesFiltered.length > 0 || this.categoriesFiltered.length > 0){
      console.log('filtrosAplicados');
      this.filtrosAplicados = true;
    }else{
      this.filtrosAplicados = false;
    }
    let sendData = {"cities":this.citiesFiltered,"categories":this.categoriesFiltered,"latitude":this.latitude,"longitude":this.longitude,"limit":this.offersLimit,"limitstart": this.offersLimitStart};
    this.proveedor.obtenerOfertas(sendData)
    .subscribe(
      (data)=> {    
        if(data.length<this.offersLimit){
          this.offersShowAll = true;
        
        this.offers = data; 
        this.offers.forEach((element : any) => {
          element.showDiscount = "-" + element.priceDiscount + "%";
          element.dosporuno = false;
          if(element.price/2==element.specialPrice){
            element.showDiscount = "2x1";
            element.dosporuno = true;
          }
          if(element.distance!=null){
            element.distance = Math.round(element.distance * 100) / 100;
          }
          this.items.push(element);
        });
      }
        console.log('this.items',this.items) ;        
        this.showSplash = false;
      },
      (error)=>{
        console.log('error',error);
        this.showSplash = false;
        this.navCtrl.setRoot(HomePage);    
        this.showAlert('Ocurrió un error',error);
      }
    )
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');
    return new Promise((resolve) => {
      this.offersLimitStart += this.offersLimit;
      if(!this.offersShowAll){
      this.getOffers();
      }
      setTimeout(() => {    
        resolve();
      }, 1000);
    })  
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
    if(this.filtrosAplicados){
      this.showSplash = true;
      this.limpiarFiltros();    
    }else{  
      const modal = this.modalCtrl.create(ModalSearchPage);
      modal.onDidDismiss(data => {
        console.log(data);
        this.showSplash = true;
        this.getOffers();
      });
      modal.present();
      this.showSplash = true;
      }
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


  limpiarFiltros(){
    this.citiesFiltered = [];
    this.categoriesFiltered = [];
    this.setCitiesFiltered();
    this.setCategoriesFiltered();
    this.getOffers();
  }
  setCitiesFiltered(){    
    localStorage.setItem("citiesFiltered", JSON.stringify(this.citiesFiltered))
    console.log('citiesFiltered',this.citiesFiltered);    
  }

  setCategoriesFiltered(){    
    localStorage.setItem("categoriesFiltered", JSON.stringify(this.categoriesFiltered))
    console.log('categoriesFiltered',this.categoriesFiltered);    
  }

}

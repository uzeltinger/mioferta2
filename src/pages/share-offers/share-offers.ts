import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { EditOfferPage } from '../edit-offer/edit-offer';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { OfferServiceProvider } from '../../providers/offer-service/offer-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Toast } from '@ionic-native/toast';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ShareOffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-share-offers',
  templateUrl: 'share-offers.html',
})
export class ShareOffersPage {
  offers: any
  showSplash = true;
  userInfo: User = new User;
  company: Company = new Company;
  shareOffers:any ;
  linkToShare: string = 'https://mioferta.com.ar/index.php?option=com_jbusinessdirectory&view=companies&companyId=';
  offersTotal:number=0;
  offersToShare:number=0;
  pictures_path:string = '';

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public offerService: OfferServiceProvider, 
    public userService: UserServiceProvider,
    private toast: Toast,
    public navParams: NavParams,
    private alertController: AlertController,
    private socialSharing: SocialSharing) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareOffersPage');
    this.pictures_path = this.offerService.picturesPath; 
    this.userInfo = this.userService.getUser();  
    console.log('this.userInfo ',this.userInfo);  
    this.company = this.userService.getCompany();
    //this.getUserOffers();
  }  

  ionViewWillEnter() {
    console.log('ionViewWillEnter EditOffersPage');
    this.getUserOffersToShare();
    //setTimeout(() => {    }, 2000);
  }

  getUserOffersToShare(){
    let data = this.offerService.getUserOffersToShare();
    if(data.length>0){
      let offersToShare = 0;
        this.offers = data; 
        this.offersTotal = this.offers.length;
        this.offers.forEach(function (value) {
          if(value.share===undefined){
            console.log('value.share',value.share);
            value.isAssignedToShare = true;
            offersToShare++;
            value.share = 1;
          }else if(value.share == 1){
            value.isAssignedToShare = true;
          }else{
            value.isAssignedToShare = false;
            offersToShare++;
          }
          console.log('value.share',value.share);
        }); 
        this.offersToShare = offersToShare;
    }
    this.showSplash = false;
    console.log('offersActives ',this.offersToShare);  
    }
    
    toggleOfferState(offer){
      console.log('toggleOfferState offer.share : ',offer.share);
      let newState = 0;
      if(offer.share == 0){
        newState = 1;
        this.offersToShare++;
      }else{
        this.offersToShare--;
      }
      offer.share = newState;
      console.log('offer.share',offer.share);
      
    }

    shareThisOffers(){ 
      var whatsappText: string = "Hola. Te comparto las ofertas.\r\n";
      var whatsappImage: string;
      var whatsappUrl: string;
      var offersIdToShare: any = [];
      if(this.offersToShare>0){    
        this.offers.forEach(function (value) {
          if(value.share==1){
            offersIdToShare.push(value.id);
          }
        });

        console.log('offersIdToShare',offersIdToShare);
           
          whatsappUrl = "\r\n" + 'https://mioferta.com.ar/index.php?option=com_jbusinessdirectory&Itemid=1008&view=sharedoffers&offers='+offersIdToShare.toString();          
       
      console.log('whatsappText',whatsappText);
      console.log('whatsappImage',whatsappImage);
      console.log('whatsappUrl',whatsappUrl);    
      this.socialSharing.shareViaWhatsApp(whatsappText, null, whatsappUrl);  
      }else{
        this.showAlert('Debe seleccionar las ofertas a compartir!',''); 
      }
    }


  showToast(text: string, duration: string = '3000', position: string = 'bottom') {
    if (this.platform.is('android')) {
      this.toast.show(text, duration, position).subscribe(
        toast => {
          console.log('line: 109  toast this.userInfo.first_name ', this.userInfo.first_name);
        }
      );
    }else{
      console.log('showToast ', text);
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
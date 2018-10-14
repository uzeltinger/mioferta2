import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { OfferServiceProvider } from '../../providers/offer-service/offer-service';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { EditOfferPage } from '../edit-offer/edit-offer';
import { OfferPage } from '../offer/offer';
import { Toast } from '@ionic-native/toast';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ShareOffersPage } from '../share-offers/share-offers';
import { ConsultsPage } from '../consults/consults';
/**
 * Generated class for the EditOffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-offers',
  templateUrl: 'edit-offers.html',
})
export class EditOffersPage {
  offers: any
  whatsappText:string
  whatsappImage:string
  whatsappUrl:string
  showSplash = true;
  isUserLoggedIn: boolean = false;
  userInfo: User = new User;
  company: Company = new Company;
  pictures_path:string = '';
  toolbarShow: boolean = false;
  taskCreate: boolean = false;
  taskShare: boolean = false;
  taskDelete: boolean = false;
  taskConsults: boolean = false;
  shareOffers:any ;
  linkToShare: string = 'https://mioferta.com.ar/index.php?option=com_jbusinessdirectory&view=companies&companyId=';
  offersTotal:number=0;
  offersActives:number=0;
  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public offerService: OfferServiceProvider, 
    public navParams: NavParams,
    public userService: UserServiceProvider,
    private toast: Toast,
    private socialSharing: SocialSharing
  ) {
    //this.whatsappText = "Dentro%20de%20las%2048hs.%20paso%20a%20retirar%20la%20oferta.%0AMuchas%20gracias.%0A";
    console.log('constructor EditOffersPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditOffersPage');
    this.pictures_path = this.offerService.picturesPath; 
    this.isUserLoggedIn = this.userService.isUserLoggedIn;
    this.userInfo = this.userService.getUser();    
    this.company = this.userService.getCompany();   
    console.log('this.company',this.company);
    //this.getUserOffers();    
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter EditOffersPage');
    this.getUserOffers();
    this.toolbarShow = false;
    this.taskCreate = true;
    this.taskConsults = true;
    this.taskShare = true;
    //setTimeout(() => {    }, 2000);
  }
  ionViewDidEnter(){
    console.log('ionViewDidEnter EditOffersPage');
  }
  
  getCompanyOffers(){
    this.offerService.getCompanyOffers(this.company.id)
    .subscribe(
      (data)=> {         
        this.offers = data; 
        this.showSplash = false;
        console.log('data',data) ;
      },
      (error)=>{
        console.log('error',error);
      this.showSplash = false;
    }
    )
  } 

  getUserOffers(){
    this.offerService.getUserOffers(this.userInfo.id)
    .subscribe(
      (data)=> {
        this.offerService.setUserOffersToShare(data);
        this.offerService.setUserOffersCache(data);
        let offersActives = 0;
        this.offers = data; 
        this.offersTotal = this.offers.length;
        this.offers.forEach(function (value) {    
          if(value.state == 1){
            value.isAssigned = true;
            offersActives++;
          }
        }); 
        this.offersActives = offersActives;       
        this.showSplash = false;
        console.log('data',data) ;
      },
      (error)=>{
        console.log('error',error);
      this.showSplash = false;
    }
    )
  } 
  toggleOfferState(offer){
    console.log('toggleOfferState offer : ',offer);
    let newState = 1;
    if(offer.state == 1){
      newState = 2;
      this.offersActives--;
    }else{
      this.offersActives++;
    }
    offer.state = newState;
    this.showSplash = true;
    this.offerService.setOfferState(offer)
    .subscribe(
      dataOfferState => {
        console.log('dataOfferState: ',dataOfferState);
        if(dataOfferState.post.state==2){
          this.showToast('Oferta ocultada!');   
        }else{
          this.showToast('Oferta publicada!');   
        }
        
        this.offerService.setUserOffersToShare(this.offers);         
        
        this.showSplash = false;   
      },
      error => {
        this.showSplash = false;
        this.showToast('Error: ' + error);          
      }
    );  
  }

  addNewOffer(){
    let newOffer: object = {'id':'0'};    
    console.log('newOffer',newOffer);
    this.navCtrl.push(EditOfferPage, {
          offer: newOffer
        });
  }
  navToOfferPage(event, offer){
    this.navCtrl.push(OfferPage, {
      offer: offer
    });
  }
  increaseWhatsappCount(offer){
    
  }

  toolbarToggle(){
    this.toolbarShow = this.toolbarShow ? false : true;
  }

  editOffer(event, offer){
    this.toolbarToggle();
    this.navCtrl.push(EditOfferPage, {
      offer: offer
    });
  }
/*
  sendOffersList(){
    //this.toolbarToggle();    
    this.socialSharing.shareViaWhatsApp('Listado de ofertas', '', this.linkToShare+this.company.id)
  }
*/
  itemsSelectedShare(offerToShare){
    //this.toolbarToggle();
    //this.shareOffers  = Object.assign([], this.offers);    
    /*this.shareOffers.forEach(function (value) {
      let msg = '';
      if(value.isAssigned){
        console.log('share',value);
        let linkToShare:string = 'https://mioferta.com.ar/offer/'+value.id;
        msg = msg + linkToShare;
      }      
    });*/
    //for (let i = 0; i < this.shareOffers.length; i++) {
      //console.log(this.shareOffers[i]);
      //let offerToShare = this.shareOffers[i];
      
      if(offerToShare){
        console.log('share',offerToShare);
        this.whatsappText = offerToShare.subject+"\r\n"+offerToShare.description+"\r\n"+offerToShare.specialPriceFormated;
        this.whatsappImage = this.pictures_path + offerToShare.picture_path;
        this.whatsappUrl = "\r\n" + 'https://mioferta.com.ar/offer/'+offerToShare.id;
        //this.whatsappText = window.encodeURIComponent(this.whatsappText);
        //msg = msg + linkToShare;
      //}  
    }
    
    
    console.log('whatsappText',this.whatsappText);
    console.log('whatsappImage',this.whatsappImage);
    console.log('whatsappUrl',this.whatsappUrl);


    this.socialSharing.shareViaWhatsApp(this.whatsappText, this.whatsappImage, this.whatsappUrl)
/*
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      // Sharing via email is possible
      console.log('canShareViaEmail ssii');
        // Share via email
        this.socialSharing.shareViaEmail(this.whatsappText, 'Compartiendo info', ['fabiouz@gmail.com']).then(() => {
          // Success!
          console.log('canShareViaEmail Success');
        }).catch(() => {
          // Error!
        });
    }).catch(() => {
      // Sharing via email is not possible
      console.log('canShareViaEmail Sharing via email is not possible');
    });
*/
  }

  goConsultsPage(){
    console.log('goConsultsPage');
    this.navCtrl.push(ConsultsPage);
  }

  goShareOffers(){
    this.navCtrl.push(ShareOffersPage);
  }

  goNewOfferPage() {
    this.toolbarToggle();
    let newOffer: object = { 'id': '0' };
    console.log('newOffer', newOffer);
    this.navCtrl.push(EditOfferPage, {
      offer: newOffer
    });
  }
  deleteOffer(event,offer){
    this.showSplash = true;    
    this.offerService.deleteOffer(offer)
    .subscribe(
      offerDeletedData => {
        console.log('offerDeletedData: ',offerDeletedData);    
          
        this.showToast('Oferta eliminada!');   
        this.getUserOffers();
         
        //this.navCtrl.setRoot(ProfilePage);  
        //this.navCtrl.push(EditOffersPage);
      },
      error => {
        //this.errorMessage = <any>error;
        this.showSplash = false;
        this.showToast('Error: ' + error);     
        //console.log('error: ',error);          
      }
    );  
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

}

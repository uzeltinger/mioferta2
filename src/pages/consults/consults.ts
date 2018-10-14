import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { OfferServiceProvider } from '../../providers/offer-service/offer-service';

/**
 * Generated class for the ConsultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-consults',
  templateUrl: 'consults.html',
})
export class ConsultsPage {
  offers: any
  showSplash = true;
  isUserLoggedIn: boolean = false;
  userInfo: User = new User;
  company: Company = new Company;
  pictures_path:string = '';
  offersTotal:number=0;
  offersActives:number=0;
  showThisMonth:boolean = false;
  showLastMonth: boolean = false;
  contacts: any = {};
  lastMonthConsults: any = {};
  thisMonthConsults: any = {};
  dateThisMonth: any;
  dateLastMonth: any;
  getThisMonthConsults: any = [];
  getLastMonthConsults: any = [];
  lastOfferShowed: any = {"id":0};

  constructor(public navCtrl: NavController, 
    public offerService: OfferServiceProvider, 
    public userService: UserServiceProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsultsPage');
    
    this.pictures_path = this.offerService.picturesPath; 
    this.isUserLoggedIn = this.userService.isUserLoggedIn;
    this.userInfo = this.userService.getUser();    
    this.company = this.userService.getCompany();   
    console.log('this.company',this.company);
    this.getUserOffers(this.userInfo);
    this.getUserContacts();
    let date = new Date();    
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    var toDay = new Date();
    console.log('lastDay',lastDay);
    console.log('toDay',toDay);
    var options = {
      year: "numeric", month: "short", day: "numeric"     
    };
    this.dateThisMonth = lastDay.toLocaleDateString("es-ar", options);
    this.dateLastMonth = toDay.toLocaleDateString("es-ar", options);
  }

  getUserContacts(){
    this.showSplash = true;
    this.offerService.getUserContacts(this.userInfo.id)
    .subscribe(
      (data)=> {        
        this.contacts = data; 
        this.lastMonthConsults = this.contacts.lastMonthConsults;
        this.thisMonthConsults = this.contacts.thisMonthConsults;
        this.showSplash = false;
        console.log('data',data) ;
      },
      (error)=>{
        console.log('error',error);
      this.showSplash = false;
    }
    )
  }

  getUserOffers(userInfo){
    this.offers = this.offerService.getUserOffersCache();
    console.log('userInfo',userInfo);

    let offersActives = 0;
    this.offersTotal = this.offers.length;
    this.offers.forEach(function (value) {    
      if(value.state == 1){
        value.isAssigned = true;
        offersActives++;
      }
    }); 
    this.offersActives = offersActives;       
    this.showSplash = false;
  }

  showContactsList(offer,month){
    console.log('.id',offer.id);
    console.log('month',month);
    console.log('this.lastMonthConsults[]',this.lastMonthConsults[offer.id]);
    console.log('this.thisMonthConsults[]',this.thisMonthConsults[offer.id]);
    this.getThisMonthConsults = [];
    this.getLastMonthConsults = [];
    if(offer.id != this.lastOfferShowed.id){
      this.lastOfferShowed.showLastMonth = false;
      this.lastOfferShowed.showThisMonth = false;
    }
    this.lastOfferShowed = offer;
    if(month==1){
      this.getThisMonthConsults = this.thisMonthConsults[offer.id];
      if(this.getThisMonthConsults!=undefined){      
        if(this.getThisMonthConsults.length>0){
          offer.showThisMonth = offer.showThisMonth ? false : true;
          offer.showLastMonth = false;
        }
      }

    }else{
      this.getLastMonthConsults = this.lastMonthConsults[offer.id];
      if(this.getLastMonthConsults!=undefined){
        if(this.getLastMonthConsults.length>0){
          offer.showLastMonth = offer.showLastMonth ? false : true;
          offer.showThisMonth = false;
        }
      }
    }
  }
  getTotalConsults(offer,month){
    if(month==1){
      if(this.thisMonthConsults[offer.id]!=undefined){
        return this.thisMonthConsults[offer.id].length;
      }else{
        return 0;
      }
      
    }else{
      if(this.lastMonthConsults[offer.id]!=undefined){
        return this.lastMonthConsults[offer.id].length;
      }else{
        return 0;
      }
      
    }
  }
}

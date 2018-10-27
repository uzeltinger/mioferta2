import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Company } from '../../../models/company';
import { OfferServiceProvider } from '../../../providers/offer-service/offer-service';
import { UserServiceProvider } from '../../../providers/user-service/user-service';
//import { User } from '../../../models/user';
import { AdminProvider } from '../../../providers/admin/admin';

/**
 * Generated class for the AdminEmpresaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-admin-empresa',
  templateUrl: 'empresa.html',
})
export class AdminEmpresaPage {
  offers: any
  showSplash = true;
  isUserLoggedIn: boolean = false;
  userInfo: any;  
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
    public adminService: AdminProvider,
    public navParams: NavParams) {
      this.company = navParams.data.company;
      console.log('this.company',this.company);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminEmpresaPage');
    this.pictures_path = this.offerService.picturesPath; 
    this.getUserByCompany(this.company.id);
    
    
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

  getUserByCompany(id){
    this.showSplash = true;
    this.adminService.getUserByCompany(id)
    .subscribe(
      (data)=> {
        this.userInfo = data;
        this.getUserOffers(data);
        this.getUserContacts(data); 
        this.showSplash = false;
        console.log('data',data) ;
      },
      (error)=>{
        console.log('error',error);
      this.showSplash = false;
    }
    )
  }


  getUserContacts(userData){
    this.showSplash = true;
    this.offerService.getUserContacts(userData.id)
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
  orderOffers(data){
    return data;
  }
  getUserOffers(userData) {
    console.log('userData', userData);
    this.offerService.getUserOffers(userData.id)
      .subscribe(
        (data) => {
          this.offers = this.orderOffers(data);
          let offersActives = 0;
          
          this.offersTotal = this.offers.length;
          this.offers.forEach(function (value) {
            if (value.state == 1) {
              value.isAssigned = true;
              offersActives++;
            }
          });
          this.offersActives = offersActives;
          this.showSplash = false;
          console.log('data', data);
        },
        (error) => {
          console.log('error', error);
          this.showSplash = false;
        }
      )
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

import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AdminProvider } from '../../../providers/admin/admin';
import { Toast } from '@ionic-native/toast';
import { AdminEmpresaPage } from '../empresa/empresa';

/**
 * Generated class for the AdminEmpresasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-admin-empresas',
  templateUrl: 'empresas.html',
})
export class AdminEmpresasPage {
  companies: any;
  showSplash = true;
  companiesTotal:number=0;
  companiesActives:number=0;
  companiesWhatsappTotal:number=0;
  companiesWhatsappList: any;

  constructor(
    public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private toast: Toast,
    public adminService: AdminProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminEmpresasPage');
    this.showSplash = true;
    this.companies = this.getAdminCompanies();   
    this.getAdminWhatsappTotal();
    console.log('this.companies',this.companies);
  }

  getTotalConsults(company,month){    
    if(month==1){
      return company.whatsapps.lastMonthConsults;
    }else{
      return company.whatsapps.thisMonthConsults;
    }
  }
  getAdminCompanies(){
    this.adminService.getAdminCompanies()
    .subscribe(
      (data)=> {
        this.companies = data; 
        this.showSplash = false;
        console.log('data',data) ;

        let companiesActives = 0;
        this.companiesTotal = this.companies.length;
        this.companies.forEach(function (value) {          
          if(value.state == 1){
            value.isAssigned = true;
            companiesActives++;
          }          
        }); 
        this.companiesActives = companiesActives;

        console.log('this.companiesWhatsappList',this.companiesWhatsappList);
      },
      (error)=>{
        console.log('error',error);
        this.showSplash = false;
      }
    )
  }

  getAdminWhatsappTotal(){
    this.adminService.getAdminWhatsappTotal()
    .subscribe(
      (data)=> {
        let whatsappTotal: any = data;     
        this.companiesWhatsappTotal = whatsappTotal.total;
        console.log('data',data) ;
      },
      (error)=>{
        console.log('error',error);
    }
    )
  }
  

  toggleCompanyState(company){
    console.log('toggleOfferState company : ',company);
    let newState = 1;
    if(company.state == 1){
      newState = 2;
      this.companiesActives--;
    }else{
      this.companiesActives++;
    }
    company.state = newState;
    this.showSplash = true;
    this.adminService.setCompanyState(company)
    .subscribe(
      dataOfferState => {
        console.log('dataOfferState: ',dataOfferState);
        if(dataOfferState.post.state==2){
          this.showToast('Empresa ocultada!');   
        }else{
          this.showToast('Empresa publicada!');   
        }             
        
        this.showSplash = false;   
      },
      error => {
        this.showSplash = false;
        this.showToast('Error: ' + error);          
      }
    );  
  }


  showToast(text: string, duration: string = '3000', position: string = 'bottom') {
    if (this.platform.is('android')) {
      this.toast.show(text, duration, position).subscribe(
        toast => {
          console.log('line:  toast ');
        }
      );
    }else{
      console.log('showToast ', text);
    }
  }


  goCompanyDetail(event, company) {
    this.navCtrl.push(AdminEmpresaPage, {
      company: company
    });
  }


}

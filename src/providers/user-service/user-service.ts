import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  user: User = new User;
  company: Company = new Company;
  isUserLoggedIn: boolean = false;
  apiUrl: string = 'https://mioferta.com.ar/api/v1/';
  //apiUrl: string = 'http://mioferta.local/api/v1/';
  httpOptions:any = {};
  /*
  headers = {
    headers: new HttpHeaders().set('Authorization', '')
  };
*/
  constructor(public httpClient: HttpClient, public storage: Storage) {
    //console.log('Hello UserServiceProvider Provider');
  }

  setUserToken(token){
    this.storage.set('token', token);
    //console.log('token',token);
  }

  setUserFacebook(user:any): Observable<any>{
        
        //console.log('UserServiceProvider : setUserFacebook : line 38 : user ', user);

    this.httpOptions = this.getHeader();
    return this.httpClient.post<any>(this.apiUrl+"user/signup", user, this.httpOptions)
      .pipe(  
        tap(// Log the result or error
        data => {
          this.storeUserData(data);
          //console.log("data", data);
          //console.log("company", company);                               
        },
        error => {
          console.log("error", error);
          if(error.status == 401){            
            
          }
        }
      ),       
        catchError(this.handleError)
      );  
  }

  setUserGoogle(user:any): Observable<any>{
    
    this.httpOptions = this.getHeader();
    return this.httpClient.post<any>(this.apiUrl+"user/signup", user, this.httpOptions)
      .pipe(    
        tap(// Log the result or error
          data => {
            this.storeUserData(data);
            //console.log("data", data);
            //console.log("company", company);                               
          },
          error => {
            console.log("error", error);
            if(error.status == 401){            
              
            }
          }
        ),    
        catchError(this.handleError)
      );  
  }

  storeUserData(data:any){
    console.log("storeUserData", data);
    this.storage.set('userLogued', true);
    this.storage.set('facebook_id', data.userData.facebook_id);
    this.storage.set('google_id', data.userData.google_id);
    this.storage.set('email', data.userData.email);
    this.storage.set('first_name', data.userData.first_name);
    this.storage.set('last_name', data.userData.last_name);
    this.storage.set('picture', data.userData.picture);
    this.storage.set('user_id', data.userData.id);
    this.storage.set('name', data.userData.name);
    this.storage.set('company_id', data.userData.company_id);
    this.storage.set('company_name', data.userData.company_name);
    this.storage.set('company_whatsapp', data.userData.company_whatsapp); 
    this.storage.set('company_address', data.userData.company_address); 
    this.storage.set('company_street_number', data.userData.company_street_number); 
    this.storage.set('company_city', data.userData.company_city); 
    this.storage.set('company_county', data.userData.company_county); 
    this.storage.set('company_province', data.userData.company_province); 
    this.storage.set('company_latitude', data.userData.company_latitude); 
    this.storage.set('company_longitude', data.userData.company_longitude); 
  }
    
  getCompany(){
    this.storage.get('userLogued').then((userLogued) => {
     
      this.isUserLoggedIn = userLogued;
      if(userLogued){
        this.storage.get('company_id').then((company_id) => {
          //console.log('line 54 : Your token is', token);
          this.company.id = company_id;
        });
        this.storage.get('company_name').then((company_name) => {
          //console.log('line 54 : Your token is', token);
          this.company.name = company_name;
        });
        this.storage.get('company_whatsapp').then((company_whatsapp) => {
          this.company.whatsapp = company_whatsapp;
        });
        this.storage.get('company_address').then((company_address) => {
          this.company.address = company_address;
        });
        this.storage.get('company_street_number').then((company_street_number) => {
          this.company.street_number = company_street_number;
        });
        this.storage.get('company_city').then((company_city) => {
          this.company.city = company_city;
        });
        this.storage.get('company_county').then((company_county) => {
          this.company.county = company_county;
        });
        this.storage.get('company_province').then((company_province) => {
          this.company.province = company_province;
        });
        this.storage.get('company_latitude').then((company_latitude) => {
          this.company.latitude = company_latitude;
        });
        this.storage.get('company_longitude').then((company_longitude) => {
          this.company.longitude = company_longitude;          
        });
      }
    });
    console.log('line 149 : getCompany is this.company ', this.company);
    //console.log('UserServiceProvider : getcompany : line 77 : this.company ', this.company);
    //setInterval(() => { return this.company }, 1000)
    return this.company;
  } 


  suscribeUserInfo(): Observable<any> {
    this.storage.get('userLogued').then((userLogued) => {
      //console.log('line 49 : userLogued is ', userLogued);
      this.isUserLoggedIn = userLogued;
      if(userLogued){
        this.user.isUserLoggedIn = userLogued;         
        this.storage.get('user_id').then((user_id) => {
          this.user.id = user_id;
        });
        this.storage.get('name').then((name) => {
          this.user.name = name;            
        });
        this.storage.get('facebook_id').then((facebook_id) => {
          this.user.facebook_id = facebook_id;
        });
        this.storage.get('google_id').then((google_id) => {
          this.user.google_id = google_id;
        });
        this.storage.get('email').then((email) => {
          this.user.email = email;
        });
        this.storage.get('first_name').then((first_name) => {
          this.user.first_name = first_name;            
        });
        this.storage.get('last_name').then((last_name) => {
          this.user.last_name = last_name;            
        }); 
        this.storage.get('picture').then((picture) => {
          this.user.picture = picture;
        });
        this.storage.get('token').then((token) => {
          this.user.token = token;
        });
        this.storage.get('company_id').then((company_id) => {
          this.company.id = company_id;
        });
      }
    });
    
    return new Observable((observer) => {
        return observer.next(this.user);
    });
    

  }


  getUser(){
    this.storage.get('userLogued').then((userLogued) => {
      //console.log('line 49 : userLogued is ', userLogued);
      this.isUserLoggedIn = userLogued;
      if(userLogued){
        this.user.isUserLoggedIn = userLogued;         
        this.storage.get('user_id').then((user_id) => {
          this.user.id = user_id;
        });
        this.storage.get('name').then((name) => {
          this.user.name = name;            
        });
        this.storage.get('facebook_id').then((facebook_id) => {
          this.user.facebook_id = facebook_id;
        });
        this.storage.get('google_id').then((google_id) => {
          this.user.google_id = google_id;
        });
        this.storage.get('email').then((email) => {
          this.user.email = email;
        });
        this.storage.get('first_name').then((first_name) => {
          this.user.first_name = first_name;            
        });
        this.storage.get('last_name').then((last_name) => {
          this.user.last_name = last_name;            
        }); 
        this.storage.get('picture').then((picture) => {
          this.user.picture = picture;
        });
        this.storage.get('token').then((token) => {
          this.user.token = token;
        });
        this.storage.get('company_id').then((company_id) => {
          this.company.id = company_id;
        });
        /*this.storage.get('company_name').then((company_name) => {
          this.company.name = company_name;
        });
        this.storage.get('company_whatsapp').then((company_whatsapp) => {
          this.company.whatsapp = company_whatsapp;
        });  
        this.storage.get('company_address').then((company_address) => {
          this.company.address = company_address;
        });
        this.storage.get('company_street_number').then((company_street_number) => {
          this.company.street_number = company_street_number;
        });
        this.storage.get('company_city').then((company_city) => {
          this.company.city = company_city;
        });
        this.storage.get('company_county').then((company_county) => {
          this.company.county = company_county;
        });
        this.storage.get('company_province').then((company_province) => {
          this.company.province = company_province;
        });
        this.storage.get('company_latitude').then((company_latitude) => {
          this.company.latitude = company_latitude;
        });
        this.storage.get('company_longitude').then((company_longitude) => {
          this.company.longitude = company_longitude;
        });       */

      }
    });
    //console.log('UserServiceProvider : getUser : line 77 : this.user ', this.user);
    return this.user;
  }

  logoutUser(user: User){
    //console.log('UserServiceProvider : logoutUser : line 82', false);
    this.storage.set('userLogued', false);
    this.storage.set('facebook_id', null);
    this.storage.set('google_id', null);
    this.storage.set('email', null);
    this.storage.set('name', null);
    this.storage.set('first_name', null);
    this.storage.set('last_name', null);
    this.storage.set('picture', null);
    this.storage.set('user_id', null);
    this.storage.set('company_id', null);
    this.storage.set('company_name', null);
    this.storage.set('company_whatsapp', null); 
    this.storage.set('company_address', null); 
    this.storage.set('company_street_number', null); 
    this.storage.set('company_city', null); 
    this.storage.set('company_county', null); 
    this.storage.set('company_province', null); 
    this.storage.set('company_latitude', null); 
    this.storage.set('company_longitude', null); 
    this.isUserLoggedIn = false;
    this.user.isUserLoggedIn = false;
  }  

  storeCompanyData(data:any){
    if(typeof data!="undefined"){
    this.storage.set('company_id', data.companyData.id);
    this.storage.set('company_name', data.companyData.name);
    this.storage.set('company_whatsapp', data.companyData.whatsapp); 
    this.storage.set('company_address', data.companyData.address); 
    this.storage.set('company_street_number', data.companyData.street_number); 
    this.storage.set('company_city', data.companyData.city); 
    this.storage.set('company_county', data.companyData.county); 
    this.storage.set('company_province', data.companyData.province); 
    this.storage.set('company_latitude', data.companyData.latitude); 
    this.storage.set('company_longitude', data.companyData.longitude); 
    }
  }
  // Envío de datos de formulario de registro
  sendCompanyData(company:any): Observable<any> {    
    console.log("company", company);
    this.httpOptions = this.getHeader();    
    company.email = this.user.email;
    return this.httpClient.post<any>(this.apiUrl+"company/update", company, this.httpOptions)
      .pipe(
        tap(// Log the result or error
        data => {
          this.storeCompanyData(data);
          console.log("data", data);
          //console.log("company", company);                               
        },
        error => {
          console.log("error", error);
          if(error.status == 401){            
            
          }
        }
      ),
        catchError(this.handleError)
      );    
  }

  getHeader() {
    //console.log('UserServiceProvider : getHeader : line 130 this.user.token : ', this.user.token);
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': this.user.token ? 'Bearer ' + this.user.token : ''
      })
    };
  }
/*
  private handleError_(error: HttpErrorResponse) {   
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
        console.log(error);
    }
    return throwError( error );
  };
*/
  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}

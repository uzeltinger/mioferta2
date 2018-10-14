import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user';

/*
  Generated class for the AdminProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AdminProvider {
  apiUrl: string = 'https://mioferta.com.ar/api';
  httpOptions: any = {};
  user: User = new User;

  constructor(public httpClient: HttpClient) {
    console.log('Hello AdminProvider Provider');
  }

  setCompanyState(company: any): Observable<any> {
    console.log('company', company);
    this.httpOptions = this.getHeader();
    return this.httpClient.post<any>(this.apiUrl + "/v1/admin/setCompanyState", company, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCompanies() {
    let url = '';
    url = this.apiUrl + '/v1/admin/getCompanies';
    return this.httpClient.get(url);
  }



  getHeader() {
    console.log('UserServiceProvider : getHeader : line 130 this.user.token : ', this.user.token);
    if(this.user.token!=undefined){
      console.log('this.user.token',this.user.token);
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': this.user.token ? 'Bearer ' + this.user.token : ''
        })
      };
    }else{
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    }
    
  }

  private handleError(error: Response | any) {
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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user';

/*
  Generated class for the ProveedorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProveedorProvider {
  apiUrl: string = 'https://mioferta.com.ar/api';
  httpOptions: any = {};
  user: User = new User;
  conectadoAinternet: boolean = false;
  //apiUrl: string = 'http://mioferta.local/api/';
  constructor(public httpClient: HttpClient) {
    console.log('Hello ProveedorProvider Provider');
  }
  /*obtenerOfertas(){
    let url = '';
    //url = 'https://www.mioferta.com.ar/index.php?option=com_jbusinessdirectory&view=offers&format=json';
    //url = 'http://mioferta.local/index.php?option=com_jbusinessdirectory&view=offers&format=json';
    //url = 'http://la.mioferta.com.ar/offers.json';
    //url = 'http://mioferta.local/api/v1/offers/getOffers';
    url = this.apiUrl + '/v1/offers/getOffers';
    return this.http.get(url);
  }*/

  setConectadoAinternet(conectadoAinternet) {
    console.log('ProveedorProvider setConectadoAinternet', conectadoAinternet);
    this.conectadoAinternet = conectadoAinternet;
  }
  getConectadoAinternet() {
    return this.conectadoAinternet;
  }

  obtenerOfertas(data: any): Observable<any> {
    if (this.conectadoAinternet) {
      console.log('obtenerOfertas data', data);
      this.httpOptions = this.getHeader();
      return this.httpClient.post<any>(this.apiUrl + "/v1/offers/getOffers", data, this.httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    } else {
      let error: Response | any;
      error = 'No estás conectado a internet';
      return Observable.throw(error);
      /*return new Observable((observer) => {
        return observer.next(error);
    });*/
    }

  }
  getCategories() {
    let url = '';
    url = this.apiUrl + '/v1/categories/getCategories';
    return this.httpClient.get(url);
  }

  getCities() {
    let url = '';
    url = this.apiUrl + '/v1/cities/getCities';
    return this.httpClient.get(url);
  }

  getOffersCategory(id: number) {
    let url = this.apiUrl + '/v1/categories/getOffersCategory/' + id;
    return this.httpClient.get(url);
  }

  getHeader() {
    console.log('UserServiceProvider : getHeader : line 130 this.user.token : ', this.user.token);
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.user.token ? 'Bearer ' + this.user.token : ''
      })
    };
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

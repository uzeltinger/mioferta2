import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { IonicStorageModule } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { AgmCoreModule } from '@agm/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';

import { Push } from '@ionic-native/push';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AdminEmpresasPage } from '../pages/admin/empresas/empresas';
import { AdminEmpresaPage } from '../pages/admin/empresa/empresa';
import { ConsultsPage } from '../pages/consults/consults';
import { OffersPage } from '../pages/offers/offers';
import { OfferPage } from '../pages/offer/offer';
import { OfferAddressMapModalPage } from '../pages/offer/offer-address-map-modal';
import { LoginPage } from '../pages/login/login';
import { LoginGooglePage } from '../pages/login-google/login-google';
import { LoginFacebookPage } from '../pages/login-facebook/login-facebook';
import { ProfilePage } from '../pages/profile/profile';
import { CategoriesPage } from '../pages/categories/categories';
import { CategoryPage } from '../pages/category/category';
import { EditOffersPage } from '../pages/edit-offers/edit-offers';
import { EditOfferPage } from '../pages/edit-offer/edit-offer';
import { ProfileAddressPage } from '../pages/profile-address/profile-address';
import { ProfileAutocompleteAddressPage } from '../pages/profile-autocomplete-address/profile-autocomplete-address';
import { OfferDetailTestPage } from '../pages/offer-detail-test/offer-detail-test';
import { ModalSearchPage } from '../pages/modal-search/modal-search';
import { ShareOffersPage } from '../pages/share-offers/share-offers';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';

import { ProveedorProvider } from '../providers/proveedor/proveedor';
import { AboutPage } from '../pages/about/about';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { OfferServiceProvider } from '../providers/offer-service/offer-service';
import { AdminProvider } from '../providers/admin/admin';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OffersPage,
    OfferPage,
    LoginPage,LoginGooglePage,LoginFacebookPage,AboutPage,
    ProfilePage,CategoriesPage,CategoryPage,EditOffersPage,EditOfferPage,
    ProfileAddressPage, ProfileAutocompleteAddressPage, OfferDetailTestPage, 
    ModalSearchPage, ShareOffersPage, ConsultsPage,AdminEmpresasPage,AdminEmpresaPage,OfferAddressMapModalPage
    //,    OfferAddressMapModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCnahpwY4LRTYlzEHnER3B_Y8NR1HzmrVE",
      libraries: ["places"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OffersPage,
    OfferPage,
    LoginPage,LoginGooglePage,LoginFacebookPage,AboutPage,
    ProfilePage,CategoriesPage,CategoryPage,EditOffersPage,EditOfferPage,
    ProfileAddressPage, ProfileAutocompleteAddressPage, OfferDetailTestPage, ModalSearchPage,
    ShareOffersPage, ConsultsPage, AdminEmpresasPage,AdminEmpresaPage,OfferAddressMapModalPage
    //,    OfferAddressMapModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HeaderColor,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProveedorProvider,
    Facebook,
    GooglePlus,
    Toast,
    UserServiceProvider,
    OfferServiceProvider,
    Camera,
    ImagePicker,
    Base64,
    SocialSharing,
    Geolocation,
    NativeGeocoder, InAppBrowser,
    Network,
    AdminProvider,
    Push
  ]
})
export class AppModule {}
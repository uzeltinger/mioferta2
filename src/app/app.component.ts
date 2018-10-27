import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { HeaderColor } from '@ionic-native/header-color';

import { HomePage } from '../pages/home/home';
import { OffersPage } from '../pages/offers/offers';
import { ProfilePage } from '../pages/profile/profile';
import { AboutPage } from '../pages/about/about';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { ProveedorProvider } from '../providers/proveedor/proveedor';
import { AdminEmpresasPage } from '../pages/admin/empresas/empresas';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any, icon: string }>;
  adminPage: any = { title: "", component: "", icon: "" };

  isUserLoggedIn: boolean = false;
  userInfo: any = [];
  isAdmin: boolean = false;
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    private network: Network,
    public splashScreen: SplashScreen,/*, public headerColor: HeaderColor*/
    public userService: UserServiceProvider,
    private alertController: AlertController,
    public proveedor: ProveedorProvider,
    private toast: Toast,
    private push: Push,
    private events: Events) {
    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage, icon: 'home' },
      { title: 'Ofertas', component: OffersPage, icon: 'list-box' },
      { title: 'Mi Negocio', component: ProfilePage, icon: 'person' },
      { title: 'Acerca de Mi Oferta', component: AboutPage, icon: 'information-circle' }
    ];

    this.adminPage = 
      { title: 'Empresas', component: AdminEmpresasPage, icon: 'podium' }
    ;

  }

  initializeApp() {

    if (this.platform.is('android')) {

      this.pushNotifications();

    }

    if (this.platform.is('android')) {
      console.log('I am an android device!');
    }
    if (this.platform.is('windows')) {
      console.log('I am an windows device!');
    }
    if (this.platform.is('core')) {
      console.log('I am an core platform!');
    }
    this.platform.ready().then(() => {

      /*this.userService.suscribeIsAdmin().subscribe(
        (data) => {
          console.log('data', data);
          this.isAdmin = data;
        },
        (error) => {
          console.log('error', error);
        }
      );*/
      this.events.subscribe('userIsAdmin',(() => {
        console.log('event received');
        this.isAdmin = true;
      }));
      this.events.subscribe('userIsNotAdmin',(() => {
        console.log('event received');
        this.isAdmin = false;
      }));
      
      this.listenConnection();     
      if (this.platform.is('android')) {
      this.statusBar.styleBlackOpaque();
      this.statusBar.backgroundColorByHexString('#B40F00');
      this.statusBar.show();
      this.splashScreen.hide();
    }
      this.userService.suscribeUserInfo()
        .subscribe(
          (data) => {
            setTimeout(() => {
              console.log('data', data);
              this.checkUserData(data);
            }, 100);
          },
          (error) => {
            console.log('error', error);
          }
        )
    });

  }

  checkUserData(data) {
    this.userInfo = data;
    this.isUserLoggedIn = this.userInfo.isUserLoggedIn;
    console.log('data.email ', data.email);
    if (data.email == "emiliouzeltinger@gmail.com" 
    || data.email == "fabiouz@gmail.com"
    || data.email == "riverasdaniel@gmail.com") {
      console.log('this.userInfo ', this.userInfo);
      this.pages.push({ title: 'Empresas', component: AdminEmpresasPage, icon: 'podium' });
    }else{
      console.log('ninguno');
    }
  }
  private listenConnection(): void {
    console.log('this.network.type', this.network.type);
    if (this.network.type == 'none') {
      this.proveedor.setConectadoAinternet(false);
      console.log('this.network.type es == none');
    } else {
      this.proveedor.setConectadoAinternet(true);
    }
    this.network.onDisconnect()
      .subscribe(() => {
        this.proveedor.setConectadoAinternet(false);
        this.showToast('Dispositivo desconectado. Por favor verifique su conección a internet!');
        this.showAlert();
      });
    this.network.onConnect().subscribe(() => {
      this.proveedor.setConectadoAinternet(true);
      this.showToast('Dispositivo Conectado!');
    });
  }
  showAlert() {
    var title_: string = 'Error de conección del dispositivo';
    var subTitle_: string = 'Por favor verifique su conección a internet!';
    const alert = this.alertController.create({
      title: title_,
      subTitle: subTitle_,
      buttons: ['OK']
    });
    alert.present();
  }

  showToast(text: string, duration: string = '3000', position: string = 'bottom') {
    if (this.platform.is('android')) {
      this.toast.show(text, duration, position).subscribe(
        toast => {
          console.log('line: 109  toast this.userInfo.first_name ', this.userInfo.first_name);
        }
      );
    } else {
      console.log('showToast ', text);
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }










  pushNotifications(){
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {
    
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
    
      });
    
    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push.createChannel({
     id: "testchannel1",
     description: "My first test channel",
     // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
     importance: 3
    }).then(() => console.log('Channel created'));
    
    // Delete a channel (Android O and above)
    this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));
    
    // Return a list of currently configured channels
    this.push.listChannels().then((channels) => console.log('List of channels', channels))
    
    // to initialize push notifications
    
    const options: PushOptions = {
       android: {},
       ios: {
           alert: 'true',
           badge: true,
           sound: 'false'
       },
       windows: {},
       browser: {
           pushServiceURL: 'http://push.api.phonegap.com/v1/push'
       }
    };
    
    const pushObject: PushObject = this.push.init(options);
    
    
    pushObject.on('notification').subscribe(
      (notification: any) => {
        console.log('Received a notification', notification)
        }
      );
    
    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));
    
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
      }

      
}

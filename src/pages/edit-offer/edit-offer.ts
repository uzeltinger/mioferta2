import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { AlertController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { OfferServiceProvider } from '../../providers/offer-service/offer-service';
import { ProveedorProvider } from '../../providers/proveedor/proveedor';
import { User } from '../../models/user';
import { Company } from '../../models/company';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Toast } from '@ionic-native/toast';

//import { EditOffersPage } from '../edit-offers/edit-offers';
//import { ProfilePage } from '../profile/profile';
/**
 * Generated class for the EditOfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-offer',
  templateUrl: 'edit-offer.html',
})

export class EditOfferPage {
  isUserLoggedIn: boolean;
  userInfo: User = new User;
  company: Company = new Company;
  newPhoto: any;
  galleryPhoto: any;
  offerNew:any = {};
  offer:any;
  isNewOffer: boolean = false;
  base64Image: string = '';
  errorMessage: string;
  allCategories: any;
  showSplash:boolean = false;
  pictures_path:string;
  offerPageTitle:string = "Agregar Oferta";

  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private camera: Camera,
    private alertController: AlertController,
    private imagePicker:ImagePicker,
    private base64: Base64,
    private offerService: OfferServiceProvider,  
    public proveedor:ProveedorProvider,
    public userService: UserServiceProvider,
    private toast: Toast) {
    this.offer = navParams.data.offer;
    if(typeof(this.offer)=='undefined'){
      this.offer = {"offer_id":"0"};
    }else{      
      this.offerPageTitle = this.offer.subject;
    }
    console.log('this.offer',this.offer);
  }

  ionViewDidLoad() {
    this.pictures_path = this.offerService.picturesPath; 
    console.log('ionViewDidLoad EditOfferPage');
    //this.offer = this.navParams.data.offer;
    //console.log('this.offer',this.offer);

    this.userInfo = this.userService.getUser();
    this.isUserLoggedIn = this.userInfo.isUserLoggedIn;
    this.company = this.userService.getCompany();
    //console.log('this.userInfo',this.userInfo);
    //console.log('this.company',this.company);

    this.offerNew = {"offer_id":"0","subject":"","description":"","price":"","specialPrice":"","companyId":"","main_subcategory":"","categories":[],"state":"1","currencyId":"8","image":""};
    this.getCategories();    
    if(this.offer.id==0){
      this.isNewOffer = true;      
      this.offerNew.main_subcategory = 0;      
      this.offerNew.categories[0] = 0;
      this.offerNew.subject = '';
    }else{
      this.offerNew = this.offer;
      this.offerNew.offer_id = this.offer.id;
      console.log('this.offerNew.categories',this.offerNew.categories);
      console.log('this.offerNew.main_subcategory',this.offerNew.main_subcategory);
    }

  }

  getCategories(){
    this.proveedor.getCategories()
    .subscribe(
      (data)=> {         
        this.allCategories = data; 
        //console.log('categories',data) ;
      },
      (error)=>{console.log('error',error);}
    )
  }
  
  onSubmitSaveOffer(formulario){
    if(this.platform.is('core')){
       
    }
    if (this.platform.is('android')) {

    }
    let noGuardar: boolean = false;
    let formData = formulario.form.value;
    //console.log('formData',formData);
    this.offerNew.user_id = this.userInfo.id;
    //this.offerNew.offer_id = 0;
    this.offerNew.subject = formData.subject;
    this.offerNew.description = formData.description;
    this.offerNew.price = formData.price;
    this.offerNew.specialPrice = formData.specialPrice;
    this.offerNew.companyId = this.company.id;
    this.offerNew.phone = this.company.whatsapp;
    this.offerNew.main_subcategory = formData.main_subcategory;
    //return null;
    this.offerNew.categories = formData.categories;

    //console.log('this.offerNew',this.offerNew);

    //console.log('this.base64Image',this.base64Image);
    
    //console.log('this.offerNew.picture_path',this.offerNew.picture_path);
    
    if(this.base64Image!=''){
      this.offerNew.image = this.base64Image;
    }
    
    if(!this.offerNew.picture_path && !this.newPhoto && !this.galleryPhoto){
      this.showToast('Debe agregar una imágen!');
      this.showAlert('Debe agregar una imágen!','');
      noGuardar=true;
    }
    
    if(this.offerNew.subject == ''){
      this.showToast('Debe agregar un título!');
      noGuardar=true;
    }
    if(this.offerNew.description == ''){
      this.showToast('Debe agregar una descripción!');
      noGuardar=true;
    }
    if(this.offerNew.price == ''){
      this.showToast('Debe agregar un precio!');
      noGuardar=true;
    }
    if(this.offerNew.specialPrice == ''){
      this.showToast('Debe agregar un precio especial!');
      noGuardar=true;
    }
    if(this.offerNew.categories.length == 0){
      this.showToast('Debe agregar una categoría!');
      noGuardar=true;
    }
        
    if(!noGuardar){
    this.showSplash = true;     

    console.log('this.offerNew',this.offerNew);

    this.offerService.saveOffer(this.offerNew)
    .subscribe(
      offerSavedData => {
        console.log('offerSavedData: ',offerSavedData);  
        this.offerNew = offerSavedData.post;
        this.offer = offerSavedData.post;
        this.offerNew.picture_path=offerSavedData.post.picture_path;
        this.offer.picture_path=offerSavedData.post.picture_path;
        console.log('this.offerNew: ',this.offerNew);   
        this.navCtrl.pop(); 
        this.showSplash = false;       
        this.showToast('Oferta guardada!');
        //this.navCtrl.setRoot(ProfilePage);  
        //this.navCtrl.push(EditOffersPage);
        
      },
      error => {
        this.errorMessage = <any>error;
        this.showSplash = false;
        this.showToast('Error: ' + error);     
        //console.log('error: ',error);          
      }
    );
    
  }
  }
  deleteOldImage(){
    this.offerNew.picture_path='';
  }
  /*saveOfferBorrar(){
    this.getBase64CoreString();  
    this.showSplash = true;

    let oferta = {"offer_id":"0","email":"fabiouz@gmail.com","subject":"Fabio","description":"el detalle de la oferta","price":"1000","specialPrice":"800","companyId":"105","main_subcategory":"130","state":"1","currencyId":"8","image":this.base64Image}

    let offer = oferta;//{"offer_id":"1001","image": this.base64Image }
    this.offerService.saveOffer(offer)
    .subscribe(
      offerSavedData => {
        console.log('userRegisteredData: ',offerSavedData);
        if(offerSavedData.error){

        }else{
          this.offerNew.offer_id = offerSavedData.post.offer_id;
          this.offerNew.subject = offerSavedData.post.subject;
          this.offerNew.description = offerSavedData.post.description;
          this.offerNew.price = offerSavedData.post.price;
          this.offerNew.specialPrice = offerSavedData.post.specialPrice;
          this.offerNew.main_subcategory = offerSavedData.post.main_subcategory;
          this.offerNew.phone = this.company.whatsapp;
          //this.offerNew.main_subcategory = 130;
          this.offerNew.picture_path = offerSavedData.post.picture_path;
          console.log('this.offerNew: ',this.offerNew);
        }
        
        this.showSplash = false;
      },
      error => {
        this.errorMessage = <any>error;
        this.showSplash = false;
        //console.log('error: ',error);          
      }
    );       
  }*/


  
  resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
    // This will wait until the img is loaded before calling this function
    //https://jinalshahblog.wordpress.com/2017/01/10/how-to-upload-imageangular2/
    return img.onload = () => {
        // Get the images current width and height
        var width = img.width;
        var height = img.height;
        console.log('width: ',img.width);
        console.log('height: ',img.height);
        // Set the WxH to fit the Max values (but maintain proportions)
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        // create a canvas object
        var canvas = document.createElement("canvas");
        // Set the canvas to the new calculated dimensions
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        // Get this encoded as a jpeg
        // IMPORTANT: 'jpeg' NOT 'jpg'
        var dataUrl = canvas.toDataURL('image/jpeg');
        // callback with the results
        callback(dataUrl, img.src.length, dataUrl.length);
    };
}
  
  takePicture(){
    if (this.platform.is('core')) {
      let image = 'http://localhost:8100/1.jpg';
      this.getBase64String(image);
      this.galleryPhoto = image;
/*
      var img = document.createElement("img");
      img.src = 'http://localhost:8100/perfil-fondo.jpg';
      this.resize(img, 800, 800, (resized_jpeg) => {
        this.base64Image = resized_jpeg;
        this.galleryPhoto = resized_jpeg;
        console.log('this.base64Image',this.base64Image);
      });      
      */
    }else{
      let options = {
        maximumImagesCount: 1,
        outType: 0,
        title: 'titulo',
        message: 'mensaje',
        quality: 100    
      };
      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
            this.galleryPhoto = results[i];
        }
        this.getBase64String(this.galleryPhoto);
      }, (err) => { });
    }
  }
 
   takePhoto(){
     const options: CameraOptions = {
       quality: 50,
       destinationType: this.camera.DestinationType.FILE_URI,
       //destinationType: this.camera.DestinationType.DATA_URL,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE,
       saveToPhotoAlbum: false,
       correctOrientation: true,
       allowEdit : true
       }
     this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     console.log('imageData',imageData);
     this.newPhoto = imageData;
     this.getBase64String(imageData);
     //this.newPhoto = this.base64Image;
    }, (err) => {
     console.log('err',err);
    });
   
   }
 
   
 
   deletePhoto() {
     const confirm = this.alertController.create({
       title: 'Eliminar?',
       message: 'Desea eliminar esta imagen de su oferta?',
       buttons: [
         {
           text: 'Cancelar',
           handler: () => {
             console.log('Disagree clicked');
           }
         },
         {
           text: 'Aceptar',
           handler: () => {
             console.log('Agree clicked');
             this.newPhoto = '';
             this.galleryPhoto = '';
           }
         }
       ]
     });
     confirm.present();
   }
 
   getBase64String(filePath: string){
    
      var img = document.createElement("img");
        img.src = filePath;
        this.resize(img, 800, 800, (resized_jpeg) => {
          this.base64Image = resized_jpeg;
          console.log('this.base64Image',this.base64Image);
        });    
/*
    this.base64.encodeFile(filePath).then((base64File: string) => {
       console.log('getBase64String',base64File);
       this.base64Image = base64File;
     }, (err) => {
       console.log(err);
     });    
     */ 
   }
   
   increaseWhatsappCount(offer){
    
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

/*
Tomar una foto y recuperarlo como una imagen codificada en base64:

    navigator.camera.getPicture (onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
	
	
	
	
	Tomar una foto y recuperar la ubicación del archivo de la imagen:

    navigator.camera.getPicture (onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });
    
    function onSuccess(imageURI) {var imagen = document.getElementById('myImage');
        Image.src = imageURI;
    } function onFail(message) {alert (' falló porque: ' + mensaje);}
	
	
	
  correctOrientation: true
  */
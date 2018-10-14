import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProveedorProvider } from '../../providers/proveedor/proveedor';
import { CategoryPage } from '../category/category';

/**
 * Generated class for the CategoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  categories: any;
  showSplash = true; // <-- show animation

  constructor(public navCtrl: NavController, 
    public proveedor:ProveedorProvider, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage'); 
    this.getCategories();
  }

  getCategories(){
    this.proveedor.getCategories()
    .subscribe(
      (data)=> {         
        this.categories = data; 
        this.showSplash = false;
        console.log('data',data) ;
      },
      (error)=>{console.log('error',error);}
    )
  }
  navToCategoryPage(event, category){
    this.navCtrl.push(CategoryPage, {
      category: category
    });
  }
}

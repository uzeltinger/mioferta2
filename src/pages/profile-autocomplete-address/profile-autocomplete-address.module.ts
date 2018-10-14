import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileAutocompleteAddressPage } from './profile-autocomplete-address';

@NgModule({
  declarations: [
    ProfileAutocompleteAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileAutocompleteAddressPage),
  ],
})
export class ProfileAutocompleteAddressPageModule {}

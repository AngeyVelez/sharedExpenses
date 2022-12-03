import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { CardComponent } from 'src/app/components/card/card.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page, CardComponent],
  providers: [
    { provide: AUTH_SETTINGS, useValue: { appVerificationDisabledForTesting: true } }
  ]
})
export class Tab1PageModule {}

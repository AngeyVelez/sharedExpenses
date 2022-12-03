import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsComponent } from './details.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [DetailsComponent],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: DetailsComponent },
    ])
  ],
})
export class DetailsModule { }

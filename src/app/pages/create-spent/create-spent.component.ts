import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-create-spent',
  templateUrl: './create-spent.component.html',
  styleUrls: ['./create-spent.component.scss'],
})
export class CreateSpentComponent implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {}

  async presentModal() {
    // const modal = await this.modalController.create({
    //   component: ModalPage
    // });
    // return await modal.present();
  }

  // dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    // this.modalController.dismiss({
    //   'dismissed': true
    // });

}

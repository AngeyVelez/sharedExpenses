import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InfiniteScrollCustomEvent, ToastController } from '@ionic/angular';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public plans: Array<any> = [];

  constructor(
    private planService: PlanService,
    private router: Router,
    private toastController: ToastController,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(() => {
      this.getPlans()
    });
  }

  getPlans() {
    this.planService.getRegisters().then((resp: any) => {
      this.plans = resp
    }).catch(console.error)
  }

  onClick(id: string) {
    this.router.navigate(['details'], {
      queryParams: {
        id
      }
    });
  }
  
  removePlan(id: string){
    this.planService.deleteRegister(id).then(() => {
      this.presentToast("bottom", "Eliminado exitosamente");
      this.plans = this.plans.filter(plan => plan.id !== id)
    }).catch(console.error);
  }

  async presentToast(position: 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  onIonInfinite(ev: any) {
    this.getPlans();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

}

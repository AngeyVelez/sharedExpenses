import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  public plans: Array<any> = [];

  constructor(
    private planService: PlanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPlans();
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
      this.plans = this.plans.filter(plan => plan.id !== id)
    }).catch(console.error)
  }

  onIonInfinite(ev: any) {
    this.getPlans();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

}

import { Component } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PlanService } from './services/plan.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(planService: PlanService) {
    // planService.createRegister({
    //   name: 'test',
    //   age: 11
    // }).then(console.log).catch(console.error)
    // planService.getRegisters().then(console.log).catch(console.error)
    // planService.updateRegister('Dk08Pc0jMOyaFFFoWSTR', { age: 12, lastname: 'testsito' }).then(console.log).catch(console.error)
    // planService.deleteRegister('w42ke1Il0As88XYMVCS4').then(console.log).catch(console.error)
  }
}

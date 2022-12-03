import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  
  newSpentFormGroup!: FormGroup;
  plan: any;
  createdAt: any;
    
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string = "";

  constructor(
    private planService: PlanService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private modal : ModalController
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params && params['id']) {
        this.getPlan(params['id'])
      }
    });

    this.newSpentFormGroup = this._formBuilder.group({
      name: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(80)])]],
      description: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(200)])]],
      price: ['', [Validators.compose([Validators.required, Validators.pattern('[0-9 ]*'), Validators.maxLength(20)])]],
      member: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(80)])]],
    });
    // this.getErrorMessage()
  }

  getPlan(id: string) {
    this.planService.getRegisterById(id).then((resp: any) => {
      this.plan = {...resp, id: id};
      this.createdAt = new Date(resp.createdAt.seconds);
    }).catch(console.error)
  }

  cancel() {
    this.modal.dismiss(null, 'Cancelar');
  }

  // confirm() {
  //   this.modal.dismiss(this.name, 'Aceptar');
  // }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'Aceptar') {
      this.message = `Hola, ${ev.detail.data}!`;
    }
  }

  async onClick(){
    try {
      const spents = [...(this.plan?.spents? this.plan.spents : []), this.newSpentFormGroup.value];
      console.log(spents);
      const planUpdated = {...this.plan, spents};
      await this.planService.updateRegister(this.plan.id, planUpdated);
    } catch (error) {
      console.error(error);
    }
  }

}

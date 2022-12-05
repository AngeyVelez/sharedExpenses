import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PlanService } from '../../services/plan.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  members: any = [];
  newPlanFormGroup!: FormGroup;
  validations: any;

  constructor(
    private _formBuilder: FormBuilder,
    private planService: PlanService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newPlanFormGroup = this._formBuilder.group({
      name: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(80)])]],
      description: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(200)])]],
      members: this._formBuilder.array([
        new FormControl('', Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(80)]))
      ])
    });
    this.getErrorMessage()
  }

  addField() {
    const control = <FormArray>this.newPlanFormGroup.get('members');
    control.push(
      new FormControl('', Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(80)]))
    )
  }

  removeField(index: number) {
    const control = <FormArray>this.newPlanFormGroup.get('members');
    control.removeAt(index);
  }

  getMembersControls() {
    return (this.newPlanFormGroup.get('members') as FormArray).controls;
  }

  onClick() {
    const formatMembers = this.newPlanFormGroup.value.members.map((m: string) => ({ name: m, id: uuidv4()}))
    this.planService.createRegister(
      { ...this.newPlanFormGroup.value, members: formatMembers, createdAt: new Date() }
    ).catch(console.error);
    this.newPlanFormGroup.reset();
    this.router.navigate(['/tabs/tab1']);
  }

  getErrorMessage() {
    this.validations = {
      'name': [
        { type: 'required', message: 'El nombre es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un nombre válido' },
        { type: 'maxlength', message: 'Máximo 80 caracteres' },
      ],
      'description': [
        { type: 'required', message: 'La descripción es requerido' },
        { type: 'maxlength', message: 'Máximo 200 caracteres' },
      ],
      'member': [
        { type: 'required', message: 'El nombre del integrante es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un nombre válido' },
        { type: 'maxlength', message: 'Máximo 80 caracteres' },
      ]
    };
  }

}

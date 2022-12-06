import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  @ViewChild('pieCanvas', { static: false, read: ElementRef }) canvas: any;

  validations: any;
  newSpentFormGroup!: FormGroup;
  plan: any;
  createdAt: any;
  labels: any;
  summary: any = {};
  chart: any;
  closeouts: any;

  constructor(
    private planService: PlanService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private modal: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (params && params['id']) {
        await this.getPlan(params['id'])
        setTimeout(() => {
          this.chartConfig();
        }, 50);
      }
    });
    this.newSpentFormGroup = this._formBuilder.group({
      name: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(80)])]],
      description: ['', [Validators.compose([Validators.required, Validators.pattern('[A-ZÑa-zñÀ-ÿ]+[A-ZÑa-zñÀ-ÿ0-9 ]*'), Validators.maxLength(200)])]],
      price: ['', [Validators.compose([Validators.required, Validators.pattern('[0-9 ]*'), Validators.maxLength(20)])]],
      member: ['', [Validators.compose([Validators.required])]],
    });
    this.getErrorMessage()
  }

  ngAfterViewInit() {
  }

  async getPlan(id: string) {
    const resp: any = await this.planService.getRegisterById(id)
    this.plan = { ...resp, id: id };
    this.createdAt = new Date(resp.createdAt.toDate());
  }

  async onClick() {
    if (this.newSpentFormGroup.valid && this.newSpentFormGroup.touched) {
      const spents = [...(this.plan?.spents ? this.plan.spents : []), this.newSpentFormGroup.value];
      const planUpdated = { ...this.plan, spents };
      await this.planService.updateRegister(this.plan.id, planUpdated);
      this.presentToast("bottom", "Creado exitosamente");
      this.cancel();
      this.newSpentFormGroup.reset();
    } else {
      this.presentToast('top', "Revise y complete el formulario");
      this.newSpentFormGroup.markAllAsTouched();
    }
  }

  cancel() {
    this.modal.dismiss(null, 'Cancelar');
    this.newSpentFormGroup.reset();
    this.getPlan(this.plan.id);
  }

  async presentToast(position: any = 'bottom', message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }

  getMember(memberId: any) {
    const member = this.plan.members.find((member: any) => member.id == memberId)
    return member
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
      'price': [
        { type: 'required', message: 'El precio es requerido' },
        { type: 'pattern', message: 'Se debe ingresar un precio válido' },
        { type: 'maxlength', message: 'Máximo 80 caracteres' },
      ],
      'member': [
        { type: 'required', message: 'El integrante es requerido' }
      ]
    };
  }

  getSummary() {
    this.summary = this.plan.members.reduce((prev: any, curr: any) => {
      prev[curr.id] = 0;
      return prev
    }, {})

    this.plan.spents.forEach((element: any) => {
      if (this.summary[element.member]) {
        this.summary[element.member] += element.price;
      } else {
        this.summary[element.member] = element.price
      }
    });
  }

  getLabels() {
    this.labels = Object.keys(this.summary).map(id => this.getMember(id).name)
  }

  chartConfig() {
    this.getSummary();
    this.getLabels();
    this.liquidate()
    const data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Gastos',
          data: Object.values(this.summary),
        }
      ]
    };

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Resumen de gastos'
          }
        }
      },
    })
  }

  liquidate() {
    let total: number = 0;
    let divide: number = 0;
    let balance: any = [];
    this.closeouts = [];

    this.plan.spents.forEach((element: any) => {
      total += element.price;
    });

    divide = total / this.plan.members.length;

    Object.entries(this.summary).forEach((element: any[]) => {
      const memberId = element[0];
      const amount = element[1]
      balance.push({
        member: this.getMember(memberId),
        balance: amount - divide
      });
    });

    const debtors = balance.filter((bal: any) => bal.balance < 0).sort((a: any, b: any) => a.balance - b.balance)
    const acreedor = balance.filter((bal: any) => bal.balance > 0).sort((a: any, b: any) => b.balance - a.balance)

    let i = 0;
    let j = 0

    do {
      const deudor = debtors[i]
      const adeudado = acreedor[j];
      if (Math.abs(deudor.balance) < adeudado.balance) {
        adeudado.balance += deudor.balance;
        this.closeouts.push(`${deudor.member.name} debe pagarle a ${adeudado.member.name} el valor de: $${Math.abs(deudor.balance)}`);
        i++;
      } else {
        this.closeouts.push(`${deudor.member.name} debe pagarle a ${adeudado.member.name} el valor de: $${adeudado.balance}`);
        deudor.balance += adeudado.balance;
        j++;
      }

    } while (i < debtors.length && j < acreedor.length);
  }


}

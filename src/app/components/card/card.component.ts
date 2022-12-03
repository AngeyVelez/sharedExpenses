import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() data: any;
  
  constructor() { }

  ngOnInit() {
    // console.log(this.data);
  }

  // onClick(){
  //   console.log("acción del card")
  // }

}

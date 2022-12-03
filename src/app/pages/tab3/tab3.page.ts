import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  id: any;
  sub: any;

  constructor(
    private route: ActivatedRoute
    ) { }
  
  ngOnInit(): void {
    // this.sub = this.route.params.subscribe(params => {
    //   this.id = params['id'];
    // });
    // console.log(this.id)
  }

}

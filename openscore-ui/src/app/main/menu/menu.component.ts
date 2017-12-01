import { MainRoutes } from './../main.routing';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  items: Array<any>;

  constructor() { }

  ngOnInit() {
    this.items = MainRoutes.filter((route: any) => route.name !== '' && route.name !== undefined);

  }

}

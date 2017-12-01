import { Competicion } from './../../../models/competicion';
import { CompeticionesService } from './../../../services/competiciones.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-competicion-list',
  templateUrl: './competicion-list.component.html',
  styleUrls: ['./competicion-list.component.css']
})
export class CompeticionListComponent implements OnInit {

  competiciones: Array<Competicion>;

  constructor(private competicionsService: CompeticionesService) { }

  ngOnInit() {
    this.competicionsService.get(1, 1).subscribe(competiciones => this.competiciones = competiciones);
  }

}

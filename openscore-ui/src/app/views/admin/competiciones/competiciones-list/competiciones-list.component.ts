import { Router } from '@angular/router';
import { DefinicionCompeticion } from './../../../../model/definicion-competicion';
import { DefinicionCompeticionesService } from './../../../../services/definicion-competiciones.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-competiciones-list',
  templateUrl: './competiciones-list.component.html',
  styleUrls: ['./competiciones-list.component.scss']
})
export class CompeticionesListComponent implements OnInit {

  modalRef: BsModalRef;
  competiciones = [];

  id: number;
  nombre: string;

  constructor(
    private competicionesService: DefinicionCompeticionesService,
    private modalService: BsModalService,
    private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.competicionesService.getAll(1, 10).subscribe(response => {
      this.competiciones = response.data;
    });
  }

  openModal(template: TemplateRef<any>, competicion: DefinicionCompeticion) {
    console.log(competicion);
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.id = competicion.id;
    this.nombre = competicion.nombre;
  }

  closeModal() {
    this.modalRef.hide();
  }


  crearCompeticion() {
    this.router.navigate(['/admin/competiciones/form']);
  }

  editarCompeticion(id: number) {
    this.router.navigate(['/admin/competiciones/form', id]);
  }

  eliminarCompeticion() {
    this.competicionesService.delete(this.id).subscribe(response => {
      this.refresh();
      this.closeModal();
    });
  }

}

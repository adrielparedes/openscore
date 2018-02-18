import { EquiposService } from './../../../../services/equipos.service';
import { Equipo } from './../../../../model/equipo';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-equipos-list',
  templateUrl: './equipos-list.component.html',
  styleUrls: ['./equipos-list.component.scss']
})
export class EquiposListComponent implements OnInit {

  modalRef: BsModalRef;
  equipos = [];

  id: number;
  nombre: string;

  constructor(
    private equiposService: EquiposService,
    private modalService: BsModalService,
    private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.equiposService.getAll(1, 10).subscribe(response => {
      this.equipos = response.data;
    });
  }

  openModal(template: TemplateRef<any>, equipo: Equipo) {
    console.log(equipo);
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.id = equipo.id;
    this.nombre = equipo.nombre;
  }

  closeModal() {
    this.modalRef.hide();
  }


  crearEquipo() {
    this.router.navigate(['/admin/equipos/form']);
  }

  editarEquipo(id: number) {
    this.router.navigate(['/admin/equipos/form', id]);
  }

  eliminarEquipo() {
    this.equiposService.delete(this.id).subscribe(response => {
      this.refresh();
      this.closeModal();
    });
  }

}

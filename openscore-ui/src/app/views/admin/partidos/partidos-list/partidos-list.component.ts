import { Partido } from './../../../../model/partido';
import { PartidosService } from './../../../../services/partidos.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-partidos-list',
  templateUrl: './partidos-list.component.html',
  styleUrls: ['./partidos-list.component.scss']
})
export class PartidosListComponent implements OnInit {

  modalRef: BsModalRef;
  partidos = [];

  id: number;
  nombre: string;

  constructor(
    private equiposService: PartidosService,
    private modalService: BsModalService,
    private router: Router) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.equiposService.getAll(1, 10).subscribe(response => {
      this.partidos = response.data;
    });
  }

  openModal(template: TemplateRef<any>, partido: Partido) {
    console.log(partido);
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.id = partido.id;
  }

  closeModal() {
    this.modalRef.hide();
  }


  crearEquipo() {
    this.router.navigate(['/admin/partidos/form']);
  }

  editarEquipo(id: number) {
    this.router.navigate(['/admin/partidos/form', id]);
  }

  eliminarEquipo() {
    this.equiposService.delete(this.id).subscribe(response => {
      this.refresh();
      this.closeModal();
    });
  }

}

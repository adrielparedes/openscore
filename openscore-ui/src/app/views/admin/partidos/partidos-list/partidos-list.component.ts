import { Partido } from './../../../../model/partido';
import { PartidosService } from './../../../../services/partidos.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ResultadoComponent } from '../resultado/resultado.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-partidos-list',
  templateUrl: './partidos-list.component.html',
  styleUrls: ['./partidos-list.component.scss']
})
export class PartidosListComponent implements OnInit {

  modalRef: BsModalRef;
  partidos = [];
  loading = true;

  id: number;
  nombre: string;

  constructor(
    private equiposService: PartidosService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.equiposService.getAll(1, 10).subscribe(response => {
      this.partidos = response.data;
      this.loading = false;
    },
      err => {
        if (err.status === 0) {
          this.toastr.error('No se puede comunicar con el servicio de Partidos');
        } else {
          this.toastr.error('Error desconocido');
        }
        this.loading = false;
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


  crearPartido() {
    this.router.navigate(['/admin/partidos/form']);
  }

  editarPartido(id: number) {
    this.router.navigate(['/admin/partidos/form', id]);
  }

  openResultadoModal(partido: Partido) {

    const initialState = {
      partido: partido,
      callback: () => this.refresh()
    };

    this.modalService.show(ResultadoComponent, { initialState });
  }

  eliminarEquipo() {
    this.equiposService.delete(this.id).subscribe(response => {
      this.refresh();
      this.closeModal();
    });
  }

}

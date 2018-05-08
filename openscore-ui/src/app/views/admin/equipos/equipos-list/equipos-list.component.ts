import { ToastrService } from 'ngx-toastr';
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
  loading = true;

  id: number;
  nombre: string;

  constructor(
    private equiposService: EquiposService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.equiposService.getAll(1, 10).subscribe(response => {
      this.equipos = response.data;
      this.loading = false;
    },
      err => {
        if (err.status === 0) {
          this.toastr.error('No se puede comunicar con el servicio de Equipos');
        } else {
          this.toastr.error('Error desconocido');
        }
        this.loading = false;
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

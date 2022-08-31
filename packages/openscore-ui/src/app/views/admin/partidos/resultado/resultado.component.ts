import { PartidosService } from './../../../../services/partidos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Partido } from './../../../../model/partido';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resultado',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {

  partido: Partido;
  form: FormGroup;
  callback: () => void;

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private partidoService: PartidosService) { }

  ngOnInit() {
    console.log(this.partido);
    const resultado = this.partido.resultado;
    let local = 0;
    let visitante = 0;
    if (resultado !== null) {
      local = resultado.local;
      visitante = resultado.visitante;
    }
    this.form = this.fb.group({
      local: [local],
      visitante: [visitante],
    });
  }

  guardar() {
    if (this.form.valid) {
      const local = this.form.value['local'];
      const visitante = this.form.value['visitante'];
      this.partidoService.resultado(this.partido.id, local, visitante).subscribe(res => {
        this.bsModalRef.hide();
        this.callback();
      });
    }

  }

  closeModal() {
    this.bsModalRef.hide();
    this.callback();
  }

}

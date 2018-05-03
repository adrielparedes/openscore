import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Noticia } from './../../../model/noticia';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaComponent implements OnInit {

  @Input()
  noticia: Noticia;

  content: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.content = this.sanitizer.bypassSecurityTrustHtml(this.noticia.contenido);
  }

}

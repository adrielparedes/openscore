import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noticias-editor',
  templateUrl: './noticias-editor.component.html',
  styleUrls: ['./noticias-editor.component.scss']
})
export class NoticiasEditorComponent implements OnInit {

  htmlContent: string;

  constructor() { }

  ngOnInit() {
  }

  save() {
    console.log(this.htmlContent);
  }
}

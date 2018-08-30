import { environment } from './../../../environments/environment';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app-footer.component.html'
})
export class AppFooterComponent {
  env = environment.name;
  version = environment.version;

 }

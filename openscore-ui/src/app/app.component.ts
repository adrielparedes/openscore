import { navigation } from './_nav';
import { InfoService } from './services/info.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
    private authService: AuthService,
    private infoService: InfoService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {

      if (evt instanceof NavigationStart) {
        if (evt.id === 1) {
          this.infoService.securePing().subscribe(res => {
            console.log(res.data);
            if (res.data !== 'ok') {
              this.logout();
            }
          }, err => this.logout());
        }
      }

      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['pages', 'login']);
  }
}

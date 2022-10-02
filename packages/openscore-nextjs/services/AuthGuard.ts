import { AuthService } from "./AuthService";

export class AuthGuard implements CanActivateChild, CanActivate {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    public router: Router
  ) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.activation();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.activation();
  }

  activation() {
    if (!this.authService.isLoggedIn()) {
      this.toastr.info("You are not logged in, please login first to play!");
      this.router.navigate(["/pages/login"]);
      return false;
    } else {
      return true;
    }
  }
}

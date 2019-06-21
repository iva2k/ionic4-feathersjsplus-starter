import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class NonauthGuardService implements CanActivate {

  constructor(
    private router: Router,
    public feathersService: FeathersService,
  ) {
  }

  // Guard method for views that must be logged out (e.g. login/register)
  // Simple wrapper over FeathersService.nonauthGuard()
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.feathersService.nonauthGuard(route, state);
  }
}

import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    public feathersService: FeathersService,
  ) {
  }

  // Guard method for views that must be logged in (e.g. user and data)
  // Simple wrapper over FeathersService.authGuard()
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    return this.feathersService.authGuard(route, state);
  }
}

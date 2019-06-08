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
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const retUrl = state.url;
    console.log('NonauthGuardService(%s): checking saved auth token...', retUrl);
    const redirectUrl = '/menu/app/tabs/home'; // TODO: (soon) this should not be defined in the service. Refactor it out of here.

    return this.feathersService.authenticate()
      .then(() => {
        // Force login guard
        console.log('NonauthGuardService(%s): has valid saved auth token, redirecting to %s.', retUrl, redirectUrl);
        return this.router.parseUrl(redirectUrl); // Angular >= 7.1 router
      })
      .catch((err) => {
        // Ok
        console.log('NonauthGuardService(%s): no valid saved auth token, ok.', retUrl);
        return true;
      })
    ;
  }
}

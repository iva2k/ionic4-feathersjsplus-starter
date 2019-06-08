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
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const retUrl = state.url;
    console.log('AuthGuardService(%s): checking saved auth token...', retUrl);
    const redirectUrl = '/login'; // TODO: (soon) this should not be defined in the service. Refactor it out of here.

    return this.feathersService.authenticate()
      .then(() => {
        // Ok
        console.log('AuthGuardService(%s): has valid saved auth token, ok.', retUrl);
        return true;
      })
      .catch((err) => {
        // Force auth guard
        const urlTree = this.router.createUrlTree([redirectUrl], { queryParams: { retUrl: retUrl } });
        console.log('AuthGuardService(%s): no valid saved auth token, redirecting to %s.', retUrl, urlTree.toString());
        return urlTree; // Angular >= 7.1 router
      })
    ;
  }
}

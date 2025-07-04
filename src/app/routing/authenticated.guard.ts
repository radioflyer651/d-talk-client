import { CanActivateChildFn, RedirectCommand, Router, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';

export const authenticatedGuard: CanActivateChildFn = (childRoute, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.user) {
    return router.parseUrl('login');
  }
  return true;
};

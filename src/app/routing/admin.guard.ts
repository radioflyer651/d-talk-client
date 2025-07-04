import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateChildFn = async (childRoute, state) => {
  const userService = inject(UserService);
  return (!!userService.user?.isAdmin);
};

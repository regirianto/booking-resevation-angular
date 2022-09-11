import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteGuard } from '../shared/guard/route.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [RouteGuard],
    canActivateChild: [RouteGuard],
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'book',
    canActivate: [RouteGuard],
    canActivateChild: [RouteGuard],
    loadChildren: () => import('./book/book.module').then((m) => m.BookModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

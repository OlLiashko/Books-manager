import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main-page/main-page.component').then(mod => mod.MainPageComponent)
  }
];

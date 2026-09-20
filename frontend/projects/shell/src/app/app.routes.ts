import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'auth',
    loadComponent: () =>
      // Dynamically loads an exposed module from a federated remote application
      loadRemoteModule(
        'auth', // Remote name from frontend\projects\shell\public\federation.manifest.json
        './Component', // Exposed module from the auth federation config frontend\projects\auth\federation.config.mjs
      ).then((m) => m.App), // App class exported from frontend\projects\auth\src\app\app.ts
  },
  {
    path: 'profile',
    loadComponent: () =>
      loadRemoteModule(
        'profile',
        './Component',
      ).then((m) => m.App),
  },
  {
    path: 'dynamic-sites',
    loadComponent: () =>
      // Dynamically loads an exposed module from a federated remote application
      loadRemoteModule(
        'dynamic-sites', // Remote name from frontend\projects\shell\public\federation.manifest.json
        './Component', // Exposed module from frontend\projects\dynamic-sites\federation.config.mjs
      ).then((m) => m.App), // App class exported from frontend\projects\dynamic-sites\src\app\app.ts
  },
  {
    path: 'dynamic-forms',
    loadComponent: () =>
      // Dynamically loads an exposed module from a federated remote application
      loadRemoteModule(
        'dynamic-forms', // Remote name from frontend\projects\shell\public\federation.manifest.json
        './Component', // Exposed module from frontend\projects\dynamic-forms\federation.config.mjs
      ).then((m) => m.App), // App class exported from frontend\projects\dynamic-forms\src\app\app.ts
  },
];

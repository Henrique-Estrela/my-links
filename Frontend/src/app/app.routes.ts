import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  // Rota inicial que redireciona para a página de login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // Rota para o Login
  {
    path: 'login',
    component: LoginComponent
  },
  // Rota principal após o login
  {
    path: '',
    component: LayoutComponent, // LayoutComponent será o "wrapper" para as rotas internas
    children: [
      {
        path: 'dashboard', // Essa será a rota para o dashboard após o login
        component: DashboardComponent
      },
      // Aqui você pode adicionar outras rotas filhas, se necessário
    ]
  }
];

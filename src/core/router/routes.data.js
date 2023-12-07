import { Auth } from '@/components/screens/auth/auth.component';
import { Home } from '@/components/screens/home/home.component';
import { NotFound } from '@/components/screens/not-found/not-found.component';

export const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/auth',
    component: Auth
  },
  {
    path: '/not-found',
    component: NotFound
  }
];

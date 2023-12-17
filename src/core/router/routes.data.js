import { Auth } from '@/components/screens/auth/auth.component';
import { Home } from '@/components/screens/home/home.component';
import { NotFound } from '@/components/screens/not-found/not-found.component';
import { UserProfile } from '@/components/screens/user-profile/user-profile.component';

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
  },
  {
    path: '/profile',
    component: UserProfile
  }
];

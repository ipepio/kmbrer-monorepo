import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import Settings from '@/pages/Settings';
import Orders from '@/pages/Orders';
import { Login } from '@/pages/Login';
import AuthWrapper from '@/components/shared/AuthWrapper';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <AuthWrapper />,
    children: [
      {
        element: <PageLayout />,
        children: [
          { path: '/settings', element: <Settings /> },
          { path: '/orders', element: <Orders /> },
          { path: '/*', element: <Navigate to="/orders" replace /> },
        ],
      },
    ],
  },
]);

export default router;

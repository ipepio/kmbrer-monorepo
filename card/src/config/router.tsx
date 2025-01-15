import { createBrowserRouter } from 'react-router-dom';
import ScanPage from '@/pages/ScanPage';
import MenuPage from '@/pages/MenuPage';
import ConfirmPage from '@/pages/ConfirmPage';
import { PaymentConfirmation } from '@/pages/PaymentConfirm';
import { PageNotFound } from '@/pages/NotFound';
import { RedsysError } from '@/pages/RedsysError';
import { PageLayout } from '@/components/Layout/PageLayout';
import AuthWrapper from '@/components/shared/AuthWrapper';

const router = createBrowserRouter([
  {
    element: <AuthWrapper />,
    children: [
      {
        element: <PageLayout />,
        children: [
          { path: '/scan', element: <ScanPage /> },
          { path: '/table/:tableId', element: <ScanPage /> },
          { path: 'confirm', element: <ConfirmPage /> },
          { path: 'confirmation', element: <PaymentConfirmation /> },
          { path: 'errorRedsys', element: <RedsysError /> },
          { path: 'confirmation', element: <PaymentConfirmation /> },
          { path: '/', element: <MenuPage /> },
          { path: '*', element: <PageNotFound /> },
        ],
      },
    ],
  },
]);

export default router;

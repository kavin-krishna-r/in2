import { lazy } from 'react';

// project import
import MainLayout from 'layout/MainLayout';
import CommonLayout from 'layout/CommonLayout';
import Loadable from 'components/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
import { element } from 'prop-types';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon')));
const InstitutionPage = Loadable(lazy(() => import('pages/institutions/index.js')));
const Fees = Loadable(lazy(() => import('pages/fees/index.js')));
const FeeDetails = Loadable(lazy(() => import('pages/fees/details.js')));
const FeeEdit = Loadable(lazy(() => import('pages/fees/edit')));
const FeeCreate = Loadable(lazy(() => import('pages/fees/create')));
const Loan = Loadable(lazy(() => import('pages/loans/index.js')));
const LoanDetails = Loadable(lazy(() => import('pages/loans/details.js')));
const LoanEdit = Loadable(lazy(() => import('pages/loans/edit')));
const LoanCreate = Loadable(lazy(() => import('pages/loans/create')));
const Anouncements = Loadable(lazy(() => import('pages/anouncements')));
const Notifications = Loadable(lazy(() => import('pages/notifications')));

// render - sample page
const Dashboard = Loadable(lazy(() => import('pages/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'Dashboard',
          element: <Dashboard />
        },
        {
          path: 'Institutions',
          element: <InstitutionPage></InstitutionPage>
        },
        {
          path: 'Fees',
          element: <Fees></Fees>
        },
        {
          path: 'fees/details/:id',
          element: <FeeDetails />
        },
        {
          path: 'fees/edit/:id',
          element: <FeeEdit />
        },
        {
          path: 'fees/create',
          element: <FeeCreate />
        },
        {
          path: 'Loans',
          element: <Loan></Loan>
        },
        {
          path: 'loans/details/:id',
          element: <LoanDetails />
        },
        {
          path: 'loans/edit/:id',
          element: <LoanEdit />
        },
        {
          path: 'loans/create',
          element: <LoanCreate />
        },
        {
          path: 'Anouncements',
          element: <Anouncements />
        },
        {
          path: 'Notifications',
          element: <Notifications />
        },
      ]
    },
    {
      path: '/maintenance',
      element: <CommonLayout />,
      children: [
        {
          path: '404',
          element: <MaintenanceError />
        },
        {
          path: '500',
          element: <MaintenanceError500 />
        },
        {
          path: 'under-construction',
          element: <MaintenanceUnderConstruction />
        },
        {
          path: 'coming-soon',
          element: <MaintenanceComingSoon />
        }
      ]
    }
  ]
};

export default MainRoutes;

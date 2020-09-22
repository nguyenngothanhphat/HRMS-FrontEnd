const routes = [
  {
    path: '/login',
    component: '../layouts/AuthLayout',
    routes: [
      {
        path: '/login',
        component: './Login',
      },
    ],
  },
  {
    path: '/forgot-password',
    component: '../layouts/AuthLayout',
    routes: [
      {
        path: '/forgot-password',
        component: './ForgotPassword',
      },
    ],
  },
  {
    path: '/reset-password/:reId',
    component: '../layouts/AuthLayout',
    routes: [
      {
        path: '/reset-password/:reId',
        component: './ResetPassword',
      },
    ],
  },

  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'employee'],
        routes: [
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: '/assets/images/home.svg',
            component: './Dashboard',
            authority: ['admin', 'customer'],
          },
          {
            path: '/',
            redirect: '/dashboard',
          },
          {
            path: '/user-management',
            name: 'userManagement',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/UserManagement',
            authority: ['admin'],
          },
          {
            path: '/employees-management',
            name: 'employeesManagement',
            icon: '/assets/images/home.svg',
            authority: ['admin'],
          },
          {
            path: '/candidates',
            name: 'candidatesManagement',
            icon: '/assets/images/home.svg',
            authority: ['admin'],
          },
          {
            path: '/company',
            name: 'company',
            icon: '/assets/images/home.svg',
            authority: ['admin'],
          },
          {
            path: '/documents',
            name: 'documents',
            icon: '/assets/images/home.svg',
            authority: ['admin'],
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/home.svg',
            authority: ['admin'],
          },

          {
            path: '/directory',
            name: 'directory',
            icon: '/assets/images/directory.svg',
            component: './Directory',
            authority: ['customer'],
          },
          {
            path: '/directory/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: ['customer'],
          },
          {
            path: '/employee-onboarding',
            name: 'employeeOnboarding',
            icon: '/assets/images/onboarding.svg',
            component: './EmployeeOnboarding',
            authority: ['customer'],
          },
          {
            path: '/employee-onboarding/:action(add)',
            name: 'addTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: ['customer'],
          },
          {
            path: '/employee-onboarding/:action(review)/:reId',
            name: 'reviewTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: ['customer'],
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
export default routes;

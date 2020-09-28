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
            path: '/',
            redirect: '/dashboard',
          },
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: '/assets/images/home.svg',
            component: './Dashboard',
            authority: ['admin', 'customer'],
          },
          {
            path: '/users',
            name: 'users',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/UsersManagement',
            authority: ['admin'],
          },
          {
            path: '/employees',
            name: 'employees',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/TestPage',
            authority: ['admin'],
          },
          {
            path: '/companies',
            name: 'companies',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/TestPage',
            authority: ['admin'],
          },
          {
            path: '/candidates',
            name: 'candidates',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/TestPage',
            authority: ['admin'],
          },
          {
            path: '/documents',
            name: 'documents',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/TestPage',
            authority: ['admin'],
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/home.svg',
            component: '../pages_admin/TestPage',
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
            path: '/template-details/:templateId',
            name: 'templateDetails',
            hideInMenu: true,
            component: './TemplateDetails',
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

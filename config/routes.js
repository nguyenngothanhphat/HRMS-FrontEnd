const routes = [
  {
    path: '/login',
    component: '../layouts/AuthLayout',
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './Login',
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
            name: 'Dashboard',
            icon: 'dashboard',
            component: './Dashboard',
            // authority: ['admin'],
          },
          {
            path: '/directory',
            name: 'Directory',
            icon: 'unordered-list',
            component: './Directory',
          },
          {
            path: '/directory/employee-profile/:reId',
            name: 'Employee Profile',
            component: './EmployeeProfile',
            hideInMenu: true,
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

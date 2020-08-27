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
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            authority: ['admin', 'employee'],
            routes: [
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
                authority: ['admin'],
              },
            ],
          },
          {
            name: 'list.table-list',
            icon: 'table',
            path: '/list',
            component: './ListTableList',
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

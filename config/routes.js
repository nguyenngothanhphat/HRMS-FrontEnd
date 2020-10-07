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
    path: '/signup',
    component: '../layouts/SignUpLayout1',
    routes: [
      {
        path: '/signup',
        component: './SignUp1',
      },
    ],
  },
  {
    path: '/signup-verify',
    component: '../layouts/SignUpLayout1',
    routes: [
      {
        path: '/signup-verify',
        component: './SignUp2',
      },
    ],
  },
  {
    path: '/signup-configlocation',
    component: '../layouts/SignUpLayout2',
    routes: [
      {
        path: '/signup-configlocation',
        component: './SignUpConfigLocation',
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
            icon: '/assets/images/CP-icons_users.svg',
            component: '../pages_admin/UsersManagement',
            authority: ['admin'],
          },
          {
            path: '/employees',
            name: 'employees',
            icon: '/assets/images/CP-icons_employees.svg',
            component: '../pages_admin/TestPage',
            authority: ['admin'],
          },
          {
            path: '/companies',
            name: 'companies',
            icon: '/assets/images/CP-icons_company.svg',
            component: '../pages_admin/CompaniesManagement',
            authority: ['admin'],
          },
          {
            path: '/companies/company-detail/:reId',
            name: 'companyDetail',
            component: '../pages_admin/CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: ['admin'],
          },
          {
            path: '/candidates',
            name: 'candidates',
            icon: '/assets/images/CP-icons_Candidates.svg',
            component: '../pages_admin/TestPage',
            authority: ['admin'],
          },
          {
            path: '/documents',
            name: 'documents',
            icon: '/assets/images/CP-icons_documents.svg',
            component: '../pages_admin/DocumentsManagement',
            authority: ['admin'],
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/CP-icons_settings.svg',
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
            path: '/employee-offboarding',
            name: 'employeeOffBoarding',
            icon: 'file-image',
            component: './OffBoarding',
          },
          {
            path: '/setting',
            name: 'setting',
            icon: 'setting',
            component: './Setting',
          },
          {
            path: '/employee-offboarding',
            name: 'employeeOffBoarding',
            icon: 'file-image',
            component: './OffBoarding',
          },
          {
            path: '/setting',
            name: 'setting',
            icon: 'setting',
            component: './Setting',
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

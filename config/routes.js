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
        path: '/candidate',
        component: '../layouts/CandidateLayout',
        authority: ['candidate'],
        routes: [
          {
            path: '/candidate',
            component: './Candidate',
            authority: ['candidate'],
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: [
          'admin-sa',
          'employee',
          'hr',
          'hr-manager',
          'hr-global',
          'admin-csa',
          'admin-cla',
          'admin-cda',
          'leader',
        ],
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
          },
          {
            path: '/users',
            name: 'users',
            icon: '/assets/images/CP-icons_users.svg',
            component: '../pages_admin/UsersManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/employees',
            name: 'employees',
            icon: '/assets/images/CP-icons_employees.svg',
            component: '../pages_admin/EmployeesManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/employees/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            // authority: ['admin-sa'],
          },
          {
            path: '/companies',
            name: 'companies',
            icon: '/assets/images/CP-icons_company.svg',
            component: '../pages_admin/CompaniesManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/companies/add-company',
            name: 'addCompany',
            hideInMenu: true,
            component: '../pages_admin/CompaniesManagement/components/AddCompany',
            authority: ['admin-sa'],
          },
          {
            path: '/project-management',
            name: 'projectManagement',
            icon: '/assets/images/iconOffboarding.svg',
            component: '../pages_admin/ProjectManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/companies/add-company',
            name: 'addCompany',
            hideInMenu: true,
            component: '../pages_admin/CompaniesManagement/components/AddCompany',
            authority: ['admin-sa'],
          },
          {
            path: '/companies/company-detail/:reId',
            name: 'companyDetail',
            component: '../pages_admin/CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: ['admin-sa'],
          },
          {
            path: '/candidates',
            name: 'candidates',
            icon: '/assets/images/CP-icons_Candidates.svg',
            component: '../pages_admin/CandidatesManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/documents',
            name: 'documents',
            icon: '/assets/images/CP-icons_documents.svg',
            component: '../pages_admin/DocumentsManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/time-off-management',
            name: 'timeOffManagement',
            icon: '/assets/images/timeOff.svg',
            component: '../pages_admin/TimeOffManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/offboarding-management',
            name: 'offBoardingManagement',
            icon: '/assets/images/iconOffboarding.svg',
            component: '../pages_admin/OffBoardingManagement',
            authority: ['admin-sa'],
          },
          {
            path: '/documents/upload-document',
            name: 'uploadDocument',
            hideInMenu: true,
            component: '../pages_admin/DocumentsManagement/components/UploadDocument',
            authority: ['admin-sa'],
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/CP-icons_settings.svg',
            component: '../pages_admin/Setting',
            authority: ['admin-sa'],
          },
          {
            path: '/settings/Permission',
            name: 'permission',
            component: '../pages_admin/Setting/Components/RolesPermission/Components/Permission',
            hideInMenu: true,
            authority: ['admin-sa'],
          },
          {
            path: '/directory',
            name: 'directory',
            icon: '/assets/images/directory.svg',
            component: './Directory',
            authority: ['P_DIRECTORY_VIEW'],
          },
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/:action(new-compoff-request)',
            name: 'Request for Compoff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeRole/components/CompoffRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/:action(edit-compoff-request)/:reId',
            name: 'Edit compoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeRole/components/CompoffRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/view-request/:reId',
            name: 'View timeoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeRole/components/ViewRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/manager-view-request/:reId',
            name: 'View timeoff request',
            hideInMenu: true,
            component: './TimeOff/components/ManagerRole/components/ManagerViewRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/view-compoff-request/:reId',
            name: 'View compoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeRole/components/ViewCompoffRequestForm',
            // authority: ['employee'],
          },
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/:action(new-leave-request)',
            name: 'Request for Timeoff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeRole/components/LeaveRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/:action(edit-leave-request)/:reId',
            name: 'Edit timeoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeRole/components/LeaveRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/directory/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/employee-onboarding',
            name: 'employeeOnboarding',
            icon: '/assets/images/onboarding.svg',
            component: './EmployeeOnboarding',
            authority: ['P_ONBOARDING_VIEW'],
          },
          {
            path: '/time-off',
            name: 'timeOff',
            icon: '/assets/images/timeOff.svg',
            component: './TimeOff',
            // authority: ['P_TIMEOFF_VIEW'],
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/employee-onboarding/CreateFieldSection',
            name: 'Createcustomfieldsection',
            component: './EmployeeOnboarding/components/CustomFields/components/CreateFieldSection',
            hideInMenu: true,
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/employee-onboarding/CreateNewField',
            name: 'Createcustomfieldsection',
            component: './EmployeeOnboarding/components/CustomFields/components/CreateNewField',
            hideInMenu: true,
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/offboarding',
            name: 'OffBoarding',
            icon: '/assets/images/iconOffboarding.svg',
            component: './OffBoarding',
            authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/resignation-request',
            name: 'Resignation Request',
            hideInMenu: true,
            component: './ResignationRequest',
          },
          {
            path: '/offboarding/review/:id',
            name: 'Review Ticket',
            component: './OffBoarding/ReviewTicket',
            hideInMenu: true,
            authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/my-request/:id',
            name: 'Review Ticket',
            component: './OffBoarding//EmployeeOffBoarding/Request',
            hideInMenu: true,
            authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/relieving-detail/:ticketId',
            name: 'relievingDetail',
            component:
              './OffBoarding/HrOffboarding/component/RelievingFormalities/components/RelievingDetails',
            hideInMenu: true,
            authority: ['hr-manager'],
          },
          {
            path: '/directory/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
          },
          {
            path: '/directory/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
          },
          {
            path: '/setting',
            name: 'setting',
            icon: '/assets/images/CP-icons_settings.svg',
            component: './Setting',
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/view-document/:documentId',
            name: 'viewDocument',
            hideInMenu: true,
            component: './ViewDocument',
            authority: [
              'employee',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
              'admin-sa',
            ],
          },
          {
            path: '/employee-onboarding/:action(add)/:reId',
            name: 'addTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/employee-onboarding/:action(review)/:reId',
            name: 'reviewTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'admin-cla',
              'admin-cda',
              'leader',
            ],
          },
          {
            path: '/employee-onboarding/create-email-reminder',
            name: 'Create Email Reminder',
            hideInMenu: true,
            component: './EmailReminder',
          },
          {
            path: '/employee-onboarding/edit-email/:reId',
            name: 'Edit Email',
            component: './EditEmail',
            hideInMenu: true,
          },
          {
            path: '/template-details/:templateId',
            name: 'templateDetails',
            hideInMenu: true,
            component: './TemplateDetails',
          },
          {
            path: '/change-password',
            name: 'change-password',
            hideInMenu: true,
            component: './ChangePassword',
          },
          {
            path: '/faqpage',
            name: 'FAQS',
            hideInMenu: true,
            component: './FAQs',
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

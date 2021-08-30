const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
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
    path: '/active-user/:id',
    component: '../layouts/ActiveUserLayout',
    routes: [
      {
        path: '/active-user/:id',
        component: './ActiveUser',
      },
    ],
  },
  {
    path: '/candidate-by-link/:tokenId',
    routes: [
      {
        path: '/candidate-by-link/:tokenId',
        component: './CandidateLink',
      },
    ],
  },
  {
    path: '/first-change-password',
    component: '../layouts/AccountSetupLayout',
    routes: [
      {
        path: '/first-change-password',
        component: './FirstChangePassword',
      },
    ],
  },
  {
    path: '/candidate-portal',
    component: '../layouts/CandidatePortalLayout',
    authority: ['candidate'],
    routes: [
      {
        path: '/candidate-portal',
        name: 'Candidate Portal',
        icon: '/assets/images/menuIcons/dashboard.svg',
        hideInMenu: true,
        component: './CandidatePortal',
      },
      // for 2 main tab
      {
        path: '/candidate-portal/:tabName',
        hideInMenu: true,
        component: './CandidatePortal',
      },
      // for candidate in ticket
      {
        path: '/candidate-portal/ticket/:action/',
        hideInMenu: true,
        component: './CandidatePortal/components/Candidate',
      },
      {
        path: '/candidate-portal/ticket/:action/:tabName',
        hideInMenu: true,
        component: './CandidatePortal/components/Candidate',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      // {
      //   path: '/candidate',
      //   component: '../layouts/CandidateLayout',
      //   authority: ['candidate'],
      //   routes: [
      //     {
      //       path: '/candidate',
      //       component: './Candidate',
      //       authority: ['candidate'],
      //     },
      //   ],
      // },
      // {
      //   path: '/select-location',
      //   component: '../layouts/AccountSetupLayout',
      //   // authority: ['admin-csa'],
      //   routes: [
      //     {
      //       path: '/select-location',
      //       component: './LocationSelection',
      //       name: 'Location Selection',
      //       // authority: ['admin-csa'],
      //     },
      //   ],
      // },
      {
        path: '/control-panel',
        component: '../layouts/AccountSetupLayout',
        authority: ['admin', 'owner', 'employee', 'candidate'],
        routes: [
          {
            path: '/control-panel',
            component: './ControlPanel',
            name: 'Control Panel',
            authority: ['admin', 'owner', 'employee', 'candidate'],
          },
          {
            path: '/control-panel/company-profile/:id',
            component: './CompanyProfile',
            name: 'Company Profile',
            authority: ['owner'],
          },
          {
            path: '/control-panel/add-company',
            component: './CompanyProfile',
            name: 'Company Profile',
            authority: ['owner'],
          },
          {
            path: '/control-panel/add-company/:tabName',
            component: './CompanyProfile',
            authority: ['owner'],
          },
          {
            component: './404',
          },
        ],
      },
      {
        // path: '/',
        component: '../layouts/BasicLayout',
        authority: [
          'admin-sa',
          'employee',
          'hr',
          'hr-manager',
          'hr-global',
          'admin-csa',
          'region-head',
          'admin-cda',
          'leader',
          'admin',
          'owner',
        ],
        routes: [
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: '/assets/images/menuIcons/dashboard.svg',
            component: './Dashboard',
          },
          {
            path: '/admin-app',
            name: 'adminApp',
            icon: '/assets/images/menuIcons/adminApp.svg',
            component: './AdminApp',
            authority: ['owner'],
          },
          {
            path: '/admin-app/:tabName',
            hideInMenu: true,
            component: './AdminApp',
            authority: ['owner'],
          },
          {
            path: '/directory',
            name: 'directory',
            icon: '/assets/images/menuIcons/directory.svg',
            component: './Directory',
            authority: ['P_DIRECTORY_VIEW', 'M_DIRECTORY_VIEW', 'M_EMPLOYEE_MANAGEMENT_VIEW'],
          },
          {
            path: '/directory/:tabName',
            component: './Directory',
            hideInMenu: true,
            authority: ['P_DIRECTORY_VIEW', 'M_DIRECTORY_VIEW', 'M_EMPLOYEE_MANAGEMENT_VIEW'],
          },
          {
            path: '/employees',
            name: 'employees',
            icon: '/assets/images/menuIcons/members.svg',
            component: './Directory',
            authority: ['owner'],
          },
          {
            path: '/employees/:tabName',
            // name: 'employees',
            component: './Directory',
            hideInMenu: true,
            authority: ['owner'],
          },
          {
            path: '/onboarding',
            name: 'Onboarding',
            icon: '/assets/images/menuIcons/onboarding.svg',
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          },
          {
            path: '/onboarding/:tabName',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          },
          {
            path: '/onboarding/:tabName/:type',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          },
          // {
          //   path: '/employee-onboarding',
          //   name: 'employeeOnboarding',
          //   icon: '/assets/images/menuIcons/onboarding.svg',
          //   component: './EmployeeOnboarding',
          //   authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          // },
          // {
          //   path: '/employee-onboarding/:tabName',
          //   // name: 'Settings',
          //   component: './EmployeeOnboarding',
          //   hideInMenu: true,
          //   authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          // },
          // {
          //   path: '/employee-onboarding/:tabName/:type',
          //   // name: 'Settings',
          //   component: './EmployeeOnboarding',
          //   hideInMenu: true,
          //   authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          // },
          {
            path: '/offboarding',
            name: 'Offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './OffBoarding',
            authority: ['employee'],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName',
            component: './OffBoarding',
            authority: ['employee'],
            hideInMenu: true,
          },
          {
            path: '/offboarding',
            name: 'Offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW', 'hr', 'hr-manager', 'manager'],
          },
          {
            path: '/offboarding/:tabName',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW', 'hr', 'hr-manager', 'manager'],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName/:type',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW', 'hr', 'hr-manager', 'manager'],
            hideInMenu: true,
          },
          {
            path: '/time-off',
            name: 'timeOff',
            icon: '/assets/images/menuIcons/timeoff.svg',
            component: './TimeOff',
            authority: [
              'P_TIMEOFF_VIEW',
              'M_TIMEOFF_VIEW',
              'hr-manager',
              'hr',
              'hr-global',
              'employee',
              'leader',
              // 'owner',
            ],
          },
          {
            path: '/time-off/:tabName',
            component: './TimeOff',
            authority: [
              'P_TIMEOFF_VIEW',
              'M_TIMEOFF_VIEW',
              'hr-manager',
              'hr',
              'hr-global',
              'employee',
              'leader',
              // 'owner',
            ],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName/:type',
            component: './TimeOff',
            authority: [
              'P_TIMEOFF_VIEW',
              'M_TIMEOFF_VIEW',
              'hr-manager',
              'hr',
              'hr-global',
              'employee',
              'leader',
              // 'owner',
            ],
            hideInMenu: true,
          },
          {
            path: '/users-management',
            name: 'users',
            icon: '/assets/images/menuIcons/user.svg',
            component: '../pages_admin/UsersManagement',
            authority: ['M_USER_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/employees-management',
            name: 'employees',
            icon: '/assets/images/menuIcons/members.svg',
            component: '../pages_admin/EmployeesManagement',
            authority: ['M_EMPLOYEE_MANAGEMENT_VIEW'],
          },
          {
            path: '/employees/employee-profile/:reId',
            name: 'Employee Profile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'region-head',
              'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/employees/employee-profile/:reId/:tabName',
            // name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'region-head',
              'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/user-profile/:reId',
            name: 'User Profile',
            component: './UserProfile',
            hideInMenu: true,
            authority: ['owner', 'admin'],
          },
          {
            path: '/companies-management',
            name: 'companies',
            icon: '/assets/images/menuIcons/company.svg',
            component: '../pages_admin/CompaniesManagement',
            authority: ['M_COMPANY_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/companies-management/add-company',
            name: 'addCompany',
            hideInMenu: true,
            component: '../pages_admin/CompaniesManagement/components/AddCompany',
            authority: ['admin-sa', 'owner'],
          },
          {
            path: '/project-management',
            name: 'projectManagement',
            icon: '/assets/images/iconOffboarding.svg',
            component: '../pages_admin/ProjectManagement',
            authority: ['M_PROJECT_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/companies-management/company-detail/:reId',
            name: 'companyDetail',
            component: '../pages_admin/CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: ['admin-sa', 'owner'],
          },
          {
            path: '/candidates-management',
            name: 'candidates',
            icon: '/assets/images/menuIcons/candidate.svg',
            component: '../pages_admin/CandidatesManagement',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/candidates-management/:action(candidate-detail)/:reId',
            name: 'Candidate Detail',
            icon: '/assets/images/menuIcons/candidate.svg',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/documents-management',
            name: 'documents',
            // icon: '/assets/images/menuIcons/documents.svg',
            icon: '/assets/images/menuIcons/icon3.svg',
            component: '../pages_admin/DocumentsManagement',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/time-off-management',
            name: 'timeOffManagement',
            icon: '/assets/images/timeOff.svg',
            component: '../pages_admin/TimeOffManagement',
            authority: ['M_TIMEOFF_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/offboarding-management',
            name: 'offBoardingManagement',
            icon: '/assets/images/iconOffboarding.svg',
            component: '../pages_admin/OffBoardingManagement',
            authority: ['M_OFFBOARDING_MANAGEMENT_VIEW', 'owner'],
          },

          {
            path: '/documents/upload-document',
            name: 'uploadDocument',
            hideInMenu: true,
            component: '../pages_admin/DocumentsManagement/components/UploadDocument',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/documents/create-template',
            name: 'Create New Template',
            hideInMenu: true,
            component: '../pages_admin/DocumentsManagement/components/CreateNewTemplate',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/menuIcons/settings.svg',
            component: '../pages_admin/Setting',
            authority: ['M_SETTING_VIEW', 'owner'],
          },
          {
            path: '/settings/:tabName',
            component: '../pages_admin/Setting',
            hideInMenu: true,
            authority: ['M_SETTING_VIEW', 'owner'],
          },
          {
            path: '/settings/:tabName/:roleId',
            name: 'permission',
            component: '../pages_admin/Setting/Components/RolesPermission/Components/Permission',
            hideInMenu: true,
            authority: ['M_SETTING_VIEW', 'owner'],
          },

          // TIMEOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-timeoff/:action(new)',
            name: 'Request for Timeoff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/LeaveRequestForm',
            authority: ['employee'],
          },
          {
            path: '/time-off/overview/personal-timeoff/:action(edit)/:reId',
            name: 'Edit timeoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/LeaveRequestForm',
            authority: ['employee', 'owner', 'hr-manager'],
          },
          {
            path: '/time-off/overview/personal-timeoff/view/:reId',
            name: 'View timeoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/ViewRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/overview/manager-timeoff/view/:reId',
            name: 'View timeoff request',
            hideInMenu: true,
            component: './TimeOff/components/ManagerLandingPage/components/ManagerViewRequestForm',
            authority: ['hr-manager', 'manager', 'owner'],
          },

          // COMPOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-compoff/:action(new)',
            name: 'Request for Compoff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/CompoffRequestForm',
            authority: ['employee'],
          },
          {
            path: '/time-off/overview/personal-compoff/:action(edit)/:reId',
            name: 'Edit compoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/CompoffRequestForm',
            authority: ['employee', 'owner', 'hr-manager'],
          },
          {
            path: '/time-off/overview/personal-compoff/view/:reId',
            name: 'View compoff request',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/ViewCompoffRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/overview/manager-compoff/view/:reId',
            name: 'View compoff request',
            hideInMenu: true,
            component: './TimeOff/components/ManagerLandingPage/components/ManagerViewCompoffForm',
            authority: ['hr-manager', 'manager', 'owner'],
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
              'region-head',
              'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/directory/employee-profile/:reId/:tabName',
            // name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'region-head',
              'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/employee-onboarding/CreateFieldSection',
            name: 'Createcustomfieldsection',
            component: './EmployeeOnboarding/components/CustomFields/components/CreateFieldSection',
            hideInMenu: true,
            authority: [
              'owner',
              'employee',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'region-head',
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
              'owner',
              'hr-manager',
              'hr',
              'hr-global',
              'admin-csa',
              'region-head',
              'admin-cda',
              'leader',
            ],
          },

          {
            path: '/employee-onboarding/list/:action(add)/:reId',
            name: 'addTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: ['hr-manager', 'hr', 'hr-global'],
          },
          {
            path: '/employee-onboarding/list/:action(review)/:reId',
            name: 'reviewTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: ['hr-manager', 'hr', 'hr-global'],
          },
          {
            path: '/employee-onboarding/list/:action(review)/:reId/:type',
            // name: 'reviewTeamMember',
            hideInMenu: true,
            component: './FormTeamMember',
            authority: ['hr-manager', 'hr', 'hr-global'],
          },
          {
            path: '/employee-onboarding/:tabName/:type/create-email-reminder',
            name: 'Create Email Reminder',
            hideInMenu: true,
            component: './EmailReminder',
          },
          {
            path: '/employee-onboarding/:tabName/edit-email/:reId',
            name: 'Edit Email',
            component: './EditEmail',
            hideInMenu: true,
          },
          {
            path: '/employee-onboarding/:tabName/view-email/:reId',
            name: 'View Email',
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
            path: '/employee-onboarding/:tabName/:type/create-new-template',
            name: 'createNewTemplate',
            hideInMenu: true,
            component: './CreateNewTemplate',
          },

          // OFFBOARDING
          {
            path: '/offboarding/list/my-request/new',
            name: 'Resignation Request',
            hideInMenu: true,
            component: './ResignationRequest',
          },
          {
            path: '/offboarding/list/review/:id',
            name: 'Review Ticket',
            component: './OffBoarding/ReviewTicket',
            hideInMenu: true,
            // authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/list/my-request/:id',
            name: 'Review Ticket',
            component: './OffBoarding//EmployeeOffBoarding/Request',
            hideInMenu: true,
            // authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/hr-relieving-formalities/relieving-detail/:ticketId',
            name: 'relievingDetail',
            component:
              './OffBoarding/HrOffboarding/component/RelievingFormalities/components/RelievingDetails',
            hideInMenu: true,
            // authority: ['hr-manager'],
          },
          {
            path: '/offboarding/settings/:type/create-custom-email',
            name: 'Create custom email',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/CustomEmails/components/CreateCustomEmail',
          },
          {
            path: '/offboarding/settings/:type/edit-email/:reId',
            name: 'Edit email',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/CustomEmails/components/EditEmail',
          },
          {
            path: '/offboarding/settings/:type/template-detail/:templateId',
            name: 'Offboarding Template Details',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/DocsTemplates/components/TemplateDetails',
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/view',
            name: 'View form',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/Forms/components/ViewForm',
          },
          {
            path: '/offboarding/settings/:type/form-detail/add',
            name: 'Add custom form',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/Forms/components/HandleForm',
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/edit',
            name: 'Edit form',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/Forms/components/HandleForm',
          },
          // {
          //   path: '/setting',
          //   name: 'setting',
          //   icon: '/assets/images/CP-icons_settings.svg',
          //   component: './Setting',
          //   hideInMenu: true,
          //   authority: ['M_SETTING_VIEW', 'P_SETTING_VIEW', 'owner'], // TEMP
          // },
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
              'region-head',
              'admin-cda',
              'leader',
              'admin-sa',
              'owner',
              'admin',
            ],
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
            path: '/search-result',
            name: 'Search Result',
            hideInMenu: true,
            component: './SearchResult',
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

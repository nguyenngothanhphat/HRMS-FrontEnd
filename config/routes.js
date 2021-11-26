const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/signin-google',
    component: './SignupGoogle',
    routes: [
      {
        path: '/signin-google',
        component: './SignupGoogle',
      },
    ],
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
        authority: ['candidate'],
        component: './CandidatePortal',
      },
      // for 2 main tab
      {
        path: '/candidate-portal/:tabName',
        hideInMenu: true,
        component: './CandidatePortal',
        authority: ['candidate'],
      },
      // for candidate in ticket
      {
        path: '/candidate-portal/ticket/:action',
        hideInMenu: true,
        component: './CandidatePortal/components/Candidate',
        authority: ['candidate'],
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
            path: '/dashboard/approvals',
            name: 'dashboardApprovals',
            hideInMenu: true,
            // icon: '/assets/images/menuIcons/dashboard.svg',
            component: './Dashboard/components/Approval',
            authority: ['employee', 'hr', 'hr-manager', 'manager'],
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
            name: 'onboarding',
            icon: '/assets/images/menuIcons/onboarding.svg',
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager', 'manager'],
          },
          {
            path: '/onboarding/:tabName',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager', 'manager'],
          },
          {
            path: '/onboarding/:tabName/:type',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          },
          {
            path: '/onboarding/newJoinees/view-detail/:userId',
            name: 'candidateProfile',
            hideInMenu: true,
            component: './Onboarding/components/NewJoinees/CandidateProfile',
            authority: ['manager'],
          },
          // {
          //   path: '/onboarding',
          //   name: 'Onboarding',
          //   icon: '/assets/images/menuIcons/onboarding.svg',
          //   component: './Onboarding',
          //   authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          // },
          // {
          //   path: '/onboarding/:tabName',
          //   // name: 'Settings',
          //   component: './Onboarding',
          //   hideInMenu: true,
          //   authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          // },
          // {
          //   path: '/onboarding/:tabName/:type',
          //   // name: 'Settings',
          //   component: './Onboarding',
          //   hideInMenu: true,
          //   authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'hr', 'hr-manager'],
          // },
          {
            path: '/offboarding',
            name: 'offboarding',
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
            name: 'offboarding',
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
            name: 'userProfile',
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
          // {
          //   path: '/project-management',
          //   name: 'projectManagement',
          //   icon: '/assets/images/iconOffboarding.svg',
          //   component: '../pages_admin/ProjectManagement',
          //   authority: ['M_PROJECT_MANAGEMENT_VIEW', 'owner'],
          // },
          {
            path: '/companies-management/company-detail/:reId',
            name: 'companyDetail',
            component: '../pages_admin/CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: ['admin-sa', 'owner'],
          },
          // customer-management
          {
            path: '/customer-management',
            name: 'customerManagement',
            icon: '/assets/images/menuIcons/customer.svg',
            // hideInMenu: true,
            component: './Customer',
            authority: [
              'hr-manager',
              'hr',
              'hr-global',
              // 'admin-csa',
              'region-head',
              // 'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/customer-management/:tabName',
            hideInMenu: true,
            component: './Customer',
            authority: [
              'hr-manager',
              'hr',
              'hr-global',
              // 'admin-csa',
              'region-head',
              // 'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/customer-management/customers/customer-profile/:reId',
            hideInMenu: true,
            name: 'viewCustomer',
            component: './CustomerProfile',
            authority: [
              'hr-manager',
              'hr',
              'hr-global',
              // 'admin-csa',
              'region-head',
              // 'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
          },
          {
            path: '/customer-management/customers/customer-profile/:reId/:tabName',
            hideInMenu: true,
            component: './CustomerProfile',
            authority: [
              'hr-manager',
              'hr',
              'hr-global',
              // 'admin-csa',
              'region-head',
              // 'admin-cda',
              'leader',
              'admin',
              'owner',
            ],
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
            name: 'candidateDetail',
            icon: '/assets/images/menuIcons/candidate.svg',
            hideInMenu: true,
            component: './NewCandidateForm',
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
            name: 'createTemplate',
            hideInMenu: true,
            component: '../pages_admin/DocumentsManagement/components/CreateNewTemplate',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', 'owner'],
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/menuIcons/settings.svg',
            component: '../pages_admin/Settings',
            authority: ['M_SETTING_VIEW', 'owner'],
          },
          {
            path: '/settings/:tabName',
            component: '../pages_admin/Settings',
            hideInMenu: true,
            authority: ['M_SETTING_VIEW', 'owner'],
          },
          // {
          //   path: '/settings/:tabName/:roleId',
          //   name: 'permission',
          //   component: '../pages_admin/Settings/Components/RolesPermission/Components/Permission',
          //   hideInMenu: true,
          //   authority: ['M_SETTING_VIEW', 'owner'],
          // },

          // TIMEOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-timeoff/:action(new)',
            name: 'requestForTimeOff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/LeaveRequestForm',
            authority: ['employee'],
          },
          {
            path: '/time-off/overview/personal-timeoff/:action(edit)/:reId',
            name: 'editTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/LeaveRequestForm',
            authority: ['employee', 'owner', 'hr-manager'],
          },
          {
            path: '/time-off/overview/personal-timeoff/view/:reId',
            name: 'viewTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/ViewRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/overview/manager-timeoff/view/:reId',
            name: 'viewTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/ManagerLandingPage/components/ManagerViewRequestForm',
            authority: ['hr-manager', 'manager', 'owner'],
          },

          // COMPOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-compoff/:action(new)',
            name: 'requestForCompoff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/CompoffRequestForm',
            authority: ['employee'],
          },
          {
            path: '/time-off/overview/personal-compoff/:action(edit)/:reId',
            name: 'editCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/CompoffRequestForm',
            authority: ['employee', 'owner', 'hr-manager'],
          },
          {
            path: '/time-off/overview/personal-compoff/view/:reId',
            name: 'viewCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/ViewCompoffRequestForm',
            // authority: ['employee'],
          },
          {
            path: '/time-off/overview/manager-compoff/view/:reId',
            name: 'viewCompoffRequest',
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
            path: '/onboarding/CreateFieldSection',
            name: 'onboarding.createFieldSection',
            component: './Onboarding/components/CustomFields/components/CreateFieldSection',
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
            path: '/onboarding/CreateNewField',
            name: 'onboarding.createFieldSection',
            component: './Onboarding/components/CustomFields/components/CreateNewField',
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
            path: '/onboarding/list/:action(view)/:reId',
            name: 'addTeamMember',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['hr-manager', 'hr', 'hr-global'],
          },
          {
            path: '/onboarding/list/:action(view)/:reId/:tabName',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['hr-manager', 'hr', 'hr-global'],
          },
          {
            path: '/onboarding/:tabName/:type/create-email-reminder',
            name: 'createEmailReminder',
            hideInMenu: true,
            component: './EmailReminder',
          },
          {
            path: '/onboarding/:tabName/edit-email/:reId',
            name: 'editEmail',
            component: './EditEmail',
            hideInMenu: true,
          },
          {
            path: '/onboarding/:tabName/view-email/:reId',
            name: 'viewEmail',
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
            path: '/onboarding/:tabName/:type/create-new-template',
            name: 'createNewTemplate',
            hideInMenu: true,
            component: './CreateNewTemplate',
          },

          // OFFBOARDING
          {
            path: '/offboarding/list/my-request/new',
            name: 'resignationRequest',
            hideInMenu: true,
            component: './ResignationRequest',
          },
          {
            path: '/offboarding/list/review/:id',
            name: 'reviewResignationTicket',
            component: './OffBoarding/ReviewTicket',
            hideInMenu: true,
            // authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/list/my-request/:id',
            name: 'reviewResignationTicket',
            component: './OffBoarding//EmployeeOffBoarding/Request',
            hideInMenu: true,
            // authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
          },
          {
            path: '/offboarding/hr-relieving-formalities/relieving-detail/:ticketId',
            name: 'offboarding.relievingDetail',
            component:
              './OffBoarding/HrOffboarding/component/RelievingFormalities/components/RelievingDetails',
            hideInMenu: true,
            // authority: ['hr-manager'],
          },
          {
            path: '/offboarding/settings/:type/create-custom-email',
            name: 'createCustomEmail',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/CustomEmails/components/CreateCustomEmail',
          },
          {
            path: '/offboarding/settings/:type/edit-email/:reId',
            name: 'editEmail',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/CustomEmails/components/EditEmail',
          },
          {
            path: '/offboarding/settings/:type/template-detail/:templateId',
            name: 'offboarding.template.email',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/DocsTemplates/components/TemplateDetails',
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/view',
            name: 'offboarding.setting.form.viewForm',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/Forms/components/ViewForm',
          },
          {
            path: '/offboarding/settings/:type/form-detail/add',
            name: 'offboarding.setting.form.addForm',
            hideInMenu: true,
            component:
              './OffBoarding/HrOffboarding/component/Settings/components/Forms/components/HandleForm',
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/edit',
            name: 'offboarding.setting.form.editForm',
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
            path: '/time-sheet',
            name: 'timeSheet',
            icon: '/assets/images/menuIcons/timeSheet.svg',
            component: './TimeSheet',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
          },
          {
            path: '/time-sheet/:tabName',
            component: './TimeSheet',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
            hideInMenu: true,
          },
          // TICKET MANAGEMENT
          {
            path: '/ticket-management',
            name: 'ticketManagement',
            icon: '/assets/images/menuIcons/ticketManagement.svg',
            component: './TicketManagement',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
          },
          {
            path: '/ticket-management/:tabName',
            component: './TicketManagement',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
            hideInMenu: true,
          },

          // PROJECTS MANAGEMENT
          {
            path: '/project-management',
            name: 'projectManagement',
            icon: '/assets/images/menuIcons/ticketManagement.svg',
            component: './ProjectManagement',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
          },
          {
            path: '/project-management/:tabName',
            component: './ProjectManagement',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
            hideInMenu: true,
          },
          {
            path: '/project-management/list/:reId',
            hideInMenu: true,
            name: 'projectManagement.viewProject',
            component: './ProjectManagement/components/ProjectInformation',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
          },
          {
            path: '/project-management/list/:reId/:tabName',
            hideInMenu: true,
            component: './ProjectManagement/components/ProjectInformation',
            authority: ['hr-manager', 'hr', 'employee', 'manager'],
          },
          {
            path: '/ticket-management/detail/:id',
            name: 'ticketManagement.viewTicket',
            component: './TicketManagement/components/TicketDetails',
            hideInMenu: true,
            // authority: ['employee', 'leader', 'manager', 'hr', 'hr-manager'],
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
            name: 'faqs',
            hideInMenu: true,
            component: './FAQs',
          },
          {
            path: '/policies-regulations',
            name: 'Policies & Regulations',
            hideInMenu: true,
            component: './PoliciesRegulations',
          },
          {
            path: '/policies-regulations/settings',
            name: 'settings',
            hideInMenu: true,
            component: './PoliciesRegulations/components/Settings',
          },
          {
            path: '/search-result',
            name: 'searchResult',
            hideInMenu: true,
            component: './SearchResult',
          },
          {
            path: '/search-result/:tabName',
            hideInMenu: true,
            component: './SearchResult',
          },
          {
            path: '/search-result/:tabName/:advanced(advanced-search)',
            name: 'searchResult.advancedSearch',
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

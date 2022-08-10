import ROLES from '../src/constants/roles';
const {
  EMPLOYEE,
  ADMIN,
  OWNER,
  CANDIDATE,
} = ROLES;

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/signin-google',
    component: './SignInGoogle',
    routes: [
      {
        path: '/signin-google',
        component: './SignInGoogle',
      },
    ],
  },
  {
    path: '/login',
    component: '../layouts/components/AuthLayout',
    routes: [
      {
        path: '/login',
        component: './Login',
      },
    ],
  },
  {
    path: '/sign-up',
    component: '../layouts/components/SignUpLayout1',
    routes: [
      {
        path: '/sign-up',
        component: './SignUp1',
      },
    ],
  },
  {
    path: '/sign-up/verify',
    component: '../layouts/components/SignUpLayout1',
    routes: [
      {
        path: '/sign-up/verify',
        component: './SignUp2',
      },
    ],
  },
  {
    path: '/sign-up/location-config',
    component: '../layouts/components/SignUpLayout2',
    routes: [
      {
        path: '/sign-up/location-config',
        component: './SignUpConfigLocation',
      },
    ],
  },
  {
    path: '/candidate',
    component: '../layouts/components/TerralogicCandidateLoginLayout',
    routes: [
      {
        path: '/candidate',
        component: './Login',
      },
    ],
  },
  {
    path: '/forgot-password',
    component: '../layouts/components/AuthLayout',
    routes: [
      {
        path: '/forgot-password',
        component: './ForgotPassword',
      },
    ],
  },
  {
    path: '/reset-password/:reId',
    component: '../layouts/components/AuthLayout',
    routes: [
      {
        path: '/reset-password/:reId',
        component: './ResetPassword',
      },
    ],
  },
  {
    path: '/active-user/:id',
    component: '../layouts/components/ActiveUserLayout',
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
    component: '../layouts/components/AccountSetupLayout',
    routes: [
      {
        path: '/first-change-password',
        component: './FirstChangePassword',
      },
    ],
  },
  {
    path: '/candidate-portal',
    redirect: '/candidate-portal/dashboard',
  },
  {
    path: '/candidate-portal',
    component: '../layouts/components/CandidatePortalLayout',
    authority: [CANDIDATE],
    routes: [
      {
        path: '/candidate-portal',
        name: 'candidate-portal',
        icon: '/assets/images/menuIcons/dashboard.svg',
        hideInMenu: true,
        authority: [CANDIDATE],
        component: './CandidatePortal',
      },
      // for 2 main tab
      {
        path: '/candidate-portal/:tabName',
        hideInMenu: true,
        component: './CandidatePortal',
        authority: [CANDIDATE],
      },
      // for candidate in ticket
      {
        path: '/candidate-portal/ticket/:action',
        hideInMenu: true,
        component: './CandidatePortal/components/Candidate',
        authority: [CANDIDATE],
      },
    ],
  },
  {
    path: '/candidate-change-password',
    component: '../layouts/components/CandidatePortalLayout',
    authority: [CANDIDATE],
    routes: [
      // for change password
      {
        path: '/candidate-change-password',
        name: 'candidate-change-password',
        hideInMenu: true,
        authority: [CANDIDATE],
        component: './CandidateChangePassword',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/components/SecurityLayout',
    routes: [
      {
        path: '/control-panel',
        component: '../layouts/components/AccountSetupLayout',
        // authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
        routes: [
          {
            path: '/control-panel',
            component: './ControlPanel',
            name: 'control-panel.name',
            // authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
          },
          {
            path: '/control-panel/company-profile/:id',
            component: './CompanyProfile',
            name: 'control-panel.companyProfile',
            authority: [OWNER],
          },
          {
            path: '/control-panel/add-company',
            component: './CompanyProfile',
            name: 'control-panel.companyProfile',
            authority: [OWNER],
          },
          {
            path: '/control-panel/add-company/:tabName',
            component: './CompanyProfile',
            authority: [OWNER],
          },
          {
            component: './404',
          },
        ],
      },
      {
        // path: '/',
        component: '../layouts/components/BasicLayout',
        routes: [
          {
            path: '/home',
            name: 'home',
            icon: '/assets/images/menuIcons/home.svg',
            component: './HomePage',
            authority: [EMPLOYEE],
          },
          {
            path: '/home/settings',
            // hideInMenu: true,
            // component: './HomePage/components/Settings',
            redirect: '/home/settings/post-management',
          },
          {
            name: 'home-settings',
            path: '/home/settings/:reId',
            hideInMenu: true,
            component: './HomePage/components/Settings',
            authority: ['P_HOMEPAGE_SETTINGS_GEAR_VIEW'], // TEMPORARY VALUES, NEED TO BE CHANGED
          },
          {
            path: '/dashboard',
            name: 'dashboard',
            icon: '/assets/images/menuIcons/dashboard.svg',
            component: './Dashboard',
            authority: ['P_DASHBOARD_W_DASHBOARD_VIEW'],
          },
          {
            path: '/dashboard/approvals',
            name: 'dashboard-approvals',
            hideInMenu: true,
            component: './Dashboard/components/Approval',
            authority: ['P_APPROVALS_PAGE_VIEW'],
          },
          {
            path: '/admin-app',
            name: 'admin-app',
            icon: '/assets/images/menuIcons/adminApp.svg',
            component: './AdminApp',
            authority: [OWNER],
          },
          {
            path: '/admin-app/:tabName',
            hideInMenu: true,
            component: './AdminApp',
            authority: [OWNER],
          },
          {
            path: '/directory',
            name: 'directory',
            icon: '/assets/images/menuIcons/directory.svg',
            component: './Directory',
            authority: [
              'P_DIRECTORY_ALL',
              'P_DIRECTORY_VIEW',
              'M_DIRECTORY_VIEW',
              'M_EMPLOYEE_MANAGEMENT_VIEW',
            ],
          },
          {
            path: '/directory/:tabName',
            component: './Directory',
            hideInMenu: true,
            authority: [
              'P_DIRECTORY_ALL',
              'P_DIRECTORY_VIEW',
              'M_DIRECTORY_VIEW',
              'M_EMPLOYEE_MANAGEMENT_VIEW',
            ],
          },
          {
            path: '/employees',
            name: 'employees',
            icon: '/assets/images/menuIcons/members.svg',
            component: './Directory',
            authority: [OWNER],
          },
          {
            path: '/employees/:tabName',
            // name: 'employees',
            component: './Directory',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: '/onboarding',
            name: 'onboarding',
            icon: '/assets/images/menuIcons/onboarding.svg',
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/:type',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/list/view/:reId',
            redirect: '/onboarding/list/view/:reId/basic-information',
            hideInMenu: true,
            name: 'add-team-member',
          },
          {
            path: '/onboarding/new-joinees/view-detail/:userId',
            name: 'candidate-profile',
            hideInMenu: true,
            component: './Onboarding/components/NewJoinees/components/CandidateProfile',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/offboarding',
            name: 'offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/:tabName(my-request)',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName(company-wide)',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName(team)',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName(settings)',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName(settings)/:type',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off',
            name: 'time-off',
            icon: '/assets/images/menuIcons/timeoff.svg',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/:tabName(overview)',
            name: 'timeoff-overview',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName(setup)',
            name: 'timeoff-setup',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName(setup)/:type',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName(setup)/:type(types-rules)/:action(add)',
            name: 'time-off-type-configuration',
            component:
              './TimeOff/components/SetupTimeoff/components/TimeOffType/components/TypeConfiguration',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName(setup)/:type(types-rules)/:action(configure)/:typeId',
            name: 'time-off-type-configuration',
            component:
              './TimeOff/components/SetupTimeoff/components/TimeOffType/components/TypeConfiguration',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/users-management',
            name: 'users',
            icon: '/assets/images/menuIcons/user.svg',
            component: './UsersManagement',
            authority: ['M_USER_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/employees/employee-profile/:reId',
            redirect: '/employees/employee-profile/:reId/general-info',
          },
          {
            path: '/employees/employee-profile/:reId/:tabName',
            // name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: '/user-profile/:reId',
            name: 'user-profile',
            component: './UserProfile',
            hideInMenu: true,
            authority: [OWNER, ADMIN],
          },
          {
            path: '/companies-management',
            name: 'companies',
            icon: '/assets/images/menuIcons/company.svg',
            component: './CompaniesManagement',
            authority: ['M_COMPANY_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/companies-management/add-company',
            name: 'add-company',
            hideInMenu: true,
            component: './CompaniesManagement/components/AddCompany',
            authority: [OWNER],
          },
          {
            path: '/companies-management/company-detail/:reId',
            name: 'company-detail',
            component: './CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: '/candidates-management',
            name: 'candidates',
            icon: '/assets/images/menuIcons/candidate.svg',
            component: './CandidatesManagement',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/candidates-management/:action(candidate-detail)/:reId',
            name: 'candidate-detail',
            icon: '/assets/images/menuIcons/candidate.svg',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/documents-management',
            name: 'documents',
            // icon: '/assets/images/menuIcons/documents.svg',
            icon: '/assets/images/menuIcons/icon3.svg',
            component: './DocumentsManagement',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/time-off-management',
            name: 'timeoff-management',
            icon: '/assets/images/timeOff.svg',
            component: './TimeOffManagement',
            authority: ['M_TIMEOFF_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/offboarding-management',
            name: 'offboarding-management',
            icon: '/assets/images/iconOffboarding.svg',
            component: './OffboardingManagement',
            authority: ['M_OFFBOARDING_MANAGEMENT_VIEW', OWNER],
          },

          {
            path: '/documents/upload-document',
            name: 'upload-document',
            hideInMenu: true,
            component: './DocumentsManagement/components/UploadDocument',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/documents/create-template',
            name: 'create-template',
            hideInMenu: true,
            component: './DocumentsManagement/components/CreateNewTemplate',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          // TIMEOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-timeoff/:action(new)',
            name: 'request-for-timeoff',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-timeoff/:action(new-behalf-of)',
            name: 'request-for-timeoff',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-timeoff/:action(edit)/:reId',
            name: 'edit-timeoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-timeoff/view/:reId',
            name: 'view-timeoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ViewRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/manager-timeoff/view/:reId',
            name: 'view-timeoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ManagerViewRequestForm',
            authority: [
              'P_TIMEOFF_T_TEAM_REQUEST_HR_VIEW',
              'P_TIMEOFF_T_TEAM_REQUEST_MANAGER_VIEW',
              OWNER,
            ],
          },

          // COMPOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-compoff/:action(new)',
            name: 'request-for-compoff',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/CompoffRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-compoff/:action(edit)/:reId',
            name: 'edit-compoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/CompoffRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-compoff/view/:reId',
            name: 'view-compoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ViewCompoffRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/manager-compoff/view/:reId',
            name: 'view-compoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ManagerViewCompoffForm',
            authority: [
              'P_TIMEOFF_T_TEAM_REQUEST_HR_VIEW',
              'P_TIMEOFF_T_TEAM_REQUEST_MANAGER_VIEW',
            ],
          },
          // {
          //   path: '/directory/employee-profile/:reId',
          //   name: 'employeeProfile',
          //   component: './EmployeeProfile',
          //   hideInMenu: true,
          // },
          {
            path: '/directory/employee-profile/:reId',
            redirect: '/directory/employee-profile/:reId/general-info',
          },
          {
            path: '/directory/employee-profile/:reId/:tabName',
            name: 'employee-profile',
            component: './EmployeeProfile',
            hideInMenu: true,
          },
          {
            path: '/onboarding/CreateFieldSection',
            name: 'onboarding.create-field-section',
            component: './Onboarding/components/CustomFields/components/CreateFieldSection',
            hideInMenu: true,
          },
          {
            path: '/onboarding/CreateNewField',
            name: 'onboarding.create-field-section',
            component: './Onboarding/components/CustomFields/components/CreateNewField',
            hideInMenu: true,
          },

          {
            path: '/onboarding/list/:action(view)/:reId',
            name: 'add-team-member',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/list/:action(view)/:reId/:tabName',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/:type/create-email-reminder',
            name: 'create-email-reminder',
            hideInMenu: true,
            component: './EmailReminder',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/edit-email/:reId',
            name: 'edit-email',
            component: './EditEmail',
            hideInMenu: true,
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/view-email/:reId',
            name: 'view-email',
            component: './EditEmail',
            hideInMenu: true,
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/template-details/:templateId',
            name: 'template-details',
            hideInMenu: true,
            component: './TemplateDetails',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/:type/create-new-template',
            name: 'create-new-template',
            hideInMenu: true,
            component: './CreateNewTemplate',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },

          // OFFBOARDING
          // {
          //   path: '/offboarding/employeeView',
          //   name: 'resignation-request',
          //   hideInMenu: true,
          //   component: './Offboarding/components/EmployeeView',
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          // {
          //   path: '/offboarding/my-request/new',
          //   name: 'resignation-request',
          //   hideInMenu: true,
          //   component: './Offboarding/components/EmployeeView/components/ReasonForm',
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          {
            path: '/offboarding/my-request/:action(new)',
            name: 'resignation-request',
            hideInMenu: true,
            component: './Offboarding/components/MyRequest/components/ReasonForm',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/my-request/review-ticket/:reId',
            name: 'resignation-request',
            hideInMenu: true,
            component: './Offboarding/components/MyRequest/components/ResignationRequest',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/my-request/:action(edit)/:reId',
            name: 'resignation-request',
            hideInMenu: true,
            component: './Offboarding/components/MyRequest/components/ReasonForm',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          },
          // {
          //   path: '/offboarding/my-request/review/:id',
          //   name: 'review-resignation-ticket',
          //   component: './Offboarding/components/ReviewTicket',
          //   hideInMenu: true,
          //   authority: ['P_OFFBOARDING_VIEW','M_OFFBOARDING_VIEW'],
          // },
          {
            path: '/offboarding/list/review/:id',
            name: 'review-resignation-ticket',
            component: './Offboarding/components/ManagerTicketDetails',
            hideInMenu: true,
            authority: ['P_OFFBOARDING_VIEW', 'M_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/list/hr-review/:id',
            name: 'review-resignation-ticket',
            component: './Offboarding/components/HRTicketDetails',
            hideInMenu: true,
            authority: ['P_OFFBOARDING_VIEW', 'M_OFFBOARDING_VIEW'],
          },
          // {
          //   path: '/offboarding/my-request/:id',
          //   name: 'review-resignation-ticket',
          //   component: './Offboarding/components/EmployeeView/Request',
          //   hideInMenu: true,
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          // {
          //   path: '/offboarding/hr-relieving-formalities/relieving-detail/:ticketId',
          //   name: 'offboarding.relieving-detail',
          //   component:
          //     './Offboarding/components/HRView/components/RelievingFormalities/components/RelievingDetails',
          //   hideInMenu: true,
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          {
            path: '/offboarding/settings/:type/create-custom-email',
            name: 'create-custom-email',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/CustomEmails/components/CreateCustomEmail',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/edit-email/:reId',
            name: 'edit-email',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/CustomEmails/components/EditEmail',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/template-detail/:templateId',
            name: 'offboarding.template.email',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/DocsTemplates/components/TemplateDetails',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/view',
            name: 'offboarding.setting.form.view-form',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/Forms/components/ViewForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/form-detail/add',
            name: 'offboarding.setting.form.add-form',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/Forms/components/HandleForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/edit',
            name: 'offboarding.setting.form.edit-form',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/Forms/components/HandleForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/time-sheet',
            name: 'timesheet',
            icon: '/assets/images/menuIcons/timeSheet.svg',
            component: './TimeSheet',
            authority: ['P_TIMESHEET_VIEW'],
          },
          {
            path: '/time-sheet/:tabName',
            component: './TimeSheet',
            authority: ['P_TIMESHEET_VIEW'],
            hideInMenu: true,
          },

          // TICKET MANAGEMENT
          {
            path: '/ticket-management',
            name: 'ticket-management',
            icon: '/assets/images/menuIcons/ticketManagement.svg',
            component: './TicketManagement',
            authority: [
              'M_ADMIN_VIEW_TICKETS',
              'P_TICKET_MANAGEMENT_VIEW',
              'P_TICKET_MANAGEMENT_T_HR_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_IT_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_OPERATIONS_TICKETS_VIEW',
            ],
          },
          {
            path: '/ticket-management/:tabName',
            component: './TicketManagement',
            authority: [
              'M_ADMIN_VIEW_TICKETS',
              'P_TICKET_MANAGEMENT_VIEW',
              'P_TICKET_MANAGEMENT_T_HR_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_IT_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_OPERATIONS_TICKETS_VIEW',
            ],
            hideInMenu: true,
          },

          // customer-management
          {
            path: '/customer-management',
            redirect: '/customer-management/list',
            name: 'customer-management',
            icon: '/assets/images/menuIcons/customer.svg',
          },
          {
            path: '/customer-management/:tabName',
            component: './CustomerManagement',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: '/customer-management/list/customer-profile/:reId',
            redirect: '/customer-management/list/customer-profile/:reId/contact-info',
          },
          {
            path: '/customer-management/list/customer-profile/:reId/:tabName',
            name: 'view-customer',
            hideInMenu: true,
            component: './CustomerProfile',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },

          // PROJECTS MANAGEMENT
          {
            path: '/project-management',
            name: 'project-management',
            icon: '/assets/images/menuIcons/project.svg',
            component: './ProjectManagement',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
            redirect: '/project-management/list',
          },
          {
            path: '/project-management/:tabName',
            component: './ProjectManagement',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
            hideInMenu: true,
          },
          {
            path: '/project-management/list/:reId',
            hideInMenu: true,
            name: 'project-management.view-project',
            component: './ProjectManagement/components/ProjectInformation',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/project-management/list/:reId/:tabName',
            hideInMenu: true,
            component: './ProjectManagement/components/ProjectInformation',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/ticket-management/detail/:id',
            name: 'ticket-management.view-ticket',
            component: './TicketManagement/components/TicketDetails',
            hideInMenu: true,
            // authority: [MANAGER,EMPLOYEE, HR, HR_MANAGER, CEO, REGION_HEAD, DEPARTMENT_HEAD], // TEMPORARY VALUES
          },
          {
            path: '/view-document/:documentId',
            name: 'view-document',
            hideInMenu: true,
            component: './ViewDocument',
            // authority: [EMPLOYEE, HR, REGION_HEAD, OWNER, ADMIN],
          },
          // RESOURCE MANAGEMENT
          {
            path: '/resource-management',
            name: 'resource-management',
            icon: '/assets/images/menuIcons/resource.svg',
            component: './ResourceManagement',
            authority: ['P_RESOURCE_MANAGEMENT_VIEW', 'M_RESOURCE_MANAGEMENT_VIEW'],
          },
          {
            path: '/resource-management/:tabName',
            component: './ResourceManagement',
            authority: ['P_RESOURCE_MANAGEMENT_VIEW', 'M_RESOURCE_MANAGEMENT_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/change-password',
            name: 'change-password',
            hideInMenu: true,
            component: './ChangePassword',
          },
          {
            path: '/faq',
            name: 'faqs',
            hideInMenu: true,
            component: './FAQs',
          },
          {
            path: '/help-center',
            name: 'HRMS Help Center',
            hideInMenu: true,
            component: './FAQs',
          },
          {
            path: '/faq/settings',
            name: 'settings',
            hideInMenu: true,
            component: './FAQs/components/SettingFAQ',
          },
          {
            path: '/help-center/settings',
            name: 'settings',
            hideInMenu: true,
            component: './FAQs/components/SettingFAQ',
          },
          {
            path: '/policies-regulations',
            name: 'policies-regulations',
            hideInMenu: true,
            component: './PoliciesRegulations',
          },
          {
            path: '/policies-regulations/certify',
            name: 'policies-certification',
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
            name: 'search-result',
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
            name: 'search-result.advanced-search',
            hideInMenu: true,
            component: './SearchResult',
          },
          {
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/menuIcons/settings.svg',
            component: './Settings',
            authority: ['M_SETTING_VIEW', OWNER, 'M_SETTINGS_ALL'],
          },
          {
            path: '/settings/:tabName',
            component: './Settings',
            hideInMenu: true,
            authority: ['M_SETTING_VIEW', OWNER, 'M_SETTINGS_ALL'],
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

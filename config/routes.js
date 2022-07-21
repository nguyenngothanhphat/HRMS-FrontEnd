import ROLES from '../src/constants/roles';
import URLS from '../src/constants/url';

const { EMPLOYEE, ADMIN, OWNER, CANDIDATE } = ROLES;

const routes = [
  {
    path: '/',
    redirect: URLS.HOME.MAIN,
  },
  {
    path: URLS.LOGIN.GOOGLE,
    component: './SignInGoogle',
    routes: [
      {
        path: URLS.LOGIN.GOOGLE,
        component: './SignInGoogle',
      },
    ],
  },
  {
    path: URLS.LOGIN.MAIN,
    component: '../layouts/components/AuthLayout',
    routes: [
      {
        path: URLS.LOGIN.MAIN,
        component: './Login',
      },
    ],
  },
  {
    path: URLS.SIGN_UP.MAIN,
    component: '../layouts/components/SignUpLayout1',
    routes: [
      {
        path: URLS.SIGN_UP.MAIN,
        component: './SignUp1',
      },
    ],
  },
  {
    path: URLS.SIGN_UP.VERIFY,
    component: '../layouts/components/SignUpLayout1',
    routes: [
      {
        path: URLS.SIGN_UP.VERIFY,
        component: './SignUp2',
      },
    ],
  },
  {
    path: URLS.SIGN_UP.LOCATION_CONFIG,
    component: '../layouts/components/SignUpLayout2',
    routes: [
      {
        path: URLS.SIGN_UP.LOCATION_CONFIG,
        component: './SignUpConfigLocation',
      },
    ],
  },
  {
    path: URLS.CANDIDATE.MAIN,
    component: '../layouts/components/TerralogicCandidateLoginLayout',
    routes: [
      {
        path: URLS.CANDIDATE.MAIN,
        component: './Login',
      },
    ],
  },
  {
    path: URLS.PASSWORD.FORGOT_PASSWORD,
    component: '../layouts/components/AuthLayout',
    routes: [
      {
        path: '/forgot-password',
        component: './ForgotPassword',
      },
    ],
  },
  {
    path: URLS.PASSWORD.FORGOT_PASSWORD + '/:reId',
    component: '../layouts/components/AuthLayout',
    routes: [
      {
        path: URLS.PASSWORD.FORGOT_PASSWORD + '/:reId',
        component: './ResetPassword',
      },
    ],
  },
  {
    path: URLS.ACTIVE_USER + '/:id',
    component: '../layouts/components/ActiveUserLayout',
    routes: [
      {
        path: URLS.ACTIVE_USER + '/:id',
        component: './ActiveUser',
      },
    ],
  },
  {
    path: URLS.CANDIDATE.BY_LINK + '/:tokenId',
    routes: [
      {
        path: URLS.CANDIDATE.BY_LINK + '/:tokenId',
        component: './CandidateLink',
      },
    ],
  },
  {
    path: URLS.PASSWORD.FIRST_CHANGE_PASSWORD,
    component: '../layouts/components/AccountSetupLayout',
    routes: [
      {
        path: URLS.PASSWORD.FIRST_CHANGE_PASSWORD,
        component: './FirstChangePassword',
      },
    ],
  },
  {
    path: URLS.CANDIDATE.PORTAL,
    redirect: '/candidate-portal/dashboard',
  },
  {
    path: URLS.CANDIDATE.PORTAL,
    component: '../layouts/components/CandidatePortalLayout',
    authority: [CANDIDATE],
    routes: [
      {
        path: URLS.CANDIDATE.PORTAL,
        name: 'candidate-portal',
        icon: '/assets/images/menuIcons/dashboard.svg',
        hideInMenu: true,
        authority: [CANDIDATE],
        component: './CandidatePortal',
      },
      // for 2 main tab
      {
        path: URLS.CANDIDATE.PORTAL + '/:tabName',
        hideInMenu: true,
        component: './CandidatePortal',
        authority: [CANDIDATE],
      },
      // for candidate in ticket
      {
        path: URLS.CANDIDATE.PORTAL + '/:action',
        hideInMenu: true,
        component: './CandidatePortal/components/Candidate',
        authority: [CANDIDATE],
      },
    ],
  },
  {
    path: URLS.CANDIDATE.CHANGE_PASSWORD,
    component: '../layouts/components/CandidatePortalLayout',
    authority: [CANDIDATE],
    routes: [
      // for change password
      {
        path: URLS.CANDIDATE.CHANGE_PASSWORD,
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
        path: URLS.CONTROL_PANEL.MAIN,
        component: '../layouts/components/AccountSetupLayout',
        // authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
        routes: [
          {
            path: URLS.CONTROL_PANEL.MAIN,
            component: './ControlPanel',
            name: 'control-panel.name',
            // authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
          },
          {
            path: URLS.CONTROL_PANEL.COMPANY_PROFILE + '/:id',
            component: './CompanyProfile',
            name: 'control-panel.companyProfile',
            authority: [OWNER],
          },
          {
            path: URLS.CONTROL_PANEL.ADD_COMPANY,
            component: './CompanyProfile',
            name: 'control-panel.companyProfile',
            authority: [OWNER],
          },
          {
            path: URLS.CONTROL_PANEL.ADD_COMPANY + '/:tabName',
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
            path: URLS.HOME.MAIN,
            name: 'home',
            icon: '/assets/images/menuIcons/home.svg',
            component: './HomePage',
          },
          {
            path: URLS.HOME.SETTINGS,
            // hideInMenu: true,
            // component: './HomePage/components/Settings',
            redirect: URLS.HOME.POST_MANAGEMENT,
          },
          {
            name: 'home-settings',
            path: URLS.HOME.SETTINGS + '/:reId',
            hideInMenu: true,
            component: './HomePage/components/Settings',
            authority: ['P_HOMEPAGE_SETTINGS_GEAR_VIEW'], // TEMPORARY VALUES, NEED TO BE CHANGED
          },
          {
            path: URLS.DASHBOARD.MAIN,
            name: 'dashboard',
            icon: '/assets/images/menuIcons/dashboard.svg',
            component: './Dashboard',
            authority: ['P_DASHBOARD_W_DASHBOARD_VIEW'],
          },
          {
            path: URLS.DASHBOARD.APPROVALS,
            name: 'dashboard-approvals',
            hideInMenu: true,
            component: './Dashboard/components/Approval',
            authority: ['P_DASHBOARD_W_DASHBOARD_VIEW'],
          },
          {
            path: URLS.ADMIN_APP.MAIN,
            name: 'admin-app',
            icon: '/assets/images/menuIcons/adminApp.svg',
            component: './AdminApp',
            authority: [OWNER],
          },
          {
            path: URLS.ADMIN_APP.MAIN + '/:tabName',
            hideInMenu: true,
            component: './AdminApp',
            authority: [OWNER],
          },
          {
            path: URLS.DIRECTORY.MAIN,
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
            path: URLS.DIRECTORY.MAIN + '/:tabName',
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
            path: URLS.EMPLOYEE_MANAGEMENT.MAIN,
            name: 'employees',
            icon: '/assets/images/menuIcons/members.svg',
            component: './Directory',
            authority: [OWNER],
          },
          {
            path: URLS.EMPLOYEE_MANAGEMENT.MAIN + '/:tabName',
            // name: 'employees',
            component: './Directory',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: URLS.ONBOARDING.MAIN,
            name: 'onboarding',
            icon: '/assets/images/menuIcons/onboarding.svg',
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: URLS.ONBOARDING.MAIN + '/:tabName',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: URLS.ONBOARDING.MAIN + '/:tabName/:type',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: URLS.ONBOARDING.VIEW_TICKET + '/:reId',
            redirect: '/onboarding/list/view/:reId/basic-information',
            hideInMenu: true,
            name: 'add-team-member',
          },
          {
            path: URLS.ONBOARDING.VIEW_JOINEES + '/:userId',
            name: 'candidate-profile',
            hideInMenu: true,
            component: './Onboarding/components/NewJoinees/components/CandidateProfile',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: URLS.OFFBOARDING.MAIN,
            name: 'offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.OFFBOARDING.MAIN + '/:tabName',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.OFFBOARDING.SETTINGS + '/:type',
            component: './Offboarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.TIME_OFF.MAIN,
            name: 'time-off',
            icon: '/assets/images/menuIcons/timeoff.svg',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: URLS.TIME_OFF.MAIN + '/:tabName(overview)',
            name: 'timeoff-overview',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.TIME_OFF.MAIN + '/:tabName(setup)',
            name: 'timeoff-setup',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.TIME_OFF.MAIN + '/:tabName:/type',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.TIME_OFF.SETUP_TYPES_RULES + '/:action(add)',
            name: 'time-off-type-configuration',
            component:
              './TimeOff/components/SetupTimeoff/components/TimeOffType/components/TypeConfiguration',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.TIME_OFF.SETUP_TYPES_RULES + '/:action(configure)/:typeId',
            name: 'time-off-type-configuration',
            component:
              './TimeOff/components/SetupTimeoff/components/TimeOffType/components/TypeConfiguration',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.USER_MANAGEMENT.MAIN,
            name: 'users',
            icon: '/assets/images/menuIcons/user.svg',
            component: '../pages/UsersManagement',
            authority: ['M_USER_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.EMPLOYEE_MANAGEMENT.EMPLOYEE_PROFILE + '/:reId',
            redirect: '/employees/employee-profile/:reId/general-info',
          },
          {
            path: URLS.EMPLOYEE_MANAGEMENT.EMPLOYEE_PROFILE + '/:reId/:tabName',
            // name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: URLS.USER_PROFILE.MAIN + '/:reId',
            name: 'user-profile',
            component: './UserProfile',
            hideInMenu: true,
            authority: [OWNER, ADMIN],
          },
          {
            path: URLS.COMPANY_MANAGEMENT.MAIN,
            name: 'companies',
            icon: '/assets/images/menuIcons/company.svg',
            component: '../pages/CompaniesManagement',
            authority: ['M_COMPANY_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/companies-management/add-company', // OLD
            name: 'add-company',
            hideInMenu: true,
            component: '../pages/CompaniesManagement/components/AddCompany',
            authority: [OWNER],
          },
          {
            path: '/companies-management/company-detail/:reId', // OLD
            name: 'company-detail',
            component: '../pages/CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: URLS.CANDIDATE_MANAGEMENT.MAIN,
            name: 'candidates',
            icon: '/assets/images/menuIcons/candidate.svg',
            component: '../pages/CandidatesManagement',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/candidates-management/:action(candidate-detail)/:reId', // OLD
            name: 'candidate-detail',
            icon: '/assets/images/menuIcons/candidate.svg',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.DOCUMENT_MANAGEMENT.MAIN,
            name: 'documents',
            // icon: '/assets/images/menuIcons/documents.svg',
            icon: '/assets/images/menuIcons/icon3.svg',
            component: '../pages/DocumentsManagement',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.TIME_OFF_MANAGEMENT.MAIN,
            name: 'timeoff-management',
            icon: '/assets/images/timeOff.svg',
            component: '../pages/TimeOffManagement',
            authority: ['M_TIMEOFF_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.OFFBOARDING_MANAGEMENT.MAIN,
            name: 'offboarding-management',
            icon: '/assets/images/iconOffboarding.svg',
            component: '../pages/OffboardingManagement',
            authority: ['M_OFFBOARDING_MANAGEMENT_VIEW', OWNER],
          },

          {
            path: '/documents/upload-document', // OLD
            name: 'upload-document',
            hideInMenu: true,
            component: '../pages/DocumentsManagement/components/UploadDocument',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/documents/create-template', // OLD
            name: 'create-template',
            hideInMenu: true,
            component: '../pages/DocumentsManagement/components/CreateNewTemplate',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          // TIMEOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: URLS.TIME_OFF.PERSONAL + '/:action(new)',
            name: 'request-for-timeoff',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: URLS.TIME_OFF.PERSONAL + '/:action(new-behalf-of)',
            name: 'edit-timeoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: URLS.TIME_OFF.PERSONAL + '/:action(edit)/:reId',
            name: 'edit-timeoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: URLS.TIME_OFF.PERSONAL + '/:action(view)/:reId',
            name: 'view-timeoff-request',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ViewRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: URLS.TIME_OFF.MANAGER + '/view/:reId',
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
            path: URLS.DIRECTORY.EMPLOYEE_PROFILE + '/:reId',
            redirect: '/directory/employee-profile/:reId/general-info',
          },
          {
            path: URLS.DIRECTORY.EMPLOYEE_PROFILE + '/:reId/:tabName',
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
            path: URLS.ONBOARDING.LIST + '/:action(view)/:reId',
            name: 'add-team-member',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: URLS.ONBOARDING.LIST + '/:action(view)/:reId/:tabName',
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
            path: URLS.OFFBOARDING.NEW_REQUEST,
            name: 'resignation-request',
            hideInMenu: true,
            component: './Offboarding/components/EmployeeView/components/ReasonForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.OFFBOARDING.VIEW_MY_REQUEST + '/:reId',
            name: 'resignation-request',
            hideInMenu: true,
            component: './Offboarding/components/EmployeeView/components/ResignationRequest',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.OFFBOARDING.EDIT_MY_REQUEST + '/:reId',
            name: 'resignation-request',
            hideInMenu: true,
            component: './Offboarding/components/EmployeeView/components/ReasonForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          // {
          //   path: '/offboarding/my-request/review/:id',
          //   name: 'review-resignation-ticket',
          //   component: './Offboarding/components/ReviewTicket',
          //   hideInMenu: true,
          //   authority: ['P_OFFBOARDING_VIEW','M_OFFBOARDING_VIEW'],
          // },
          {
            path: URLS.OFFBOARDING.MANAGER_VIEW_REQUEST + '/:id',
            name: 'review-resignation-ticket',
            component: './Offboarding/components/ManagerView/components/TicketDetails',
            hideInMenu: true,
            authority: ['P_OFFBOARDING_VIEW', 'M_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.OFFBOARDING.HR_VIEW_REQUEST + '/:id',
            name: 'review-resignation-ticket',
            component: './Offboarding/components/HRView/components/TicketDetails',
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
            path: URLS.ONBOARDING.SETTINGS + '/:type/create-custom-email',
            name: 'create-custom-email',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/CustomEmails/components/CreateCustomEmail',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.ONBOARDING.SETTINGS + '/:type/edit-email/:reId',
            name: 'edit-email',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/CustomEmails/components/EditEmail',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.ONBOARDING.SETTINGS + '/:type/template-detail/:templateId',
            name: 'offboarding.template.email',
            hideInMenu: true,
            component:
              './Offboarding/components/Settings/components/DocsTemplates/components/TemplateDetails',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.ONBOARDING.SETTINGS + '/:type/form-detail/:id/view',
            name: 'offboarding.setting.form.view-form',
            hideInMenu: true,
            component: './Offboarding/components/Settings/components/Forms/components/ViewForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.ONBOARDING.SETTINGS + '/:type/form-detail/add',
            name: 'offboarding.setting.form.add-form',
            hideInMenu: true,
            component: './Offboarding/components/Settings/components/Forms/components/HandleForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.ONBOARDING.SETTINGS + '/:type/form-detail/:id/edit',
            name: 'offboarding.setting.form.edit-form',
            hideInMenu: true,
            component: './Offboarding/components/Settings/components/Forms/components/HandleForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: URLS.TIME_SHEET.MAIN,
            name: 'timesheet',
            icon: '/assets/images/menuIcons/timeSheet.svg',
            component: './TimeSheet',
            authority: ['P_TIMESHEET_VIEW'],
          },
          {
            path: URLS.TIME_SHEET.MAIN + '/:tabName',
            component: './TimeSheet',
            authority: ['P_TIMESHEET_VIEW'],
            hideInMenu: true,
          },

          // TICKET MANAGEMENT
          {
            path: URLS.TICKET_MANAGEMENT.MAIN,
            name: 'ticket-management',
            icon: '/assets/images/menuIcons/ticketManagement.svg',
            component: './TicketManagement',
            authority: [
              'P_TICKET_MANAGEMENT_VIEW',
              'P_TICKET_MANAGEMENT_T_HR_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_IT_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_OPERATIONS_TICKETS_VIEW',
            ],
          },
          {
            path: URLS.TICKET_MANAGEMENT.MAIN + '/:tabName',
            component: './TicketManagement',
            authority: [
              'P_TICKET_MANAGEMENT_VIEW',
              'P_TICKET_MANAGEMENT_T_HR_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_IT_TICKETS_VIEW',
              'P_TICKET_MANAGEMENT_T_OPERATIONS_TICKETS_VIEW',
            ],
            hideInMenu: true,
          },

          // customer-management
          {
            path: URLS.CUSTOMER_MANAGEMENT.MAIN,
            name: 'customer-management',
            icon: '/assets/images/menuIcons/customer.svg',
            // hideInMenu: true,
            component: './CustomerManagement',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: URLS.CUSTOMER_MANAGEMENT.MAIN + '/:tabName',
            hideInMenu: true,
            component: './CustomerManagement',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: URLS.CUSTOMER_MANAGEMENT.VIEW_CUSTOMER + '/:reId',
            hideInMenu: true,
            name: 'view-customer',
            component: './CustomerProfile',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: URLS.CUSTOMER_MANAGEMENT.VIEW_CUSTOMER + '/:reId/:tabName',
            hideInMenu: true,
            component: './CustomerProfile',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },

          // PROJECTS MANAGEMENT
          {
            path: URLS.PROJECT_MANAGEMENT.MAIN,
            name: 'project-management',
            icon: '/assets/images/menuIcons/project.svg',
            component: './ProjectManagement',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.PROJECT_MANAGEMENT.MAIN + '/:tabName',
            component: './ProjectManagement',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
            hideInMenu: true,
          },
          {
            path: URLS.PROJECT_MANAGEMENT.LIST + '/:reId',
            hideInMenu: true,
            name: 'project-management.view-project',
            component: './ProjectManagement/components/ProjectInformation',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.PROJECT_MANAGEMENT.LIST + '/:reId/:tabName',
            hideInMenu: true,
            component: './ProjectManagement/components/ProjectInformation',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: URLS.TICKET_MANAGEMENT.VIEW_TICKET + '/:id',
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
            path: URLS.RESOURCE_MANAGEMENT.MAIN,
            name: 'resource-management',
            icon: '/assets/images/menuIcons/resource.svg',
            component: './ResourceManagement',
            authority: ['P_RESOURCE_MANAGEMENT_VIEW', 'M_RESOURCE_MANAGEMENT_VIEW'],
          },
          {
            path: URLS.RESOURCE_MANAGEMENT.MAIN + '/:tabName',
            component: './ResourceManagement',
            authority: ['P_RESOURCE_MANAGEMENT_VIEW', 'M_RESOURCE_MANAGEMENT_VIEW'],
            hideInMenu: true,
          },
          {
            path: URLS.PASSWORD.CHANGE_PASSWORD,
            name: 'change-password',
            hideInMenu: true,
            component: './ChangePassword',
          },
          {
            path: URLS.FAQ.MAIN,
            name: 'faqs',
            hideInMenu: true,
            component: './FAQs',
          },
          {
            path: URLS.FAQ.SETTINGS,
            name: 'settings',
            hideInMenu: true,
            component: './FAQs/components/SettingFAQ',
          },
          {
            path: URLS.POLICIES_REGULATIONS.MAIN,
            name: 'policies-regulations',
            hideInMenu: true,
            component: './PoliciesRegulations',
          },
          {
            path: URLS.POLICIES_REGULATIONS.CERTIFY,
            name: 'policies-certification',
            hideInMenu: true,
            component: './PoliciesRegulations',
          },
          {
            path: URLS.POLICIES_REGULATIONS.SETTINGS,
            name: 'settings',
            hideInMenu: true,
            component: './PoliciesRegulations/components/Settings',
          },
          {
            path: URLS.SEARCH.MAIN,
            name: 'search-result',
            hideInMenu: true,
            component: './SearchResult',
          },
          {
            path: URLS.SEARCH.MAIN + '/:tabName',
            hideInMenu: true,
            component: './SearchResult',
          },
          {
            path: URLS.SEARCH.MAIN + '/:tabName/:advanced(advanced-search)',
            name: 'search-result.advanced-search',
            hideInMenu: true,
            component: './SearchResult',
          },
          {
            path: URLS.SETTINGS.MAIN,
            name: 'settings',
            icon: '/assets/images/menuIcons/settings.svg',
            component: '../pages/Settings',
            authority: ['M_SETTING_VIEW', OWNER, 'M_SETTINGS_ALL'],
          },
          {
            path: URLS.SETTINGS.MAIN + '/:tabName',
            component: '../pages/Settings',
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

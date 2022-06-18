import ROLES from '../src/utils/roles';
const {
  HR_MANAGER,
  HR,
  EMPLOYEE,
  REGION_HEAD,
  CEO,
  MANAGER,
  ADMIN,
  DEPARTMENT_HEAD,
  OWNER,
  PROJECT_MANAGER,
  PEOPLE_MANAGER,
  FINANCE,
  CANDIDATE,
} = ROLES;

const routes = [
  // {
  //   path: '/',
  //   redirect: '/dashboard',
  //   authority: [OWNER],
  // },
  {
    path: '/',
    redirect: '/home',
    // authority: [EMPLOYEE],
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
    path: '/candidate',
    component: '../layouts/TerralogicCandidateLoginLayout',
    routes: [
      {
        path: '/candidate',
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
    redirect: '/candidate-portal/dashboard',
  },
  {
    path: '/candidate-portal',
    component: '../layouts/CandidatePortalLayout',
    authority: [CANDIDATE],
    routes: [
      {
        path: '/candidate-portal',
        name: 'candidatePortal',
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
    component: '../layouts/CandidatePortalLayout',
    authority: [CANDIDATE],
    routes: [
      // for change password
      {
        path: '/candidate-change-password',
        name: 'candidateChangePassword',
        hideInMenu: true,
        authority: [CANDIDATE],
        component: './CandidateChangePassword',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/control-panel',
        component: '../layouts/AccountSetupLayout',
        // authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
        routes: [
          {
            path: '/control-panel',
            component: './ControlPanel',
            name: 'controlPanel.name',
            // authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
          },
          {
            path: '/control-panel/company-profile/:id',
            component: './CompanyProfile',
            name: 'controlPanel.companyProfile',
            authority: [OWNER],
          },
          {
            path: '/control-panel/add-company',
            component: './CompanyProfile',
            name: 'controlPanel.companyProfile',
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
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/home',
            name: 'home',
            icon: '/assets/images/menuIcons/home.svg',
            component: './HomePage',
          },
          {
            path: '/home/settings',
            // hideInMenu: true,
            // component: './HomePage/components/Settings',
            redirect: '/home/settings/post-management',
          },
          {
            name: 'homeSettings',
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
            name: 'dashboardApprovals',
            hideInMenu: true,
            component: './Dashboard/components/Approval',
            authority: ['P_DASHBOARD_W_DASHBOARD_VIEW'],
          },
          {
            path: '/admin-app',
            name: 'adminApp',
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
            name: 'Add a team member',
          },
          {
            path: '/onboarding/newJoinees/view-detail/:userId',
            name: 'candidateProfile',
            hideInMenu: true,
            component: './Onboarding/components/NewJoinees/CandidateProfile',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/offboarding',
            name: 'offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/:tabName',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
            hideInMenu: true,
          },
          // {
          //   path: '/offboarding/:tabName/:type',
          //   component: './OffBoarding',
          //   authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW'],
          //   hideInMenu: true,
          // },
          {
            path: '/time-off',
            name: 'timeOff',
            icon: '/assets/images/menuIcons/timeoff.svg',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/:tabName(overview)',
            name: 'Overview',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName(setup)',
            name: 'Setup Timeoff policy',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName/:type',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/setup/types-rules/:action(add)',
            name: 'timeOffTypeConfiguration',
            component:
              './TimeOff/components/SetupTimeoff/components/TimeOffType/components/TypeConfiguration',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/time-off/setup/types-rules/:action(configure)/:typeId',
            name: 'timeOffTypeConfiguration',
            component:
              './TimeOff/components/SetupTimeoff/components/TimeOffType/components/TypeConfiguration',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
            hideInMenu: true,
          },
          {
            path: '/users-management',
            name: 'users',
            icon: '/assets/images/menuIcons/user.svg',
            component: '../pages_admin/UsersManagement',
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
            name: 'userProfile',
            component: './UserProfile',
            hideInMenu: true,
            authority: [OWNER, ADMIN],
          },
          {
            path: '/companies-management',
            name: 'companies',
            icon: '/assets/images/menuIcons/company.svg',
            component: '../pages_admin/CompaniesManagement',
            authority: ['M_COMPANY_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/companies-management/add-company',
            name: 'addCompany',
            hideInMenu: true,
            component: '../pages_admin/CompaniesManagement/components/AddCompany',
            authority: [OWNER],
          },
          {
            path: '/companies-management/company-detail/:reId',
            name: 'companyDetail',
            component: '../pages_admin/CompaniesManagement/components/CompanyDetail',
            hideInMenu: true,
            authority: [OWNER],
          },
          {
            path: '/candidates-management',
            name: 'candidates',
            icon: '/assets/images/menuIcons/candidate.svg',
            component: '../pages_admin/CandidatesManagement',
            authority: ['M_CANDIDATE_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/candidates-management/:action(candidate-detail)/:reId',
            name: 'candidateDetail',
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
            component: '../pages_admin/DocumentsManagement',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/time-off-management',
            name: 'timeOffManagement',
            icon: '/assets/images/timeOff.svg',
            component: '../pages_admin/TimeOffManagement',
            authority: ['M_TIMEOFF_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/offboarding-management',
            name: 'offBoardingManagement',
            icon: '/assets/images/iconOffboarding.svg',
            component: '../pages_admin/OffBoardingManagement',
            authority: ['M_OFFBOARDING_MANAGEMENT_VIEW', OWNER],
          },

          {
            path: '/documents/upload-document',
            name: 'uploadDocument',
            hideInMenu: true,
            component: '../pages_admin/DocumentsManagement/components/UploadDocument',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/documents/create-template',
            name: 'createTemplate',
            hideInMenu: true,
            component: '../pages_admin/DocumentsManagement/components/CreateNewTemplate',
            // authority: ['admin-sa'],
            authority: ['M_DOCUMENT_MANAGEMENT_VIEW', OWNER],
          },
          // TIMEOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-timeoff/:action(new)',
            name: 'requestForTimeOff',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-timeoff/:action(edit)/:reId',
            name: 'editTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/LeaveRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-timeoff/view/:reId',
            name: 'viewTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ViewRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/manager-timeoff/view/:reId',
            name: 'viewTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ManagerViewRequestForm',
            authority: [
              'P_TIMEOFF_T_TEAM_REQUEST_HR_VIEW',
              'P_TIMEOFF_T_TEAM_REQUEST_MANAGER_VIEW',
              OWNER
            ],
          },

          // COMPOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-compoff/:action(new)',
            name: 'requestForCompoff',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/CompoffRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-compoff/:action(edit)/:reId',
            name: 'editCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/CompoffRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/personal-compoff/view/:reId',
            name: 'viewCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/Overview/components/ViewCompoffRequestForm',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW'],
          },
          {
            path: '/time-off/overview/manager-compoff/view/:reId',
            name: 'viewCompoffRequest',
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
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
          },
          {
            path: '/onboarding/CreateFieldSection',
            name: 'onboarding.createFieldSection',
            component: './Onboarding/components/CustomFields/components/CreateFieldSection',
            hideInMenu: true,
          },
          {
            path: '/onboarding/CreateNewField',
            name: 'onboarding.createFieldSection',
            component: './Onboarding/components/CustomFields/components/CreateNewField',
            hideInMenu: true,
          },

          {
            path: '/onboarding/list/:action(view)/:reId',
            name: 'addTeamMember',
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
            name: 'createEmailReminder',
            hideInMenu: true,
            component: './EmailReminder',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/edit-email/:reId',
            name: 'editEmail',
            component: './EditEmail',
            hideInMenu: true,
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/view-email/:reId',
            name: 'viewEmail',
            component: './EditEmail',
            hideInMenu: true,
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/template-details/:templateId',
            name: 'templateDetails',
            hideInMenu: true,
            component: './TemplateDetails',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },
          {
            path: '/onboarding/:tabName/:type/create-new-template',
            name: 'createNewTemplate',
            hideInMenu: true,
            component: './CreateNewTemplate',
            authority: ['P_ONBOARDING_VIEW', 'P_ONBOARDING_ALL'],
          },

          // OFFBOARDING
          // {
          //   path: '/offboarding/employeeView',
          //   name: 'resignationRequest',
          //   hideInMenu: true,
          //   component: './OffBoarding/components/EmployeeView',
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          // {
          //   path: '/offboarding/my-request/new',
          //   name: 'resignationRequest',
          //   hideInMenu: true,
          //   component: './OffBoarding/components/EmployeeView/components/ReasonForm',
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          {
            path: '/offboarding/my-request/:action(new)',
            name: 'Resignation Request',
            hideInMenu: true,
            component: './OffBoarding/components/EmployeeView/components/ReasonForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/my-request/:reId',
            name: 'Resignation Request',
            hideInMenu: true,
            component: './OffBoarding/components/EmployeeView/components/ResignationRequest',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/my-request/:action(edit)/:reId',
            name: 'Resignation Request',
            hideInMenu: true,
            component: './OffBoarding/components/EmployeeView/components/ReasonForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/my-request/review/:id',
            name: 'reviewResignationTicket',
            component: './OffBoarding/components/ReviewTicket',
            hideInMenu: true,
            authority: ['P_OFFBOARDING_VIEW','M_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/list/review/:id',
            name: 'reviewResignationTicket',
            component: './OffBoarding/components/ReviewTicket',
            hideInMenu: true,
            authority: ['P_OFFBOARDING_VIEW','M_OFFBOARDING_VIEW'],
          },
          // {
          //   path: '/offboarding/my-request/:id',
          //   name: 'reviewResignationTicket',
          //   component: './OffBoarding/components/EmployeeView/Request',
          //   hideInMenu: true,
          //   authority: ['P_OFFBOARDING_VIEW'],
          // },
          {
            path: '/offboarding/hr-relieving-formalities/relieving-detail/:ticketId',
            name: 'offboarding.relievingDetail',
            component:
              './OffBoarding/components/HRView/components/RelievingFormalities/components/RelievingDetails',
            hideInMenu: true,
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/create-custom-email',
            name: 'createCustomEmail',
            hideInMenu: true,
            component:
              './OffBoarding/components/HRView/components/Settings/components/CustomEmails/components/CreateCustomEmail',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/edit-email/:reId',
            name: 'editEmail',
            hideInMenu: true,
            component:
              './OffBoarding/components/HRView/components/Settings/components/CustomEmails/components/EditEmail',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/template-detail/:templateId',
            name: 'offboarding.template.email',
            hideInMenu: true,
            component:
              './OffBoarding/components/HRView/components/Settings/components/DocsTemplates/components/TemplateDetails',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/view',
            name: 'offboarding.setting.form.viewForm',
            hideInMenu: true,
            component:
              './OffBoarding/components/HRView/components/Settings/components/Forms/components/ViewForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/form-detail/add',
            name: 'offboarding.setting.form.addForm',
            hideInMenu: true,
            component:
              './OffBoarding/components/HRView/components/Settings/components/Forms/components/HandleForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/offboarding/settings/:type/form-detail/:id/edit',
            name: 'offboarding.setting.form.editForm',
            hideInMenu: true,
            component:
              './OffBoarding/components/HRView/components/Settings/components/Forms/components/HandleForm',
            authority: ['P_OFFBOARDING_VIEW'],
          },
          {
            path: '/time-sheet',
            name: 'timeSheet',
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
            name: 'ticketManagement',
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
            path: '/ticket-management/:tabName',
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
            path: '/customer-management',
            name: 'customerManagement',
            icon: '/assets/images/menuIcons/customer.svg',
            // hideInMenu: true,
            component: './Customer',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: '/customer-management/:tabName',
            hideInMenu: true,
            component: './Customer',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: '/customer-management/customers/customer-profile/:reId',
            hideInMenu: true,
            name: 'viewCustomer',
            component: './CustomerProfile',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },
          {
            path: '/customer-management/customers/customer-profile/:reId/:tabName',
            hideInMenu: true,
            component: './CustomerProfile',
            authority: ['P_CUSTOMER_MANAGEMENT_VIEW'],
          },

          // PROJECTS MANAGEMENT
          {
            path: '/project-management',
            name: 'projectManagement',
            icon: '/assets/images/menuIcons/project.svg',
            component: './ProjectManagement',
            authority: ['P_PROJECT_MANAGEMENT_VIEW', 'M_PROJECT_MANAGEMENT_VIEW', OWNER],
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
            name: 'projectManagement.viewProject',
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
            name: 'ticketManagement.viewTicket',
            component: './TicketManagement/components/TicketDetails',
            hideInMenu: true,
            // authority: [MANAGER,EMPLOYEE, HR, HR_MANAGER, CEO, REGION_HEAD, DEPARTMENT_HEAD], // TEMPORARY VALUES
          },
          {
            path: '/view-document/:documentId',
            name: 'viewDocument',
            hideInMenu: true,
            component: './ViewDocument',
            // authority: [EMPLOYEE, HR, REGION_HEAD, OWNER, ADMIN],
          },
          // RESOURCE MANAGEMENT
          {
            path: '/resource-management',
            name: 'resourceManagement',
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
            path: '/faqpage',
            name: 'faqs',
            hideInMenu: true,
            component: './FAQs',
          },
          {
            path: '/faqpage/settings',
            name: 'settings',
            hideInMenu: true,
            component: './FAQs/components/SettingFAQ',
          },
          {
            path: '/policies-regulations',
            name: 'policiesRegulations',
            hideInMenu: true,
            component: './PoliciesRegulations',
          },
          {
            path: '/policies-regulations/certify',
            name: 'Policies Certification',
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
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/menuIcons/settings.svg',
            component: '../pages_admin/Settings',
            authority: ['M_SETTING_VIEW', OWNER, 'M_SETTINGS_ALL'],
          },
          {
            path: '/settings/:tabName',
            component: '../pages_admin/Settings',
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

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
  {
    path: '/',
    redirect: '/home',
    authority: [EMPLOYEE],
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
        name: 'Candidate Portal',
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
        name: 'Candidate Change Password',
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
        authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
        routes: [
          {
            path: '/control-panel',
            component: './ControlPanel',
            name: 'Control Panel',
            authority: [ADMIN, OWNER, EMPLOYEE, CANDIDATE],
          },
          {
            path: '/control-panel/company-profile/:id',
            component: './CompanyProfile',
            name: 'Company Profile',
            authority: [OWNER],
          },
          {
            path: '/control-panel/add-company',
            component: './CompanyProfile',
            name: 'Company Profile',
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
        authority: [
          EMPLOYEE,
          HR,
          HR_MANAGER,
          REGION_HEAD,
          ADMIN,
          OWNER,
          MANAGER,
          DEPARTMENT_HEAD,
          PROJECT_MANAGER,
        ],
        routes: [
          {
            path: '/home',
            name: 'home',
            icon: '/assets/images/menuIcons/dashboard-old.svg',
            component: './HomePage',
            authority: [EMPLOYEE],
          },
          {
            path: '/home/settings',
            name: 'homeSettings',
            hideInMenu: true,
            component: './HomePage/components/Settings',
          },
          {
            path: '/home/post-management/add',
            name: 'homeSettingAddPost',
            hideInMenu: true,
          },
          {
            path: '/home/settings/:reId',
            hideInMenu: true,
            component: './HomePage/components/Settings',
          },
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
            component: './Dashboard/components/Approval',
            authority: [HR, HR_MANAGER, MANAGER, REGION_HEAD, DEPARTMENT_HEAD, ADMIN, OWNER],
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
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', HR, HR_MANAGER],
          },
          {
            path: '/onboarding/:tabName',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', HR, HR_MANAGER, MANAGER],
          },
          {
            path: '/onboarding/:tabName/:type',
            hideInMenu: true,
            component: './Onboarding',
            authority: ['M_ONBOARDING_VIEW', 'P_ONBOARDING_VIEW', HR, HR_MANAGER],
          },
          {
            path: '/onboarding/newJoinees/view-detail/:userId',
            name: 'candidateProfile',
            hideInMenu: true,
            component: './Onboarding/components/NewJoinees/CandidateProfile',
            authority: [MANAGER],
          },
          {
            path: '/offboarding',
            name: 'offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './OffBoarding',
            authority: [EMPLOYEE],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName',
            component: './OffBoarding',
            authority: [EMPLOYEE],
            hideInMenu: true,
          },
          {
            path: '/offboarding',
            name: 'offboarding',
            icon: '/assets/images/menuIcons/offboarding.svg',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW', HR, HR_MANAGER, MANAGER],
          },
          {
            path: '/offboarding/:tabName',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW', HR, HR_MANAGER, MANAGER],
            hideInMenu: true,
          },
          {
            path: '/offboarding/:tabName/:type',
            component: './OffBoarding',
            authority: ['M_OFFBOARDING_VIEW', 'P_OFFBOARDING_VIEW', HR, HR_MANAGER, MANAGER],
            hideInMenu: true,
          },
          {
            path: '/time-off',
            name: 'timeOff',
            icon: '/assets/images/menuIcons/timeoff.svg',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW', HR_MANAGER, HR, EMPLOYEE],
          },
          {
            path: '/time-off/:tabName',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW', HR_MANAGER, HR, EMPLOYEE],
            hideInMenu: true,
          },
          {
            path: '/time-off/:tabName/:type',
            component: './TimeOff',
            authority: ['P_TIMEOFF_VIEW', 'M_TIMEOFF_VIEW', HR_MANAGER, HR, EMPLOYEE],
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
            path: '/employees-management',
            name: 'employees',
            icon: '/assets/images/menuIcons/members.svg',
            component: '../pages_admin/EmployeesManagement',
            authority: ['M_EMPLOYEE_MANAGEMENT_VIEW', OWNER],
          },
          {
            path: '/employees/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [OWNER],
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
            component: './TimeOff/components/EmployeeLandingPage/components/LeaveRequestForm',
            authority: [EMPLOYEE],
          },
          {
            path: '/time-off/overview/personal-timeoff/:action(edit)/:reId',
            name: 'editTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/LeaveRequestForm',
            authority: [EMPLOYEE, HR, HR_MANAGER],
          },
          {
            path: '/time-off/overview/personal-timeoff/view/:reId',
            name: 'viewTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/ViewRequestForm',
            authority: [EMPLOYEE],
          },
          {
            path: '/time-off/overview/manager-timeoff/view/:reId',
            name: 'viewTimeoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/ManagerLandingPage/components/ManagerViewRequestForm',
            authority: [HR_MANAGER, MANAGER, OWNER],
          },

          // COMPOFF REQUEST
          {
            // path: '/time-off/new-leave-request',
            path: '/time-off/overview/personal-compoff/:action(new)',
            name: 'requestForCompoff',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/CompoffRequestForm',
            authority: [EMPLOYEE],
          },
          {
            path: '/time-off/overview/personal-compoff/:action(edit)/:reId',
            name: 'editCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/CompoffRequestForm',
            authority: [EMPLOYEE, HR, HR_MANAGER],
          },
          {
            path: '/time-off/overview/personal-compoff/view/:reId',
            name: 'viewCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/EmployeeLandingPage/components/ViewCompoffRequestForm',
            authority: [EMPLOYEE],
          },
          {
            path: '/time-off/overview/manager-compoff/view/:reId',
            name: 'viewCompoffRequest',
            hideInMenu: true,
            component: './TimeOff/components/ManagerLandingPage/components/ManagerViewCompoffForm',
            authority: [HR_MANAGER, MANAGER, OWNER],
          },
          {
            path: '/directory/employee-profile/:reId',
            name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [EMPLOYEE],
          },
          {
            path: '/directory/employee-profile/:reId/:tabName',
            // name: 'employeeProfile',
            component: './EmployeeProfile',
            hideInMenu: true,
            authority: [EMPLOYEE],
          },
          {
            path: '/onboarding/CreateFieldSection',
            name: 'onboarding.createFieldSection',
            component: './Onboarding/components/CustomFields/components/CreateFieldSection',
            hideInMenu: true,
            authority: [EMPLOYEE, HR_MANAGER, HR, REGION_HEAD], // TEMPORARY VALUES
          },
          {
            path: '/onboarding/CreateNewField',
            name: 'onboarding.createFieldSection',
            component: './Onboarding/components/CustomFields/components/CreateNewField',
            hideInMenu: true,
            authority: [EMPLOYEE, OWNER, HR_MANAGER, HR, REGION_HEAD], // TEMPORARY VALUES
          },

          {
            path: '/onboarding/list/:action(view)/:reId',
            name: 'addTeamMember',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: [HR_MANAGER, HR],
          },
          {
            path: '/onboarding/list/:action(view)/:reId/:tabName',
            hideInMenu: true,
            component: './NewCandidateForm',
            authority: [HR_MANAGER, HR],
          },
          {
            path: '/onboarding/:tabName/:type/create-email-reminder',
            name: 'createEmailReminder',
            hideInMenu: true,
            component: './EmailReminder',
            authority: [HR_MANAGER, HR],
          },
          {
            path: '/onboarding/:tabName/edit-email/:reId',
            name: 'editEmail',
            component: './EditEmail',
            hideInMenu: true,
            authority: [HR_MANAGER, HR],
          },
          {
            path: '/onboarding/:tabName/view-email/:reId',
            name: 'viewEmail',
            component: './EditEmail',
            hideInMenu: true,
            authority: [HR_MANAGER, HR],
          },
          {
            path: '/template-details/:templateId',
            name: 'templateDetails',
            hideInMenu: true,
            component: './TemplateDetails',
            authority: [HR_MANAGER, HR],
          },
          {
            path: '/onboarding/:tabName/:type/create-new-template',
            name: 'createNewTemplate',
            hideInMenu: true,
            component: './CreateNewTemplate',
            authority: [HR_MANAGER, HR],
          },

          // OFFBOARDING
          {
            path: '/offboarding/list/my-request/new',
            name: 'resignationRequest',
            hideInMenu: true,
            component: './ResignationRequest',
            authority: [EMPLOYEE],
          },
          {
            path: '/offboarding/list/review/:id',
            name: 'reviewResignationTicket',
            component: './OffBoarding/ReviewTicket',
            hideInMenu: true,
            authority: [HR, MANAGER, HR_MANAGER],
          },
          {
            path: '/offboarding/list/my-request/:id',
            name: 'reviewResignationTicket',
            component: './OffBoarding//EmployeeOffBoarding/Request',
            hideInMenu: true,
            authority: [EMPLOYEE],
          },
          {
            path: '/offboarding/hr-relieving-formalities/relieving-detail/:ticketId',
            name: 'offboarding.relievingDetail',
            component:
              './OffBoarding/HrOffboarding/component/RelievingFormalities/components/RelievingDetails',
            hideInMenu: true,
            authority: [HR_MANAGER, HR],
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
          {
            path: '/time-sheet',
            name: 'timeSheet',
            icon: '/assets/images/menuIcons/timeSheet.svg',
            component: './TimeSheet',
            authority: [EMPLOYEE],
          },
          {
            path: '/time-sheet/:tabName',
            component: './TimeSheet',
            authority: [EMPLOYEE],
            hideInMenu: true,
          },

          // TICKET MANAGEMENT
          {
            path: '/ticket-management',
            name: 'ticketManagement',
            icon: '/assets/images/menuIcons/ticketManagement.svg',
            component: './TicketManagement',
            authority: [HR_MANAGER, HR, MANAGER, PROJECT_MANAGER], // TEMPORARY VALUES
          },
          {
            path: '/ticket-management/:tabName',
            component: './TicketManagement',
            authority: [HR_MANAGER, HR, MANAGER, PROJECT_MANAGER], // TEMPORARY VALUES
            hideInMenu: true,
          },

          // customer-management
          {
            path: '/customer-management',
            name: 'customerManagement',
            icon: '/assets/images/menuIcons/customer.svg',
            // hideInMenu: true,
            component: './Customer',
            authority: [HR_MANAGER, HR, REGION_HEAD, ADMIN, OWNER], // TEMPORARY VALUES
          },
          {
            path: '/customer-management/:tabName',
            hideInMenu: true,
            component: './Customer',
            authority: [HR_MANAGER, HR, REGION_HEAD, ADMIN, OWNER], // TEMPORARY VALUES
          },
          {
            path: '/customer-management/customers/customer-profile/:reId',
            hideInMenu: true,
            name: 'viewCustomer',
            component: './CustomerProfile',
            authority: [HR_MANAGER, HR, REGION_HEAD, ADMIN, OWNER], // TEMPORARY VALUES
          },
          {
            path: '/customer-management/customers/customer-profile/:reId/:tabName',
            hideInMenu: true,
            component: './CustomerProfile',
            authority: [HR_MANAGER, HR, REGION_HEAD, ADMIN, OWNER], // TEMPORARY VALUES
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
            path: '/settings',
            name: 'settings',
            icon: '/assets/images/menuIcons/settings.svg',
            component: '../pages_admin/Settings',
            authority: ['M_SETTING_VIEW', OWNER],
          },
          {
            path: '/settings/:tabName',
            component: '../pages_admin/Settings',
            hideInMenu: true,
            authority: ['M_SETTING_VIEW', OWNER],
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

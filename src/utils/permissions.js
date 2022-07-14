import ROLES from '@/utils/roles';

const { HR_MANAGER, HR, MANAGER } = ROLES;

/* eslint-disable no-plusplus */
export function groupPermissions(roles) {
  let permissionsList = [];

  roles.map((role) => {
    const { permissions = [] } = role;
    permissionsList = [...permissionsList, ...permissions];
    return null;
  });

  // Remove duplicates
  const permissionsUnique = permissionsList.filter((v, i, a) => a.indexOf(v) === i);

  return permissionsUnique;
}

const isAuthorized = (permissionList, arrTextToCheck) => {
  let response = -1;
  permissionList.forEach((permission) => {
    arrTextToCheck.forEach((text) => {
      const check = permission.toLowerCase().includes(text.toLowerCase());
      if (check) response = 1;
    });
  });
  return response;
};

const isRole = (permissionList, arrTextToCheck) => {
  let response = -1;
  arrTextToCheck.forEach((text) => {
    const check = permissionList.includes(text.toLowerCase());
    if (check) response = 1;
  });
  return response;
};

export function checkPermissions(roles, isOwner, isAdmin, isEmployee) {
  if (isOwner) {
    return {
      // Directory Page
      viewTabActive: 1,
      viewTabMyTeam: isEmployee ? 1 : -1,
      viewTabInActive: 1,
      importEmployees: 1,
      addEmployee: 1,
      viewActionButton: 1,
      // Directory Page - Filter - Display location
      filterLocationActive: 1,
      filterLocationInActive: 1,
      // Directory Page - Tab general info - Public/Private Personal phone/email
      viewPersonalNumber: 1,
      viewPersonalEmail: 1,
      // Profile employee
      editWorkEmail: 1,
      editEmployeeID: 1,
      editEmployeeInfo: 1,
      editPersonalInfo: 1,
      editPassportAndVisa: 1,
      editEmergencyContact: 1,
      editProfessionalAcademic: 1,
      editEmployment: 1,
      makeChangesHistory: 1,
      viewPassportAndVisa: 1,
      viewTabEmployment: 1,
      viewTabPerformance: 1,
      viewTabAccountPaychecks: 1,
      viewTabDocument: 1,
      viewTabTimeSchedule: 1,
      viewTabBenefitPlans: 1,
      // Update avatar employee
      updateAvatarEmployee: 1,
      viewAvatarEmployee: 1,
      editShowAvatarEmployee: 1,
      viewOtherInformation: 1,

      // onboarding
      viewOnboardingSettingTab: 1,
      addTeamMemberOnboarding: -1,
      viewOnboardingOverviewTab: 1,
      viewOnboardingNewJoinees: 1,

      // timesheet
      viewMyTimesheet: -1,
      viewReportTimesheet: -1,
      viewSettingTimesheet: -1,

      // dashboard
      viewPendingApprovalDashboard: -1,
      viewMyTeamDashboard: -1,
      viewTimesheetDashboard: -1,
    };
  }
  // const permissionList = groupPermissions(roles);
  const permissionList = [...roles];

  // Directory Page
  const findIndexActive = isAuthorized(permissionList, ['T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW']);
  const findIndexMyTeam = isAuthorized(permissionList, ['T_DIRECTORY_T_MY_TEAM']);
  const findIndexInActive = isAuthorized(permissionList, ['T_DIRECTORY_T_INACTIVE']);
  const findIndexImport = isAuthorized(permissionList, [
    'T_DIRECTORY_B_IMPORTS',
    'T_DIRECTORY_B_IMPORT_EMPLOYEES',
  ]);
  const findIndexAdd = isAuthorized(permissionList, [
    'T_DIRECTORY_B_ADD',
    'T_DIRECTORY_B_ADD_EMPLOYEE',
  ]);

  const indexViewActionButton = isAuthorized(permissionList, []);

  // Directory Page - Tab general info - Public/Private Personal phone/email
  const indexEditPersonalInfo = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PERSONAL_INFORMATION',
  ]);
  const indexViewPersonalNumber = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER',
  ]);
  const indexViewPersonalEmail = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL',
  ]);

  // Directory Page - Filter - Display location
  const findIndexShowLocationActive = isAuthorized(permissionList, [
    'T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION',
  ]);
  const findIndexShowLocationInActive = isAuthorized(permissionList, [
    'T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION',
  ]);

  // Edit profile tab general info
  const findIndexWorkEmail = isAuthorized(permissionList, [
    'T_GENERAL_INFO_WORK_EMAIL_EDIT',
    'T_GENERAL_INFO_WORK_EMAIL_EMPLOYEE_EDIT',
  ]);

  const findIndexEmployeeID = isAuthorized(permissionList, [
    'T_GENERAL_INFO_EMPLOYEE_ID_EDIT',
    'T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT',
  ]);

  // Edit profile tab employment and compensation
  const findIndexEditEmp = isAuthorized(permissionList, [
    'T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW',
    'T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW',
  ]);
  const findIndexMakeChanges = isAuthorized(permissionList, [
    'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_MAKE_CHANGES_VIEW',
    'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_EMPLOYMENT_&_COMPENSATION_VIEW_B_MAKE_CHANGES_VIEW',
  ]);

  // View tabs employee profile
  const indexEmployment = isAuthorized(permissionList, [
    'T_EMPLOYMENT_AND_COMPENSATION',
    'T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE',
  ]);
  const indexPerformance = isAuthorized(permissionList, [
    'T_PERFORMENT_HISTORY',
    'T_PERFORMENT_HISTORY_EMPLOYEE',
  ]);
  const indexAccountAndPaychecks = isAuthorized(permissionList, [
    'T_PERFORMENT_HISTORY_VIEW',
    'T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
  ]);
  const indexDocument = isAuthorized(permissionList, [
    'T_DOCUMENT_VIEW',
    'T_DOCUMENT_EMPLOYEE_VIEW',
  ]);
  const indexTimeAndSchedule = isAuthorized(permissionList, [
    'T_TIME_AND_SCHEDULING_VIEW',
    'T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW',
  ]);
  const indexBenefitPlans = isAuthorized(permissionList, [
    'T_BENEFIT_PLANS_VIEW',
    'T_BENEFIT_PLANS_EMPLOYEE_VIEW',
  ]);

  // View and edit info of general info tab
  const indexViewPPAndVisa = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW',
    'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW',
  ]);
  const indexEditEmployeeInfo = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT',
    'T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT',
  ]);
  const indexEditPPAndVisa = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT',
    'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT',
  ]);
  const indexEditContact = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_T_EMERGENCY_CONTACT_EDIT',
    'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_GENERAL_INFO_VIEW_EMERGENCY_CONTACT_DETAILS_EDIT_VIEW',
  ]);
  const indexEditProfessionalAcademic = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT',
    'T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT',
  ]);

  // Update avatar employee
  const indexUpdateAvatar = isAuthorized(permissionList, [
    'T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
    'T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW',
  ]);

  // View avatar employee
  const indexViewAvatar = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
  ]);

  // Edit show avatar employee
  const indexEditShowAvatar = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
  ]);
  const indexAdvancedActions = isAuthorized(permissionList, [HR, HR_MANAGER]);

  // ONBOARDING
  const indexOnboardingSettings = isAuthorized(permissionList, [
    'P_ONBOARDING_T_SETTINGS_VIEW',
    'P_ONBOARDING_ALL',
  ]);

  const indexAddTeamMemberOnboarding = isAdmin
    ? -1
    : isAuthorized(permissionList, [
        'P_ONBOARDING_ALL',
        'P_ONBOARDING_T_SETTINGS_VIEW',
        'P_ONBOARDING_T_ONBOARDING_OVERVIEW_VIEW',
      ]);

  const indexOverviewViewOnboarding = isAuthorized(permissionList, [
    'P_ONBOARDING_T_ONBOARDING_OVERVIEW_VIEW',
    'P_ONBOARDING_ALL',
  ]);
  const indexNewJoinees = isAuthorized(permissionList, [
    'P_ONBOARDING_T_NEW_JOINEES_VIEW',
  ]);


  // TIME OFF
  const indexMyTimeoff = 1; // everyone has time off employee page
  const indexManagerTimeoff = isAuthorized(permissionList, [
    'P_TIMEOFF_T_TEAM_REQUEST_MANAGER_VIEW',
  ]);
  const indexHRTimeoff = isAuthorized(permissionList, ['P_TIMEOFF_T_TEAM_REQUEST_HR_VIEW']);
  const indexSettingTimeoff = isAuthorized(permissionList, ['P_TIMEOFF_T_SETTING_VIEW']);

  // TIMESHEET
  const indexMyTimesheet = 1; // everyone has time sheet
  const indexReportTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_FINANCE_VIEW',
    'P_TIMESHEET_T_REPORT_HR_VIEW',
    'P_TIMESHEET_T_REPORT_PROJECT_MANAGER_VIEW',
    'P_TIMESHEET_T_REPORT_PEOPLE_MANAGER_VIEW',
  ]);
  const indexSettingTimesheet = isAuthorized(permissionList, ['P_TIMESHEET_T_SETTING_VIEW']);
  const indexLocationHRView = isAuthorized(permissionList, ['P_TIMESHEET_REPORT_HR_LOCATION_VIEW']);
  const indexDivisionHRView = isAuthorized(permissionList, ['P_TIMESHEET_REPORT_HR_DIVISION_VIEW']);
  const indexLocationFinanceView = isAuthorized(permissionList, [
    'P_TIMESHEET_REPORT_FINANCE_LOCATION_VIEW',
  ]);
  const indexDivisionFinanceView = isAuthorized(permissionList, [
    'P_TIMESHEET_REPORT_FINANCE_DIVISION_VIEW',
  ]);
  const indexReportProjectViewTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_PROJECT_VIEW',
  ]);
  const indexReportProjectLocationViewTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_PROJECT_LOCATION_VIEW',
  ]);
  const indexReportProjectAdminViewTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_PROJECT_ADMIN_VIEW',
  ]);
  const indexReportTeamViewTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_TEAM_VIEW',
  ]);

  // CV = COMPLEX VIEW
  const indexHRReportCVTimesheet = isAuthorized(permissionList, ['P_TIMESHEET_T_REPORT_HR_VIEW']);
  const indexFinanceReportCVTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_FINANCE_VIEW',
  ]);
  const indexPeopleManagerCVTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_PEOPLE_MANAGER_VIEW',
  ]);
  const indexProjectManagerCVTimesheet = isAuthorized(permissionList, [
    'P_TIMESHEET_T_REPORT_PROJECT_MANAGER_VIEW',
  ]);

  // DASHBOARD
  const indexPendingApprovalDashboard = isAuthorized(permissionList, [MANAGER, HR_MANAGER]);
  const indexMyTeamDashboard = isAuthorized(permissionList, ['P_DASHBOARD_W_MY_TEAM_VIEW']);
  const indexMyAppDashboard = isAuthorized(permissionList, ['P_DASHBOARD_W_MY_APPS_VIEW']);
  const indexTimeSheetDashboard = isAuthorized(permissionList, ['P_DASHBOARD_W_MY_TIMESHEET_VIEW']);
  const indexActivityLogDashboard = isAuthorized(permissionList, [
    'P_DASHBOARD_W_ACTIVITY_LOG_VIEW',
  ]);
  const indexCalendarDashboard = isAuthorized(permissionList, ['P_DASHBOARD_W_CALENDAR_VIEW']);
  const indexTaskDashboard = isAuthorized(permissionList, ['P_DASHBOARD_W_TASK_VIEW']);

  // HOME PAGE
  const indexSettingHomePage = isAuthorized(permissionList, ['P_HOMEPAGE_SETTINGS_GEAR_VIEW']);

  // PROJECT MANAGEMENT
  // https://docs.google.com/document/d/1RQ66VdevjGUHB3-4_VDU-DIPF0HCbcfKzKJevEwooLc/edit
  const indexViewProjectListTab = isAuthorized(permissionList, ['PROJECT_MANAGEMENT_VIEW']);
  const indexAddProject = isAuthorized(permissionList, ['PROJECT_MANAGEMENT_ADD']);
  const indexModifyProject = isAuthorized(permissionList, ['PROJECT_MANAGEMENT_UPDATE']);
  const indexViewProjectSettingTab = isAuthorized(permissionList, [
    'PROJECT_MANAGEMENT_SETTINGS_VIEW',
  ]);
  const indexDeleteProject = isAuthorized(permissionList, ['PROJECT_MANAGEMENT_DELETE']);

  // RESOURCE MANAGEMENT
  // https://docs.google.com/document/d/1cEexRGiw0NaMEtcgEZCPlnh_LmiHLwYokjjaV02itcI/edit
  const indexViewResourceListTab = isAuthorized(permissionList, ['RESOURCE_MANAGEMENT_VIEW']);
  const indexViewResourceProjectListTab = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_T_PROJECT_VIEW',
  ]);
  const indexViewResourceSettingTab = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_SETTINGS_VIEW',
  ]);
  const indexViewUtilizationTab = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_UTILIZATION_VIEW',
  ]);

  const indexAddResource = isAuthorized(permissionList, ['RESOURCE_MANAGEMENT_ADD']);
  const indexModifyResource = isAuthorized(permissionList, ['RESOURCE_MANAGEMENT_UPDATE']);
  const indexViewsResourceAdminMode = isAuthorized(permissionList, [
    'P_RESOURCE_MANAGEMENT_ADMIN_VIEW',
  ]);
  const indexViewsResourceDivisionMode = isAuthorized(permissionList, [
    'P_RESOURCE_MANAGEMENT_DIVISION_VIEW',
  ]);
  const indexViewsResourceCountryMode = isAuthorized(permissionList, [
    'P_RESOURCE_MANAGEMENT_COUNTRY_VIEW',
  ]);

  // TICKET MANAGEMENT
  const indexTicketManagementHRTicketsTab = isAuthorized(permissionList, [
    'P_TICKET_MANAGEMENT_T_HR_TICKETS_VIEW',
  ]);

  const indexTicketManagementITTicketsTab = isAuthorized(permissionList, [
    'P_TICKET_MANAGEMENT_T_IT_TICKETS_VIEW',
  ]);

  const indexTicketManagementOperationsTicketsTab = isAuthorized(permissionList, [
    'P_TICKET_MANAGEMENT_T_OPERATIONS_TICKETS_VIEW',
  ]);

  // POLICY & REGULATION
  const indexViewAllCountryPolicyAndRegulation = isAuthorized(permissionList, [
    'P_POLICIESREGULATIONS_VIEW_ALL',
  ]);

  const indexSettingViewPolicy = isAuthorized(permissionList, [
    'P_POLICIESREGULATIONS_T_SETTINGS_VIEW',
  ]);
  const indexFAQSettings = isAuthorized(permissionList, ['P_FAQ_VIEW_SETTINGS']);

  // CUSTOMER MANAGEMENT
  const indexDeleteCustomer = isAuthorized(permissionList, ['P_CUSTOMER_T_CUSTOMER_B_DELETE']);
  const indexViewCustomDocument = isAuthorized(permissionList, [
    'M_DOCUMENT_MANAGEMENT_VIEW_DOCUMENT',
  ]);
  const indexManagerCustomDocument = isAuthorized(permissionList, [
    'M_DOCUMENT_MANAGEMENT_CUSTOMER_DOCUMENT',
  ]);

  return {
    // Directory Page
    viewTabActive: findIndexActive,
    viewTabMyTeam: findIndexMyTeam,
    viewTabInActive: findIndexInActive,
    importEmployees: findIndexImport,
    addEmployee: findIndexAdd,
    viewActionButton: indexViewActionButton,
    // Directory Page - Filter - Display location
    filterLocationActive: findIndexShowLocationActive,
    filterLocationInActive: findIndexShowLocationInActive,
    // Directory Page - Tab general info - Public/Private Personal phone/email
    viewPersonalNumber: indexViewPersonalNumber,
    viewPersonalEmail: indexViewPersonalEmail,
    // Profile employee
    editWorkEmail: findIndexWorkEmail,
    editEmployeeID: findIndexEmployeeID,
    editEmployeeInfo: indexEditEmployeeInfo,
    editPersonalInfo: indexEditPersonalInfo,
    editPassportAndVisa: indexEditPPAndVisa,
    editEmergencyContact: indexEditContact,
    editProfessionalAcademic: indexEditProfessionalAcademic,
    editEmployment: findIndexEditEmp,
    makeChangesHistory: findIndexMakeChanges,
    viewPassportAndVisa: indexViewPPAndVisa,
    viewTabEmployment: indexEmployment,
    viewTabPerformance: indexPerformance,
    viewTabAccountPaychecks: indexAccountAndPaychecks,
    viewTabDocument: indexDocument,
    viewTabTimeSchedule: indexTimeAndSchedule,
    viewTabBenefitPlans: indexBenefitPlans,
    // Update avatar employee
    updateAvatarEmployee: indexUpdateAvatar,
    viewAvatarEmployee: indexViewAvatar,
    editShowAvatarEmployee: indexEditShowAvatar,
    viewAdvancedActions: indexAdvancedActions,

    // onboarding
    viewOnboardingSettingTab: indexOnboardingSettings,
    addTeamMemberOnboarding: indexAddTeamMemberOnboarding,
    viewOnboardingOverviewTab: indexOverviewViewOnboarding,
    viewOnboardingNewJoinees: indexNewJoinees,
    // timeoff
    viewMyTimeoff: indexMyTimeoff,
    viewManagerTimeoff: indexManagerTimeoff,
    viewHRTimeoff: indexHRTimeoff,
    viewSettingTimeoff: indexSettingTimeoff,

    // timesheet
    viewMyTimesheet: indexMyTimesheet,
    viewReportTimesheet: indexReportTimesheet,
    viewSettingTimesheet: indexSettingTimesheet,
    viewHRReportCVTimesheet: indexHRReportCVTimesheet,
    viewFinanceReportCVTimesheet: indexFinanceReportCVTimesheet,
    viewPeopleManagerCVTimesheet: indexPeopleManagerCVTimesheet,
    viewProjectManagerCVTimesheet: indexProjectManagerCVTimesheet,
    viewLocationHRTimesheet: indexLocationHRView,
    viewLocationFinanceTimesheet: indexLocationFinanceView,
    viewDivisionHRTimesheet: indexDivisionHRView,
    viewDivisionFinanceTimesheet: indexDivisionFinanceView,
    viewReportProjectViewTimesheet: indexReportProjectViewTimesheet,
    viewReportProjectLocationViewTimesheet: indexReportProjectLocationViewTimesheet,
    viewReportProjectAdminViewTimesheet: indexReportProjectAdminViewTimesheet,
    viewReportTeamViewTimesheet: indexReportTeamViewTimesheet,

    // dashboard
    viewPendingApprovalDashboard: indexPendingApprovalDashboard,
    viewMyTeamDashboard: indexMyTeamDashboard,
    viewTimeSheetDashboard: indexTimeSheetDashboard,
    viewActivityLogDashboard: indexActivityLogDashboard,
    viewCalendarDashboard: indexCalendarDashboard,
    viewTaskDashboard: indexTaskDashboard,
    viewMyAppDashboard: indexMyAppDashboard,

    // home page
    viewSettingHomePage: indexSettingHomePage,

    // project manamgement
    viewProjectListTab: indexViewProjectListTab,
    viewProjectSettingTab: indexViewProjectSettingTab,
    addProject: indexAddProject,
    modifyProject: indexModifyProject,
    deleteProject: indexDeleteProject,

    // resource management
    viewResourceListTab: indexViewResourceListTab,
    viewResourceProjectListTab: indexViewResourceProjectListTab,
    viewResourceSettingTab: indexViewResourceSettingTab,
    viewUtilizationTab: indexViewUtilizationTab,
    addResource: indexAddResource,
    modifyResource: indexModifyResource,
    viewResourceAdminMode: indexViewsResourceAdminMode,
    viewResourceDivisionMode: indexViewsResourceDivisionMode,
    viewResourceCountryMode: indexViewsResourceCountryMode,

    // ticket management
    viewTicketHR: indexTicketManagementHRTicketsTab,
    viewTicketIT: indexTicketManagementITTicketsTab,
    viewTicketOperations: indexTicketManagementOperationsTicketsTab,

    // policy and regulation
    viewSettingPolicy: indexSettingViewPolicy,
    viewPolicyAllCountry: indexViewAllCountryPolicyAndRegulation,
    // faq page
    viewFAQSetting: indexFAQSettings,

    // customer management
    deleteCustomerManagement: indexDeleteCustomer,
    viewAddCustomerDocument: indexViewCustomDocument,
    managerCustomerDocument: indexManagerCustomDocument,
  };
}

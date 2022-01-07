import ROLES from '@/utils/roles';

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

export const getCurrentUserRoles = (roles, userTitle = '') => {
  const isOwner = roles.find((item) => item === ROLES.OWNER);
  const isCEO = roles.find((item) => item === ROLES.CEO);
  const isHRManager = roles.find((item) => item === ROLES.HR_MANAGER);
  const isHR = roles.find((item) => item === ROLES.HR);
  const isManager = roles.find((item) => item === ROLES.MANAGER);
  const isEmployee = roles.find((item) => item === ROLES.EMPLOYEE);
  const isRegionHead = roles.find((item) => item === ROLES.REGION_HEAD);
  const isDepartmentHead = roles.find((item) => item === ROLES.DEPARTMENT_HEAD);

  let isProjectManager = '';
  let isPeopleManager = '';
  let isFinance = '';

  const nameTemp = userTitle.toLowerCase();
  if (isManager) {
    if (nameTemp.includes('project') && nameTemp.includes('manager')) {
      isProjectManager = ROLES.PROJECT_MANAGER;
    }
    if (nameTemp.includes('people') && nameTemp.includes('manager')) {
      isPeopleManager = ROLES.PEOPLE_MANAGER;
    }
  }
  if (nameTemp.includes('finance')) {
    isFinance = ROLES.FINANCE;
  }

  const result = [
    isOwner,
    isCEO,
    isRegionHead,
    isDepartmentHead,
    isHRManager,
    isProjectManager,
    isPeopleManager,
    isFinance,
    isManager,
    isHR,
    isEmployee,
  ];
  return result.filter((x) => x);
};

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
  const findIndexActive = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_VIEW',
    // 'M_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW',
    'T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW',
  ]);
  const findIndexMyTeam = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_T_MY_TEAM_VIEW',
    // 'M_DIRECTORY_T_DIRECTORY_T_MY_TEAM_EMPLOYEE_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_T_MY_TEAM_EMPLOYEE_VIEW',
    'T_DIRECTORY_T_MY_TEAM',
  ]);
  const findIndexInActive = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_VIEW',
    // 'M_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_VIEW',P_DIRECTORY_T_DIRECTORY_T_INACTIVE_VIEW',
    'T_DIRECTORY_T_INACTIVE',
  ]);
  const findIndexImport = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_B_IMPORTS_VIEW',
    // 'M_DIRECTORY_T_DIRECTORY_B_IMPORT_EMPLOYEES_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_B_IMPORT_EMPLOYEES_VIEW',
    'T_DIRECTORY_B_IMPORTS',
    'T_DIRECTORY_B_IMPORT_EMPLOYEES',
  ]);
  const findIndexAdd = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_B_ADD_VIEW',
    // 'M_DIRECTORY_T_DIRECTORY_B_ADD_EMPLOYEE_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_B_ADD_EMPLOYEE_VIEW',
    'T_DIRECTORY_B_ADD',
    'T_DIRECTORY_B_ADD_EMPLOYEE',
  ]);

  const indexViewActionButton = isAuthorized(permissionList, [HR_MANAGER, HR, ADMIN]);

  // Directory Page - Tab general info - Public/Private Personal phone/email
  const indexEditPersonalInfo = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_PERSONAL_INFORMATION',
        HR,
        HR_MANAGER,
      ]);
  const indexViewPersonalNumber = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER_VIEW',
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER_EMPLOYEE_VIEW',
        'T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER',
      ]);
  const indexViewPersonalEmail = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL_VIEW',
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL_EMPLOYEE_VIEW',
        'T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL',
        HR,
        HR_MANAGER,
      ]);

  // View others personal information
  const indexViewOtherInformation = isAdmin ? 1 : isAuthorized(permissionList, [HR, HR_MANAGER]);

  // Directory Page - Filter - Display location
  const findIndexShowLocationActive = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_EMPLOYEE_VIEW',
    'T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION',
  ]);
  const findIndexShowLocationInActive = isAuthorized(permissionList, [
    // 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW',
    // 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_EMPLOYEE_VIEW',
    'T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION',
  ]);

  // Edit profile tab general info
  const findIndexWorkEmail = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_WORK_EMAIL_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_WORK_EMAIL_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_WORK_EMAIL_EDIT',
        'T_GENERAL_INFO_WORK_EMAIL_EMPLOYEE_EDIT',
        HR,
        HR_MANAGER,
      ]);

  const findIndexEmployeeID = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_EMPLOYEE_ID_EDIT',
        'T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT',
        HR,
        HR_MANAGER,
      ]);

  // Edit profile tab employment and compensation
  const findIndexEditEmp = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW',
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW',
        'T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW',
        'T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);
  const findIndexMakeChanges = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_MAKE_CHANGES_VIEW',
        'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_EMPLOYMENT_&_COMPENSATION_VIEW_B_MAKE_CHANGES_VIEW',
        HR,
        HR_MANAGER,
      ]);

  // View tabs employee profile
  const indexEmployment = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_VIEW',
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE_VIEW',
        'T_EMPLOYMENT_AND_COMPENSATION',
        'T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE',
        HR,
        HR_MANAGER,
      ]);
  const indexPerformance = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW',
        // 'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
        'T_PERFORMENT_HISTORY',
        'T_PERFORMENT_HISTORY_EMPLOYEE',
        HR,
        HR_MANAGER,
      ]);
  const indexAccountAndPaychecks = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW',
        // 'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
        'T_PERFORMENT_HISTORY_VIEW',
        'T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);
  const indexDocument = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_DOCUMENT_VIEW',
        // 'P_PROFILE_T_DOCUMENT_EMPLOYEE_VIEW',
        'T_DOCUMENT_VIEW',
        'T_DOCUMENT_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);
  const indexTimeAndSchedule = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_TIME_AND_SCHEDULING_VIEW',
        // 'P_PROFILE_T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW',
        'T_TIME_AND_SCHEDULING_VIEW',
        'T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);
  const indexBenefitPlans = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        'T_BENEFIT_PLANS_VIEW',
        'T_BENEFIT_PLANS_EMPLOYEE_VIEW',
        // 'P_PROFILE_T_BENEFIT_PLANS_VIEW',
        // 'P_PROFILE_T_BENEFIT_PLANS_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);

  // View and edit info of general info tab
  const indexViewPPAndVisa = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW',
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);
  const indexEditEmployeeInfo = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT',
        'T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT',
        HR,
        HR_MANAGER,
      ]);
  const indexEditPPAndVisa = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT',
        HR,
        HR_MANAGER,
      ]);
  const indexEditContact = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        'P_PROFILE_T_GENERAL_INFO_T_EMERGENCY_CONTACT_EDIT',
        'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_GENERAL_INFO_VIEW_EMERGENCY_CONTACT_DETAILS_EDIT_VIEW',
        HR,
        HR_MANAGER,
      ]);
  const indexEditProfessionalAcademic = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT',
        'T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT',
        HR,
        HR_MANAGER,
      ]);

  // Update avatar employee
  const indexUpdateAvatar = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
        // 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW',
        'T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
        'T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW',
        HR,
        HR_MANAGER,
      ]);

  // View avatar employee
  const indexViewAvatar = isAdmin ? 1 : isAuthorized(permissionList, [HR, HR_MANAGER]);

  // Edit show avatar employee
  const indexEditShowAvatar = isAdmin ? 1 : isAuthorized(permissionList, [HR, HR_MANAGER]);

  // ONBOARDING
  const indexOnboardingSettings = isAuthorized(permissionList, [
    HR_MANAGER,
    'ONBOARDING_T_SETTINGS_VIEW',
  ]);

  const indexAddTeamMemberOnboarding = isAdmin
    ? -1
    : isAuthorized(permissionList, [HR_MANAGER, HR]);
  const indexOverviewViewOnboarding = isAuthorized(permissionList, [
    'ONBOARDING_OVERVIEW_VIEW',
    HR_MANAGER,
    HR,
  ]);
  const indexNewJoinees = isRole(permissionList, [MANAGER]);

  // TIMESHEET
  const indexMyTimesheet = isAuthorized(permissionList, [EMPLOYEE]);
  const indexReportTimesheet = isAuthorized(permissionList, [MANAGER, HR_MANAGER]); // TEMP
  const indexSettingTimesheet = isAuthorized(permissionList, [MANAGER, HR_MANAGER]); // TEMP

  // CV = COMPLEX VIEW
  const indexHRReportCVTimesheet = isAuthorized(permissionList, [HR, HR_MANAGER]);
  const indexFinanceReportCVTimesheet = isAuthorized(permissionList, [FINANCE]);
  const indexPeopleManagerCVTimesheet = isAuthorized(permissionList, [MANAGER]);
  const indexProjectManagerCVTimesheet = isAuthorized(permissionList, [PROJECT_MANAGER]);

  // DASHBOARD
  const indexPendingApprovalDashboard = isAuthorized(permissionList, [MANAGER, HR_MANAGER]);
  const indexMyTeamDashboard = isAuthorized(permissionList, [MANAGER, HR_MANAGER]);

  // PROJECT MANAGEMENT
  // https://docs.google.com/document/d/1RQ66VdevjGUHB3-4_VDU-DIPF0HCbcfKzKJevEwooLc/edit
  const indexViewProjectListTab = isAuthorized(permissionList, [
    'PROJECT_MANAGEMENT_VIEW',
    PROJECT_MANAGER,
  ]);
  const indexAddProject = isAuthorized(permissionList, ['PROJECT_MANAGEMENT_ADD', PROJECT_MANAGER]);
  const indexModifyProject = isAuthorized(permissionList, [
    'PROJECT_MANAGEMENT_UPDATE',
    PROJECT_MANAGER,
  ]);
  const indexViewProjectSettingTab = isAuthorized(permissionList, [
    'PROJECT_MANAGEMENT_SETTINGS_VIEW',
  ]);

  // RESOURCE MANAGEMENT
  // https://docs.google.com/document/d/1cEexRGiw0NaMEtcgEZCPlnh_LmiHLwYokjjaV02itcI/edit
  const indexViewResourceListTab = isAuthorized(permissionList, ['RESOURCE_MANAGEMENT_VIEW']);
  const indexViewResourceProjectListTab = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_T_PROJECT_VIEW',
    PROJECT_MANAGER,
  ]);
  const indexViewResourceSettingTab = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_SETTINGS_VIEW',
    PROJECT_MANAGER,
  ]);
  const indexViewUtilizationTab = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_UTILIZATION_VIEW',
  ]);
  const indexAddResource = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_ADD',
    PROJECT_MANAGER,
  ]);
  const indexModifyResource = isAuthorized(permissionList, [
    'RESOURCE_MANAGEMENT_UPDATE',
    PROJECT_MANAGER,
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
    viewOtherInformation: indexViewOtherInformation,

    // onboarding
    viewOnboardingSettingTab: indexOnboardingSettings,
    addTeamMemberOnboarding: indexAddTeamMemberOnboarding,
    viewOnboardingOverviewTab: indexOverviewViewOnboarding,
    viewOnboardingNewJoinees: indexNewJoinees,

    // timesheet
    viewMyTimesheet: indexMyTimesheet,
    viewReportTimesheet: indexReportTimesheet,
    viewSettingTimesheet: indexSettingTimesheet,
    viewHRReportCVTimesheet: indexHRReportCVTimesheet,
    viewFinanceReportCVTimesheet: indexFinanceReportCVTimesheet,
    viewPeopleManagerCVTimesheet: indexPeopleManagerCVTimesheet,
    viewProjectManagerCVTimesheet: indexProjectManagerCVTimesheet,

    // dashboard
    viewPendingApprovalDashboard: indexPendingApprovalDashboard,
    viewMyTeamDashboard: indexMyTeamDashboard,
    viewTimesheetDashboard: 1,

    // project manamgement
    viewProjectListTab: indexViewProjectListTab,
    viewProjectSettingTab: indexViewProjectSettingTab,
    addProject: indexAddProject,
    modifyProject: indexModifyProject,

    // resource management
    viewResourceListTab: indexViewResourceListTab,
    viewResourceProjectListTab: indexViewResourceProjectListTab,
    viewResourceSettingTab: indexViewResourceSettingTab,
    viewUtilizationTab: indexViewUtilizationTab,
    addResource: indexAddResource,
    modifyResource: indexModifyResource,
  };
}

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

  const indexViewActionButton = isAuthorized(permissionList, ['hr-manager', 'hr', 'admin']);

  // Directory Page - Tab general info - Public/Private Personal phone/email
  const indexEditPersonalInfo = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_PERSONAL_INFORMATION',
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
      ]);

  // View others personal information
  const indexViewOthersInformaton = isAdmin
    ? 1
    : isAuthorized(permissionList, ['hr', 'hr-manager']);

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
      ]);

  const findIndexEmployeeID = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_EMPLOYEE_ID_EDIT',
        'T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT',
      ]);

  // Edit profile tab employment and compensation
  const findIndexEditEmp = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW',
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW',
        'T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW',
        'T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW',
      ]);
  const findIndexMakeChanges = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_MAKE_CHANGES_VIEW',
        'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_EMPLOYMENT_&_COMPENSATION_VIEW_B_MAKE_CHANGES_VIEW',
      ]);

  // View tabs employee profile
  const indexEmployment = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_VIEW',
        // 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE_VIEW',
        'T_EMPLOYMENT_AND_COMPENSATION',
        'T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE',
      ]);
  const indexPerformance = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW',
        // 'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
        'T_PERFORMENT_HISTORY',
        'T_PERFORMENT_HISTORY_EMPLOYEE',
      ]);
  const indexAccountAndPaychecks = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW',
        // 'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
        'T_PERFORMENT_HISTORY_VIEW',
        'T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
      ]);
  const indexDocument = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_DOCUMENT_VIEW',
        // 'P_PROFILE_T_DOCUMENT_EMPLOYEE_VIEW',
        'T_DOCUMENT_VIEW',
        'T_DOCUMENT_EMPLOYEE_VIEW',
      ]);
  const indexTimeAndSchedule = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_TIME_AND_SCHEDULING_VIEW',
        // 'P_PROFILE_T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW',
        'T_TIME_AND_SCHEDULING_VIEW',
        'T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW',
      ]);
  const indexBenefitPlans = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        'T_BENEFIT_PLANS_VIEW',
        'T_BENEFIT_PLANS_EMPLOYEE_VIEW',
        // 'P_PROFILE_T_BENEFIT_PLANS_VIEW',
        // 'P_PROFILE_T_BENEFIT_PLANS_EMPLOYEE_VIEW',
      ]);

  // View and edit info of general info tab
  const indexViewPPAndVisa = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW',
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW',
      ]);
  const indexEditEmployeeInfo = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT',
        'T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT',
      ]);
  const indexEditPPAndVisa = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT',
        'T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT',
      ]);
  const indexEditContact = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        'P_PROFILE_T_GENERAL_INFO_T_EMERGENCY_CONTACT_EDIT',
        'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_GENERAL_INFO_VIEW_EMERGENCY_CONTACT_DETAILS_EDIT_VIEW',
      ]);
  const indexEditProfessionalAcademic = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT',
        // 'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT',
        'T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT',
        'T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT',
      ]);

  // Update avatar employee
  const indexUpdateAvatar = isAdmin
    ? 1
    : isAuthorized(permissionList, [
        // 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
        // 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW',
        'T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
        'T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW',
      ]);

  // View avatar employee
  const indexViewAvatar = isAdmin ? 1 : isAuthorized(permissionList, ['hr', 'hr-manager']);

  // Edit show avatar employee
  const indexEditShowAvatar = isAdmin ? 1 : isAuthorized(permissionList, ['hr-manager']);

  // ONBOARDING
  const indexOnboardingSettings = isAuthorized(permissionList, [
    'hr-manager',
    'ONBOARDING_T_SETTINGS_VIEW',
  ]);

  const indexAddTeamMemberOnboarding = isAdmin
    ? -1
    : isAuthorized(permissionList, ['hr-manager', 'hr']);
  const indexOverviewViewOnboarding = isAuthorized(permissionList, [
    'ONBOARDING_OVERVIEW_VIEW',
    'hr-manager',
    'hr',
  ]);
  const indexNewJoinees = isRole(permissionList, ['manager']);

  // TIMESHEET
  const indexMyTimesheet = isAuthorized(permissionList, ['employee']);
  const indexReportTimesheet = isAuthorized(permissionList, ['manager', 'hr-manager']);
  const indexSettingTimesheet = isAuthorized(permissionList, ['manager', 'hr-manager']);

  // DASHBOARD
  const indexPendingApprovalDashboard = isAuthorized(permissionList, ['manager', 'hr-manager']);
  const indexMyTeamDashboard = isAuthorized(permissionList, ['manager', 'hr-manager']);

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
    viewOtherInformation: indexViewOthersInformaton,

    // onboarding
    viewOnboardingSettingTab: indexOnboardingSettings,
    addTeamMemberOnboarding: indexAddTeamMemberOnboarding,
    viewOnboardingOverviewTab: indexOverviewViewOnboarding,
    viewOnboardingNewJoinees: indexNewJoinees,

    // timesheet
    viewMyTimesheet: indexMyTimesheet,
    viewReportTimesheet: indexReportTimesheet,
    viewSettingTimesheet: indexSettingTimesheet,

    // dashboard
    viewPendingApprovalDashboard: indexPendingApprovalDashboard,
    viewMyTeamDashboard: indexMyTeamDashboard,
    viewTimesheetDashboard: 1,
  };
}

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

export function checkPermissions(roles, isOwner, isAdmin, isEmployee) {
  const isHaveFullPermissions = isOwner || isAdmin;

  if (isHaveFullPermissions) {
    return {
      // Directory Page
      viewTabActive: 1,
      viewTabMyTeam: isEmployee ? 1 : -1,
      viewTabInActive: 1,
      importEmployees: 1,
      addEmployee: 1,
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
    };
  }
  // const permissionList = groupPermissions(roles);
  const permissionList = [...roles];

  // Directory Page
  const findIndexActive = isAuthorized(permissionList, ['T_ACTIVE']);
  const findIndexMyTeam = isAuthorized(permissionList, ['T_MY_TEAM']);
  const findIndexInActive = isAuthorized(permissionList, ['T_INACTIVE']);
  const findIndexImport = isAuthorized(permissionList, ['B_IMPORT']);
  const findIndexAdd = isAuthorized(permissionList, ['B_ADD_EMPLOYEE']);

  // Directory Page - Tab general info - Public/Private Personal phone/email
  const indexEditPersonalInfo = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PERSONAL_INFORMATION_EDIT',
    'PERSONAL_INFORMATION_EDIT',
  ]);
  const indexViewPersonalNumber = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER_VIEW',
    'PERSONAL_NUMBER_VIEW',
  ]);
  const indexViewPersonalEmail = isAuthorized(permissionList, [
    'T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL_VIEW',
    'PERSONAL_EMAIL_VIEW',
  ]);

  // Directory Page - Filter - Display location
  const findIndexShowLocationActive = isAuthorized(permissionList, [
    'T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW',
    'T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_EMPLOYEE_VIEW',
  ]);
  const findIndexShowLocationInActive = isAuthorized(permissionList, [
    'T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW',
    'T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_EMPLOYEE_VIEW',
  ]);

  // Edit profile tab general info
  const findIndexWorkEmail = isAuthorized(permissionList, [
    'T_GENERAL_INFO_WORK_EMAIL_EDIT',
    'T_GENERAL_INFO_WORK_EMAIL_EMPLOYEE_EDIT',
  ]);

  const findIndexEmployeeID = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EDIT',
    'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT',
  ]);

  // Edit profile tab employment and compensation
  const findIndexEditEmp = isAuthorized(permissionList, [
    'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW',
    'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW',
  ]);
  const findIndexMakeChanges = isAuthorized(permissionList, [
    'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_MAKE_CHANGES_VIEW',
    'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_EMPLOYMENT_&_COMPENSATION_VIEW_B_MAKE_CHANGES_VIEW',
  ]);

  // View tabs employee profile
  const indexEmployment = isAuthorized(permissionList, [
    'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_VIEW',
    'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE_VIEW',
  ]);
  const indexPerformance = isAuthorized(permissionList, [
    'P_PROFILE_T_PERFORMENT_HISTORY_VIEW',
    'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
  ]);
  const indexAccountAndPaychecks = isAuthorized(permissionList, [
    'P_PROFILE_T_PERFORMENT_HISTORY_VIEW',
    'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW',
  ]);
  const indexDocument = isAuthorized(permissionList, [
    'P_PROFILE_T_DOCUMENT_VIEW',
    'P_PROFILE_T_DOCUMENT_EMPLOYEE_VIEW',
  ]);
  const indexTimeAndSchedule = isAuthorized(permissionList, [
    'P_PROFILE_T_TIME_AND_SCHEDULING_VIEW',
    'P_PROFILE_T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW',
  ]);
  const indexBenefitPlans = isAuthorized(permissionList, [
    'P_PROFILE_T_BENEFIT_PLANS_VIEW',
    'P_PROFILE_T_BENEFIT_PLANS_EMPLOYEE_VIEW',
  ]);

  // View and edit info of general info tab
  const indexViewPPAndVisa = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW',
    'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW',
  ]);
  const indexEditEmployeeInfo = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT',
    'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT',
  ]);
  const indexEditPPAndVisa = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT',
    'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT',
  ]);
  const indexEditContact = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_T_EMERGENCY_CONTACT_EDIT',
    'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_GENERAL_INFO_VIEW_EMERGENCY_CONTACT_DETAILS_EDIT_VIEW',
  ]);
  const indexEditProfessionalAcademic = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT',
    'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT',
  ]);

  // Update avatar employee
  const indexUpdateAvatar = isAuthorized(permissionList, [
    'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW',
    'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW',
  ]);

  return {
    // Directory Page
    viewTabActive: findIndexActive,
    viewTabMyTeam: findIndexMyTeam,
    viewTabInActive: findIndexInActive,
    importEmployees: findIndexImport,
    addEmployee: findIndexAdd,
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
  };
}

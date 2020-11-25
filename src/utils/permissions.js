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

export function checkPermissions(roles) {
  const permissionList = groupPermissions(roles);
  // Directory Page
  const tabActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW';
  const tabMyTeam = 'P_DIRECTORY_T_DIRECTORY_T_MY_TEAM_VIEW';
  const tabInActive = 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_VIEW';
  const importEmployees = 'P_DIRECTORY_T_DIRECTORY_B_IMPORT_EMPLOYEES_VIEW';
  const addEmployee = 'P_DIRECTORY_T_DIRECTORY_B_ADD_EMPLOYEE_VIEW';
  const findIndexActive = permissionList.indexOf(tabActive);
  const findIndexMyTeam = permissionList.indexOf(tabMyTeam);
  const findIndexInActive = permissionList.indexOf(tabInActive);
  const findIndexImport = permissionList.indexOf(importEmployees);
  const findIndexAdd = permissionList.indexOf(addEmployee);
  // Directory Page - Filter - Display location
  const showLocationActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW';
  const showLocationInActive = 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW';
  const findIndexShowLocationActive = permissionList.indexOf(showLocationActive);
  const findIndexShowLocationInActive = permissionList.indexOf(showLocationInActive);

  // Edit profile tab general info
  const editWorkEmail = 'P_PROFILE_T_GENERAL_INFO_WORK_EMAIL_EDIT';
  const editEmployeeID = 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EDIT';
  const findIndexWorkEmail = permissionList.indexOf(editWorkEmail);
  const findIndexEmployeeID = permissionList.indexOf(editEmployeeID);

  // Edit profile tab employment and compensation
  const editEmployment = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW';
  const makeChangesHistory = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_MAKE_CHANGES_VIEW';
  const findIndexEditEmp = permissionList.indexOf(editEmployment);
  const findIndexMakeChanges = permissionList.indexOf(makeChangesHistory);

  // View tabs employee profile
  const employment = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_VIEW';
  const performance = 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW';
  const accountAndPaychecks = 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW';
  const document = 'P_PROFILE_T_DOCUMENT_VIEW';
  const timeAndSchedule = 'P_PROFILE_T_TIME_AND_SCHEDULING_VIEW';
  const benefitPlans = 'P_PROFILE_T_BENEFIT_PLANS_VIEW';
  const indexEmployment = permissionList.indexOf(employment);
  const indexPerformance = permissionList.indexOf(performance);
  const indexAccountAndPaychecks = permissionList.indexOf(accountAndPaychecks);
  const indexDocument = permissionList.indexOf(document);
  const indexTimeAndSchedule = permissionList.indexOf(timeAndSchedule);
  const indexBenefitPlans = permissionList.indexOf(benefitPlans);

  // View and edit info of general info tab
  const passportAndVisa = 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW';
  const editEmployeeInfo = 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT';
  const editPersonalInfo = 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EDIT';
  const editPassportAndVisa = 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT';
  const editContact = 'P_PROFILE_T_GENERAL_INFO_T_EMERGENCY_CONTACT_EDIT';
  const editProfessionalAcademic = 'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT';
  const indexViewPPAndVisa = permissionList.indexOf(passportAndVisa);
  const indexEditEmployeeInfo = permissionList.indexOf(editEmployeeInfo);
  const indexEditPersonalInfo = permissionList.indexOf(editPersonalInfo);
  const indexEditPPAndVisa = permissionList.indexOf(editPassportAndVisa);
  const indexEditContact = permissionList.indexOf(editContact);
  const indexEditProfessionalAcademic = permissionList.indexOf(editProfessionalAcademic);

  // Update avatar employee
  const updateAvatarEmp = 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW';
  const indexUpdateAvatar = permissionList.indexOf(updateAvatarEmp);

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

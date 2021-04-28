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

const getIndex = (permissionList, index1, index2) => {
  return permissionList.indexOf(index1) === -1
    ? permissionList.indexOf(index2)
    : permissionList.indexOf(index1);
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
  // employee
  const tabActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_VIEW';
  const tabMyTeam = 'P_DIRECTORY_T_DIRECTORY_T_MY_TEAM_VIEW';
  const tabInActive = 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_VIEW';
  const importEmployees = 'P_DIRECTORY_T_DIRECTORY_B_IMPORTS_VIEW';
  const addEmployee = 'P_DIRECTORY_T_DIRECTORY_B_ADD_VIEW';
  // admin
  const tabActive1 = 'M_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_VIEW';
  const tabMyTeam1 = 'M_DIRECTORY_T_DIRECTORY_T_MY_TEAM_EMPLOYEE_VIEW';
  const tabInActive1 = 'M_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_VIEW';
  const importEmployees1 = 'M_DIRECTORY_T_DIRECTORY_B_IMPORT_EMPLOYEES_VIEW';
  const addEmployee1 = 'M_DIRECTORY_T_DIRECTORY_B_ADD_EMPLOYEE_VIEW';

  const findIndexActive = getIndex(permissionList, tabActive, tabActive1);
  const findIndexMyTeam = getIndex(permissionList, tabMyTeam, tabMyTeam1);
  const findIndexInActive = getIndex(permissionList, tabInActive, tabInActive1);
  const findIndexImport = getIndex(permissionList, importEmployees, importEmployees1);
  const findIndexAdd = getIndex(permissionList, addEmployee, addEmployee1);

  // Directory Page - Tab general info - Public/Private Personal phone/email
  // employee
  const editPersonalInfo = 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EDIT';
  const viewPersonalNumber = 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER_VIEW';
  const viewPersonalEmail = 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL_VIEW';

  // admin
  const editPersonalInfo1 = 'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_EMPLOYEE_EDIT';
  const viewPersonalNumber1 =
    'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_NUMBER_EMPLOYEE_VIEW';
  const viewPersonalEmail1 =
    'P_PROFILE_T_GENERAL_INFO_T_PERSONAL_INFORMATION_PERSONAL_EMAIL_EMPLOYEE_VIEW';

  const indexEditPersonalInfo = getIndex(permissionList, editPersonalInfo, editPersonalInfo1);
  const indexViewPersonalNumber = getIndex(permissionList, viewPersonalNumber, viewPersonalNumber1);
  const indexViewPersonalEmail = getIndex(permissionList, viewPersonalEmail, viewPersonalEmail1);

  // Directory Page - Filter - Display location
  // employee
  const showLocationActive = 'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW';
  const showLocationInActive = 'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_VIEW';

  // admin
  const showLocationActive1 =
    'P_DIRECTORY_T_DIRECTORY_T_ACTIVE_EMPLOYEE_S_FILTER_LOCATION_EMPLOYEE_VIEW';
  const showLocationInActive1 =
    'P_DIRECTORY_T_DIRECTORY_T_INACTIVE_EMPLOYEE_S_FILTER_LOCATION_EMPLOYEE_VIEW';

  const findIndexShowLocationActive = getIndex(
    permissionList,
    showLocationActive,
    showLocationActive1,
  );
  const findIndexShowLocationInActive = getIndex(
    permissionList,
    showLocationInActive,
    showLocationInActive1,
  );

  // Edit profile tab general info
  // employee
  const editWorkEmail = 'P_PROFILE_T_GENERAL_INFO_WORK_EMAIL_EDIT';
  const editEmployeeID = 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EDIT';

  // admin
  const editWorkEmail1 = 'P_PROFILE_T_GENERAL_INFO_WORK_EMAIL_EMPLOYEE_EDIT';
  const editEmployeeID1 = 'P_PROFILE_T_GENERAL_INFO_EMPLOYEE_ID_EMPLOYEE_EDIT';

  const findIndexWorkEmail = getIndex(permissionList, editWorkEmail, editWorkEmail1);
  const findIndexEmployeeID = getIndex(permissionList, editEmployeeID, editEmployeeID1);

  // Edit profile tab employment and compensation
  // employee
  const editEmployment = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_VIEW';
  const makeChangesHistory = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_MAKE_CHANGES_VIEW';

  // admin
  const editEmployment1 = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_B_EDIT_EMPLOYEE_VIEW';
  const makeChangesHistory1 =
    'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_EMPLOYMENT_&_COMPENSATION_VIEW_B_MAKE_CHANGES_VIEW';

  const findIndexEditEmp = getIndex(permissionList, editEmployment, editEmployment1);
  const findIndexMakeChanges = getIndex(permissionList, makeChangesHistory, makeChangesHistory1);

  // View tabs employee profile
  const employment = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_VIEW';
  const performance = 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW';
  const accountAndPaychecks = 'P_PROFILE_T_PERFORMENT_HISTORY_VIEW';
  const document = 'P_PROFILE_T_DOCUMENT_VIEW';
  const timeAndSchedule = 'P_PROFILE_T_TIME_AND_SCHEDULING_VIEW';
  const benefitPlans = 'P_PROFILE_T_BENEFIT_PLANS_VIEW';

  // admin
  const employment1 = 'P_PROFILE_T_EMPLOYMENT_AND_COMPENSATION_EMPLOYEE_VIEW';
  const performance1 = 'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW';
  const accountAndPaychecks1 = 'P_PROFILE_T_PERFORMENT_HISTORY_EMPLOYEE_VIEW';
  const document1 = 'P_PROFILE_T_DOCUMENT_EMPLOYEE_VIEW';
  const timeAndSchedule1 = 'P_PROFILE_T_TIME_AND_SCHEDULING_EMPLOYEE_VIEW';
  const benefitPlans1 = 'P_PROFILE_T_BENEFIT_PLANS_EMPLOYEE_VIEW';

  const indexEmployment = getIndex(permissionList, employment, employment1);
  const indexPerformance = getIndex(permissionList, performance, performance1);
  const indexAccountAndPaychecks = getIndex(
    permissionList,
    accountAndPaychecks,
    accountAndPaychecks1,
  );
  const indexDocument = getIndex(permissionList, document, document1);
  const indexTimeAndSchedule = getIndex(permissionList, timeAndSchedule, timeAndSchedule1);
  const indexBenefitPlans = getIndex(permissionList, benefitPlans, benefitPlans1);

  // View and edit info of general info tab
  // employee
  const passportAndVisa = 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_VIEW';
  const editEmployeeInfo = 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EDIT';
  const editPassportAndVisa = 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EDIT';
  const editContact = 'P_PROFILE_T_GENERAL_INFO_T_EMERGENCY_CONTACT_EDIT';
  const editProfessionalAcademic = 'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EDIT';

  // admin
  const passportAndVisa1 = 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_VIEW';
  const editEmployeeInfo1 = 'P_PROFILE_T_GENERAL_INFO_T_EMPLOYEE_INFORMATION_EMPLOYEE_EDIT';
  const editPassportAndVisa1 = 'P_PROFILE_T_GENERAL_INFO_T_PASSPORT_AND_VISA_EMPLOYEE_EDIT';
  const editContact1 =
    'M_DIRECTORY_SELECT_PROFILE_EMPLOYEE_T_GENERAL_INFO_VIEW_EMERGENCY_CONTACT_DETAILS_EDIT_VIEW';
  const editProfessionalAcademic1 =
    'P_PROFILE_T_GENERAL_INFO_T_PROFESSIONAL_AND_ACADEMIC_EMPLOYEE_EDIT';

  const indexViewPPAndVisa = getIndex(permissionList, passportAndVisa, passportAndVisa1);
  const indexEditEmployeeInfo = getIndex(permissionList, editEmployeeInfo, editEmployeeInfo1);
  const indexEditPPAndVisa = getIndex(permissionList, editPassportAndVisa, editPassportAndVisa1);
  const indexEditContact = getIndex(permissionList, editContact, editContact1);
  const indexEditProfessionalAcademic = getIndex(
    permissionList,
    editProfessionalAcademic,
    editProfessionalAcademic1,
  );

  // Update avatar employee
  // employee
  const updateAvatarEmp = 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_VIEW';

  // admin
  const updateAvatarEmp1 = 'P_PROFILE_T_GENERAL_INFO_B_UPLOAD_AVATAR_EMPLOYEE_VIEW';

  const indexUpdateAvatar = getIndex(permissionList, updateAvatarEmp, updateAvatarEmp1);

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

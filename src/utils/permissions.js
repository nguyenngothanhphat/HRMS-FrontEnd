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
  return {
    editWorkEmail: findIndexWorkEmail,
    editEmployeeID: findIndexEmployeeID,
    editEmployment: findIndexEditEmp,
    makeChangesHistory: findIndexMakeChanges,
  };
}

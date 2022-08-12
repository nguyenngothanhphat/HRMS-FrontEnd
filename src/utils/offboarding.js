import { reloadAuthorized } from './Authorized';

export const getEmployeeName = (generalInfo = {}) => {
  const { legalName = '', firstName = '', lastName = '', middleName = '' } = generalInfo;
  let name = legalName;

  if (!name && firstName) {
    name = `${firstName} ${lastName}`;
    if (middleName) {
      name = `${firstName} ${middleName} ${lastName}`;
    }
  }
  return name;
};

export const onJoinMeeting = (url) => {
  window.open(url, '_blank');
};

export const setOffboardingEmpMode = (value) => {
  localStorage.setItem('offboardingEmpMode', value);
};
export const getOffboardingEmpMode = () => {
  const val = localStorage.getItem('offboardingEmpMode');
  return val === 'true';
};

export const setHideOffboarding = (value) => {
  localStorage.setItem('hideOffboardingMenu', value);
};

export const getHideOffboarding = () => {
  const val = localStorage.getItem('hideOffboardingMenu');
  return val === 'true';
};

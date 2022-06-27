// eslint-disable-next-line import/no-cycle
import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority(str) {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str; // authorityString could be admin, "admin", ["admin"]

  let authority;

  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }

  if (typeof authority === 'string') {
    return [authority];
  } // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

  // eslint-disable-next-line no-undef
  if (!authority && ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return ['admin'];
  }

  return authority;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload
  reloadAuthorized();
}

export function removeLocalStorage() {
  localStorage.clear();
}

export function setTenantCurrentCompany(tenantId) {
  localStorage.setItem('tenantCurrentCompany', tenantId);
  reloadAuthorized();
}

export function getTenantCurrentCompany() {
  const tenantCurrentCompanyId = localStorage.getItem('tenantCurrentCompany');
  if (tenantCurrentCompanyId === 'undefined') return null;
  return tenantCurrentCompanyId;
}

export function setTenantId(tenantId) {
  localStorage.setItem('tenantId', tenantId);
  reloadAuthorized();
}

export function getCurrentTenant() {
  const tenantId = localStorage.getItem('tenantId');
  if (tenantId === 'undefined') return null;
  return tenantId;
}

export function setCurrentCompany(companyId) {
  localStorage.setItem('currentCompanyId', companyId);
  reloadAuthorized();
}

export function getCurrentCompany() {
  const currentCompanyId = localStorage.getItem('currentCompanyId');
  if (currentCompanyId === 'undefined') return null;
  return currentCompanyId;
}

export function setCurrentLocation(locationId) {
  localStorage.setItem('currentLocationId', locationId);
  reloadAuthorized();
}

export function getCurrentLocation() {
  const currentLocationId = localStorage.getItem('currentLocationId');
  if (currentLocationId === 'undefined') return null;
  return currentLocationId;
}

export function isOwner() {
  const roleList = JSON.parse(localStorage.getItem('antd-pro-authority')) || [];
  const owner = roleList.filter((role) => role.toLowerCase() === 'owner');
  return owner.length > 0;
}

export function isAdmin() {
  const roleList = JSON.parse(localStorage.getItem('antd-pro-authority')) || [];
  const owner = roleList.filter((role) => role.toLowerCase() === 'admin');
  return owner.length > 0;
}

export function isEmployee() {
  const roleList = JSON.parse(localStorage.getItem('antd-pro-authority')) || [];
  const employee = roleList.filter((role) => role.toLowerCase() === 'employee');
  return employee.length > 0;
}

export function setIsSwitchingRole(switchingRole) {
  localStorage.setItem('isSwitchingRole', switchingRole);
  reloadAuthorized();
}

export function getIsSwitchingRole() {
  const isSwitch = localStorage.getItem('isSwitchingRole');
  return isSwitch === 'true';
}

export function getSwitchRoleAbility() {
  const isSwitch = localStorage.getItem('switchRoleAbility');
  return isSwitch === 'true';
}

export function initViewOffboarding() {
  const view = localStorage.getItem('initViewOffboarding');
  return view === 'true';
}

export function setIsSigninGoogle(value) {
  localStorage.setItem('isSigninGoogle', value);
  // reloadAuthorized();
}
export function getIsSigninGoogle() {
  const isSigninGoogle = localStorage.getItem('isSigninGoogle');
  return isSigninGoogle === 'true';
}

// is first change password
export function setFirstChangePassword(value) {
  localStorage.setItem('firstChangePassword', value);
  // reloadAuthorized();
}
export function getFirstChangePassword() {
  const firstChangePassword = localStorage.getItem('firstChangePassword');
  return firstChangePassword === 'true';
}

// is first login
export function setIsFirstLogin(value) {
  localStorage.setItem('isFirstLogin', value);
  // reloadAuthorized();
}
export function getIsFirstLogin() {
  const isFirstLogin = localStorage.getItem('isFirstLogin');
  return isFirstLogin === 'true';
}

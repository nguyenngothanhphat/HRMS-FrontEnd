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
  // console.log('authority', authority);
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload
  reloadAuthorized();
}

export function setTenantId(tenantId) {
  localStorage.setItem('tenantId', tenantId);
  reloadAuthorized();
}

export function getCurrentTenant() {
  return localStorage.getItem('tenantId');
}

export function setCurrentCompany(companyId) {
  localStorage.setItem('currentCompanyId', companyId);
  reloadAuthorized();
}

export function getCurrentCompany() {
  return localStorage.getItem('currentCompanyId');
}

export function setCurrentLocation(locationId) {
  localStorage.setItem('currentLocationId', locationId);
  reloadAuthorized();
}

export function getCurrentLocation() {
  return localStorage.getItem('currentLocationId');
}

export function isOwner() {
  const roleList = JSON.parse(localStorage.getItem('antd-pro-authority'));
  const owner = roleList.filter(role => role.toLowerCase().includes('owner'))
  return owner.length > 0;
}

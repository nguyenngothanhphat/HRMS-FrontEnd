import {history} from 'umi';
import {setTenantId, setCurrentCompany, isOwner, setAuthority} from './authority';

export async function switchCompanyAndLocation(tenantId, companyId, locationId) {
    // setTenantId(tenantId);
    // setCurrentCompany(companyId);
    // localStorage.removeItem('currentLocationId');
    // let formatArrRoles = JSON.parse(localStorage.getItem('antd-pro-authority'));
    // if (statusCode === 200) {
    //     const currentUser = data?.users.find((user) => user?.usermap.email === email);
    //     currentUser?.permissionAdmin.forEach((e) => {
    //     formatArrRoles = [...formatArrRoles, e];
    //     });
    //     currentUser?.permissionEmployee.forEach((e) => {
    //     formatArrRoles = [...formatArrRoles, e];
    //     });
    //     setAuthority(formatArrRoles);
    // }
    // history.push(`/dashboard`);
    // }
}

export default function switchCompany() {
    
}

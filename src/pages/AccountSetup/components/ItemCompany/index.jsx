import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { history, connect } from 'umi';
import { setAuthority, setTenantId, setCurrentCompany } from '@/utils/authority';

import s from './index.less';

@connect(({ user: { currentUser: { email = '' } = {} } = {} }) => ({ email }))
class ItemCompany extends PureComponent {
  handleGetStarted = (tenantId, id) => {
    setTenantId(tenantId);
    setCurrentCompany(id);
    history.push(`/control-panel/company-profile/${id}`);
  };

  handleGoToDashboard = async (tenantId, id, isOwner) => {
    setTenantId(tenantId);
    setCurrentCompany(id);
    const { dispatch, email = '' } = this.props;
    const res = await dispatch({
      type: 'adminApp/getListAdmin',
      payload: {
        tenantId,
        company: id,
      },
    });

    if (isOwner) {
      history.push(`/admin-app`);
    } else {
      const { statusCode, data = {} } = res;
      let formatArrRoles = JSON.parse(localStorage.getItem('antd-pro-authority'));
      if (statusCode === 200) {
        const currentUser = data?.users.find((user) => user?.usermap.email === email);
        currentUser?.permissionAdmin.forEach((e) => {
          formatArrRoles = [...formatArrRoles, e];
        });
        currentUser?.permissionEmployee.forEach((e) => {
          formatArrRoles = [...formatArrRoles, e];
        });
        setAuthority(formatArrRoles);
      }
      history.push(`/dashboard`);
    }
  };

  renderAddress = (address) => {
    const {
      // addressLine1 = '', addressLine2 = '', state = '',
      country = '',
    } = address;

    let result = '';
    // if (addressLine1) result += `${addressLine1}, `;
    // if (addressLine2) result += `${addressLine2}, `;
    // if (state) result += `${state}, `;
    if (country) result += `${country}`;
    return result;
  };

  render() {
    const {
      isOwner = false,
      // isAdmin = false,
      company: { _id: id = '', tenant = '', name = '', logoUrl = '', headQuarterAddress = {} } = {},
    } = this.props;

    const address = this.renderAddress(headQuarterAddress);

    return (
      <div className={s.root}>
        <div className={s.logoCompany}>
          <img
            className={s.logoCompany__img}
            src={logoUrl || logoDefault}
            alt="logo"
            style={logoUrl ? {} : { opacity: 0.8 }}
          />
        </div>

        <div className={s.viewInfo}>
          <p className={s.viewInfo__name}>{name}</p>
          <p className={s.viewInfo__location}>{address}</p>
        </div>
        <div className={s.viewAction}>
          <Button
            className={s.btnOutline}
            onClick={() => this.handleGoToDashboard(tenant, id, isOwner)}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }
}
export default ItemCompany;

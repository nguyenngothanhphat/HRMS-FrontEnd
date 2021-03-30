import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { history } from 'umi';
import { setTenantId, setCurrentCompany } from '@/utils/authority';
import s from './index.less';

export default class ItemCompany extends PureComponent {
  handleGetStarted = (tenantId, id) => {
    setTenantId(tenantId);
    setCurrentCompany(id);
    history.push(`/account-setup/company-profile/${id}`);
  };

  handleGoToDashboard = (tenantId, id, isAdmin) => {
    setTenantId(tenantId);
    setCurrentCompany(id);
    if (isAdmin) {
      history.push(`/admin-app`);
    } else {
      history.push(`/dashboard`);
    }
  };

  renderAddress = (address) => {
    const { addressLine1 = '', addressLine2 = '', state = '', country = '' } = address;
    let result = '';
    if (addressLine1) result += `${addressLine1}, `;
    if (addressLine2) result += `${addressLine2}, `;
    if (state) result += `${state}, `;
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

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

  render() {
    const { company: { _id: id = '', tenant = '', name = '', logoUrl = '' } = {} } = this.props;
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
          {/* <p className={s.viewInfo__location}>{headQuarterAddress?.country?.name}</p> */}
        </div>
        <div className={s.viewAction}>
          <Button className={s.btnOutline} onClick={() => this.handleGetStarted(tenant, id)}>
            Get Started
          </Button>
        </div>
      </div>
    );
  }
}

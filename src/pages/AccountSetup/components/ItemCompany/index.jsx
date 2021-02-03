import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { history } from 'umi';
import s from './index.less';

export default class ItemCompany extends PureComponent {
  handleGetStarted = (id) => {
    history.push(`/account-setup/company-profile/${id}`);
  };

  render() {
    const {
      company: { logoUrl = '', name = '', headQuarterAddress = {}, _id: id = '' } = {},
    } = this.props;
    return (
      <div className={s.root}>
        <img
          src={logoUrl || logoDefault}
          alt="logo"
          className={s.logoCompany}
          style={logoUrl ? {} : { opacity: 0.8 }}
        />
        <div className={s.viewInfo}>
          <p className={s.viewInfo__name}>{name}</p>
          <p className={s.viewInfo__location}>{headQuarterAddress?.country?.name}</p>
        </div>
        <div className={s.viewAction}>
          <Button className={s.btnOutline} onClick={() => this.handleGetStarted(id)}>
            Get Started
          </Button>
        </div>
      </div>
    );
  }
}

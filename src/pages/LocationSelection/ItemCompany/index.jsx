import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { history } from 'umi';
import s from './index.less';

export default class ItemCompany extends PureComponent {
  handleGetStarted = (locationId) => {
    localStorage.setItem('currentLocation', locationId);
    history.push('/');
  };

  render() {
    const {
      company: { logoUrl = '', name = '' } = {},
      location = '',
      locationId = '',
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
          <p className={s.viewInfo__location}>{location}</p>
        </div>
        <div className={s.viewAction}>
          <Button className={s.btnOutline} onClick={() => this.handleGetStarted(locationId)}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }
}

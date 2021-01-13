import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { Link } from 'umi';
import s from './index.less';

export default class ItemCompany extends PureComponent {
  render() {
    const { company: { logo = '', name = '', location = '', status = '' } = {} } = this.props;
    const textBtn = status === 'done' ? 'Go to dashboard' : 'Get Started';
    const link = status === 'done' ? '/' : '/account-setup/get-started';

    return (
      <div className={s.root}>
        <img
          src={logo || logoDefault}
          alt="logo"
          className={s.logoCompany}
          style={logo ? {} : { opacity: 0.8 }}
        />
        <div className={s.viewInfo}>
          <p className={s.viewInfo__name}>{name}</p>
          <p className={s.viewInfo__location}>{location}</p>
        </div>
        <div className={s.viewAction}>
          <Link to={link}>
            <Button className={s.btnOutline}>{textBtn}</Button>
          </Link>
          <div className={s.option}>&#8285;</div>
        </div>
      </div>
    );
  }
}

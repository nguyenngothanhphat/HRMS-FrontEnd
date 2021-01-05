import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { Component } from 'react';
import { history } from 'umi';
import s from './index.less';

export default class ItemCompany extends Component {
  handleStartSetup = (id) => {
    history.push(`/account-setup/get-started/company-profile/${id}`);
  };

  render() {
    const { item: { logo = '', name = '', description = '', status = '' } = {} } = this.props;

    return (
      <div className={s.root}>
        <img
          src={logo || logoDefault}
          alt="logo"
          className={s.logo}
          style={logo ? {} : { opacity: 0.8 }}
        />
        <div className={s.viewInfo}>
          <p className={s.viewInfo__name}>{name}</p>
        </div>
        <div className={s.viewDescription}>
          <p className={s.viewDescription__text} style={status === 'lock' ? { opacity: 0.4 } : {}}>
            {description}
          </p>
        </div>
        <div className={s.viewAction}>
          <Button
            disabled={status === 'lock'}
            className={s.btnOutline}
            onClick={() => this.handleStartSetup(12345678)}
          >
            Start
          </Button>
        </div>
      </div>
    );
  }
}

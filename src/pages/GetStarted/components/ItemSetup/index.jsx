/* eslint-disable react/jsx-curly-newline */
import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { Component } from 'react';
import { history } from 'umi';
import s from './index.less';

export default class ItemCompany extends Component {
  handleStartSetup = (id) => {
    if (id === '1') {
      history.push(`/control-panel/get-started/company-profile`);
    } else if (id === '2') {
      history.push(`/control-panel/get-started/setup-employee-directory`);
    } else if (id === '3') {
      history.push(`/control-panel/get-started/setup-timeoff`);
    }
  };

  render() {
    const {
      item: { logo = '', id = '', name = '', description = '', status = '' } = {},
    } = this.props;

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
            onClick={() => this.handleStartSetup(id)}
          >
            Start
          </Button>
        </div>
      </div>
    );
  }
}

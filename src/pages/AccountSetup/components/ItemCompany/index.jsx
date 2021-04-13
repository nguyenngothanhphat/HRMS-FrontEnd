import logoDefault from '@/assets/companyDefault.png';
import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { history, connect } from 'umi';
import { setAuthority, setTenantId, setCurrentCompany } from '@/utils/authority';

import s from './index.less';

@connect(({ user: { currentUser: { email = '' } = {} } = {} }) => ({ email }))
class ItemCompany extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingGoToDashboard: false,
    };
  }

  handleGetStarted = (tenantId, id) => {
    setTenantId(tenantId);
    setCurrentCompany(id);
    history.push(`/control-panel/company-profile/${id}`);
  };

  wait = (delay, ...args) => {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      setTimeout(resolve, delay, ...args);
    });
  };

  handleGoToDashboard = async (tenantId, id, isOwner) => {
    this.setState({
      loadingGoToDashboard: true,
    });
    setTenantId(tenantId);
    setCurrentCompany(id);
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'user/fetchCurrent',
      refreshCompanyList: false,
    });

    if (isOwner) {
      await this.wait(500).then(() =>
        this.setState({
          loadingGoToDashboard: false,
        }),
      );
      history.push(`/admin-app`);
    } else {
      const { statusCode = 0, data = {} } = res;
      let formatArrRoles = JSON.parse(localStorage.getItem('antd-pro-authority'));
      if (statusCode === 200) {
        data?.permissionAdmin.forEach((e) => {
          formatArrRoles = [...formatArrRoles, e];
        });
        data?.permissionEmployee.forEach((e) => {
          formatArrRoles = [...formatArrRoles, e];
        });
        setAuthority(formatArrRoles);
      }
      await this.wait(500, false).then(() =>
        this.setState({
          loadingGoToDashboard: false,
        }),
      );
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
    const { loadingGoToDashboard } = this.state;
    const address = this.renderAddress(headQuarterAddress);

    return (
      <div className={s.root}>
        <div className={s.leftPart}>
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
        </div>
        <div className={s.viewAction}>
          <Button
            className={s.btnOutline}
            onClick={() => this.handleGoToDashboard(tenant, id, isOwner)}
            loading={loadingGoToDashboard}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }
}
export default ItemCompany;

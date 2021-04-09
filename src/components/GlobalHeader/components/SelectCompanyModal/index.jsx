import React, { PureComponent } from 'react';
import { Button, Modal, notification } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import {
  setCurrentCompany,
  setTenantId,
  setAuthority,
  isOwner,
  getCurrentCompany,
} from '@/utils/authority';
import { connect, history } from 'umi';
import styles from './index.less';

@connect(({ user: { companiesOfUser = [] } = {} }) => ({ companiesOfUser }))
class SelectCompanyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeCompany: '',
      activeTenant: '',
      loadingSwitch: false,
    };
  }

  setActiveCompany = (id, tenant) => {
    const { activeCompany } = this.state;
    let selectedId = id;
    if (id === activeCompany) selectedId = '';
    this.setState({ activeCompany: selectedId, activeTenant: tenant });
  };

  renderCompanyLists = () => {
    const { companiesOfUser = [] } = this.props;
    const { activeCompany } = this.state;
    const sortedCompanyList = companiesOfUser.sort((a, b) => a.name.localeCompare(b.name));
    const currentCompany = getCurrentCompany();

    return (
      <div className={styles.companyList}>
        {sortedCompanyList.map((comp) => {
          const {
            name = '',
            logoUrl = '',
            _id = '',
            tenant = '',
            headQuarterAddress: { country = '' } = {},
          } = comp;
          const className = activeCompany === _id ? styles.active : styles.eachCompany;
          const className1 = currentCompany === _id ? styles.currentCompany : '';
          return (
            <div
              className={`${className} ${className1}`}
              onClick={currentCompany === _id ? '' : () => this.setActiveCompany(_id, tenant)}
            >
              <div className={styles.leftPart}>
                <div className={styles.logo}>
                  <img src={logoUrl} alt="logo" />
                </div>
                <span className={styles.name}>
                  {name} {country ? `(${country})` : ''}{' '}
                </span>
              </div>
              <div className={styles.rightPart}>
                {activeCompany === _id && currentCompany !== _id && <RightOutlined />}
                {currentCompany === _id && <span className={styles.currentText}>Current</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  wait = (delay, ...args) => {
    // eslint-disable-next-line compat/compat
    return new Promise((resolve) => {
      setTimeout(resolve, delay, ...args);
    });
  };

  onProceed = async () => {
    const { activeCompany, activeTenant } = this.state;
    this.setState({
      loadingSwitch: true,
    });
    if (!activeCompany && !activeTenant) {
      notification.error({
        message: 'Please select a company.',
      });
    } else {
      setTenantId(activeTenant);
      setCurrentCompany(activeCompany);
      localStorage.removeItem('currentLocationId');
      const { dispatch, email = '' } = this.props;
      const res = await dispatch({
        type: 'adminApp/getListAdmin',
        payload: {
          tenantId: activeTenant,
          company: activeCompany,
        },
      });

      if (isOwner()) {
        await this.wait(500).then(() =>
          this.setState({
            loadingSwitch: false,
          }),
        );
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
        await this.wait(500).then(() =>
          this.setState({
            loadingSwitch: false,
          }),
        );
        history.push(`/dashboard`);
      }
      window.location.reload();
    }
  };

  render() {
    const { visible, onClose = () => {} } = this.props;
    const { activeCompany, loadingSwitch } = this.state;
    return (
      <Modal
        className={styles.SelectCompanyModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
        onCancel={() => onClose(false)}
      >
        <div className={styles.container}>
          <span className={styles.title}>Switch Company</span>
          <p className={styles.subtitle1}>Choose your company and click Switch.</p>
          {/* <p className={styles.subtitle2}></p> */}
          {this.renderCompanyLists()}
          <div className={styles.operationButtons}>
            <Button
              disabled={!activeCompany}
              loading={loadingSwitch}
              className={styles.proceedBtn}
              onClick={this.onProceed}
            >
              Switch
            </Button>
            <Button
              disabled={loadingSwitch}
              className={styles.cancelBtn}
              onClick={() => history.push('/control-panel')}
            >
              Control Panel
            </Button>
            <Button
              disabled={loadingSwitch}
              className={styles.cancelBtn}
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
export default SelectCompanyModal;

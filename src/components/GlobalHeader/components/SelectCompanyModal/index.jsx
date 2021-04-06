import React, { PureComponent } from 'react';
import { Button, Modal, notification } from 'antd';
import {
  setCurrentCompany,
  setTenantId,
  setAuthority,
  isOwner,
  getCurrentCompany,
  setCurrentLocation,
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
    };
  }

  setActiveCompany = (id, tenant) => {
    this.setState({ activeCompany: id, activeTenant: tenant });
  };

  renderCompanyLists = () => {
    const { companiesOfUser = [] } = this.props;
    const { activeCompany } = this.state;
    const sortedCompanyList = companiesOfUser.sort((a, b) => a.name.localeCompare(b.name));
    const currentCompany = getCurrentCompany();

    return (
      <div className={styles.companyList}>
        {sortedCompanyList.map((comp) => {
          const { name = '', logoUrl = '', _id = '', tenant = '' } = comp;
          return (
            <div
              className={activeCompany === _id ? styles.active : styles.eachCompany}
              onClick={currentCompany === _id ? '' : () => this.setActiveCompany(_id, tenant)}
            >
              <div className={styles.logo}>
                <img src={logoUrl} alt="logo" />
              </div>
              <span className={styles.name}>
                {name} {currentCompany === _id ? '(Current)' : ''}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  onProceed = async () => {
    const { activeCompany, activeTenant } = this.state;
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
        history.replace(`/admin-app`);
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
      window.location.reload();
    }
  };

  render() {
    const { visible, onClose = () => {}, loading = false } = this.props;
    const { activeCompany } = this.state;
    return (
      <Modal
        className={styles.SelectCompanyModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <span className={styles.title}>Switch Company</span>
          <p className={styles.subtitle1}>Choose your company and click Switch.</p>
          {/* <p className={styles.subtitle2}></p> */}
          {this.renderCompanyLists()}
          <div className={styles.operationButtons}>
            <Button
              disabled={!activeCompany}
              loading={loading}
              className={styles.proceedBtn}
              onClick={this.onProceed}
            >
              Switch
            </Button>
            <Button className={styles.cancelBtn} onClick={() => history.push('/control-panel')}>
              Go to Control Panel
            </Button>
            <Button className={styles.cancelBtn} onClick={() => onClose(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
export default SelectCompanyModal;

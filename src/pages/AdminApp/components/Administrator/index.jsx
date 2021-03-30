import React, { Component } from 'react';
import { connect } from 'umi';
// import { Row, Col } from 'antd';
import AdditionalAdministrator from './components/Additional';
import PrimaryAdminstrator from './components/Primary';
import AddAdmin from './components/AddAdmin';

import styles from './index.less';
import EditAdmin from './components/EditAdmin';

const listAdministrator = [
  {
    listRole: [
      {
        id: 'payroll',
        role: 'Payroll',
      },
      {
        id: 'benefits',
        role: 'Benefits',
      },
    ],
    employeeName: 'Jenny',
    email: 'jenny@terralogic.com',
    position: 'Jenny’s permission apply to everyone in the company',
  },
  {
    listRole: [
      {
        id: 'company',
        role: 'Company',
      },
    ],
    employeeName: 'Renil Komitla',
    email: 'renil@terralogic.com',
    position: 'Renil’s permission apply to everyone in the company',
  },
];

@connect(({ adminApp: { permissionList = [], listAdmin = [] }, loading }) => ({
  permissionList,
  listAdmin,
  loadingFetchPermissionList: loading.effects['adminApp/fetchPermissionList'],
  loadingFetchAdminList: loading.effects['adminApp/getListAdmin'],
}))
class Adminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddAdmin: false,
      isEditAdmin: false,
      dataAdmin: {},
    };
  }

  fetchListAdmin = () => {
    const { dispatch } = this.props;
    const tenantId = localStorage.getItem('tenantId');
    const companyId = localStorage.getItem('currentCompanyId');
    dispatch({
      type: 'adminApp/getListAdmin',
      payload: {
        tenantId,
        company: companyId,
      },
    });
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    this.fetchListAdmin();
    dispatch({
      type: 'adminApp/fetchPermissionList',
      payload: {
        type: 'ADMIN',
      },
    });
  };

  handleAddAdmin = (value) => {
    if (!value) {
      this.fetchListAdmin();
    }
    this.setState({
      isAddAdmin: value,
    });
  };

  handleEditAdmin = (value, index) => {
    const dataAdmin = listAdministrator[index];

    this.setState({
      isEditAdmin: value,
      dataAdmin,
    });
  };

  listAdmin = () => {
    const { permissionList = [], listAdmin = [] } = this.props;
    return listAdmin.map((ad) => {
      const { permissionAdmin = [], usermap: { email = '', firstName = '' } = {} } = ad;
      const listModuleName = [];
      permissionList.forEach((per) => {
        const { _id = '', module = '' } = per;
        permissionAdmin.forEach((mol) => {
          if (mol === _id)
            listModuleName.push({
              id: _id,
              role: module,
            });
        });
      });

      return {
        listRole: listModuleName,
        employeeName: firstName,
        email,
        position: 'Renil’s permission apply to everyone in the company',
      };
    });
  };

  render() {
    const { isAddAdmin, isEditAdmin, dataAdmin = {} } = this.state;
    const { permissionList = [], loadingFetchAdminList = false } = this.props;

    return (
      <div className={styles.root}>
        {isAddAdmin || isEditAdmin ? (
          <>
            {isEditAdmin ? (
              <EditAdmin
                permissionList={permissionList}
                dataAdmin={dataAdmin}
                handleEditAdmin={this.handleEditAdmin}
              />
            ) : (
              <AddAdmin handleAddAdmin={this.handleAddAdmin} permissionList={permissionList} />
            )}
          </>
        ) : (
          <>
            <div className={styles.root__top}>
              <PrimaryAdminstrator permissionList={permissionList} />
            </div>
            <div className={styles.root__bottom}>
              {!loadingFetchAdminList && (
                <AdditionalAdministrator
                  permissionList={permissionList}
                  listAdministrator={this.listAdmin()}
                  handleAddAdmin={this.handleAddAdmin}
                  handleEditAdmin={this.handleEditAdmin}
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Adminstrator;

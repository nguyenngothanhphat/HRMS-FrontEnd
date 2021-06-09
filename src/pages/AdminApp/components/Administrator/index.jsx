import React, { Component } from 'react';
import { connect } from 'umi';
// import { Row, Col } from 'antd';
import { Skeleton } from 'antd';
import { getCurrentTenant, getCurrentCompany } from '@/utils/authority';
import AdditionalAdministrator from './components/Additional';
import PrimaryAdminstrator from './components/Primary';
import AddAdmin from './components/AddAdmin';

import styles from './index.less';
import EditAdmin from './components/EditAdmin';

@connect(
  ({
    adminApp: { permissionList = [], listAdmin = [] },
    loading,
    user: { currentUser = {} } = {},
  }) => ({
    permissionList,
    listAdmin,
    currentUser,
    loadingFetchPermissionList: loading.effects['adminApp/fetchPermissionList'],
    loadingFetchAdminList: loading.effects['adminApp/getListAdmin'],
  }),
)
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
    const tenantId = getCurrentTenant();
    const companyId = getCurrentCompany();
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
    if (!value) {
      this.fetchListAdmin();
    }
    const { listAdmin = [] } = this.props;
    // const dataAdmin = listAdministrator[index];
    const dataAdmin = listAdmin[index];

    this.setState({
      isEditAdmin: value,
      dataAdmin,
    });
  };

  // dataListAdmin = () => {
  //   const { permissionList = [], listAdmin = [] } = this.props;
  //   return listAdmin.map((ad) => {
  //     const { permissionAdmin = [], usermap: { email = '', firstName = '' } = {} } = ad;
  //     const listModuleName = [];
  //     permissionList.forEach((per) => {
  //       const { _id = '', module = '' } = per;
  //       permissionAdmin.forEach((mol) => {
  //         if (mol === _id)
  //           listModuleName.push({
  //             id: _id,
  //             role: module,
  //           });
  //       });
  //     });

  //     return {
  //       listRole: listModuleName,
  //       employeeName: firstName,
  //       email,
  //       position: `${firstName}’s permission apply to everyone in the company`,
  //     };
  //   });
  // };

  // componentWillUnmount = () => {
  // const { dispatch } = this.props;
  // dispatch({
  //   type: 'employee/save',
  //   payload: {
  //     filterList: {},
  //   },
  // });
  // };

  render() {
    const { isAddAdmin, isEditAdmin, dataAdmin = {} } = this.state;
    const {
      permissionList = [],
      loadingFetchAdminList = false,
      listAdmin = [],
      currentUser = {},
    } = this.props;

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
            {!loadingFetchAdminList && (
              <>
                <div className={styles.root__top}>
                  <PrimaryAdminstrator permissionList={permissionList} primaryAdmin={currentUser} />
                </div>
                <div className={styles.root__bottom}>
                  <AdditionalAdministrator
                    permissionList={permissionList}
                    listAdministrator={listAdmin}
                    handleAddAdmin={this.handleAddAdmin}
                    handleEditAdmin={this.handleEditAdmin}
                  />
                </div>
              </>
            )}
            {loadingFetchAdminList && (
              <div>
                <Skeleton active />
              </div>
            )}
          </>
        )}
      </div>
    );
  }
}

export default Adminstrator;

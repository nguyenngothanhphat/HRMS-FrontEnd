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

@connect(({ adminApp: { permissionList = [] } = {}, loading }) => ({
  permissionList,
  loadingFetchPermissionList: loading.effects['adminApp/fetchPermissionList'],
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

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminApp/fetchPermissionList',
      payload: {
        type: 'ADMIN',
      },
    });
  };

  handleAddAdmin = (value) => {
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

  render() {
    const { isAddAdmin, isEditAdmin, dataAdmin = {} } = this.state;
    const { permissionList = [] } = this.props;

    return (
      <div className={styles.root}>
        {isAddAdmin || isEditAdmin ? (
          <>
            {isEditAdmin ? (
              <EditAdmin dataAdmin={dataAdmin} handleEditAdmin={this.handleEditAdmin} />
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
              <AdditionalAdministrator
                permissionList={permissionList}
                listAdministrator={listAdministrator}
                handleAddAdmin={this.handleAddAdmin}
                handleEditAdmin={this.handleEditAdmin}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Adminstrator;

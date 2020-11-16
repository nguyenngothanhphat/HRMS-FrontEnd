import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'umi';
import styles from './index.less';
import TableEmployees from '../TableEmployees';

@connect(({ user: { currentUser = {} } }) => ({ currentUser }))
class GlobalEmployeeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  handleAfterClose = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'employeesManagement/save',
    //   payload: {
    //     activeEmployeesList: []
    //   }
    // })
  };

  checkRoleEmployee = (roles) => {
    const checkRoleEmployee = roles.findIndex((employee) => employee._id === 'EMPLOYEE');
    if (roles.length === 1 && checkRoleEmployee !== -1) {
      return true;
    }
    return false;
  };

  render() {
    const {
      visible = false,
      employeesList = [],
      loading = false,
      currentUser: { roles = [] },
    } = this.props;
    return (
      <Modal
        className={styles.globalEmployeeSearch}
        visible={visible}
        title={this.renderHeaderModal()}
        onOk={this.handleRemoveToServer}
        onCancel={this.handleCancel}
        destroyOnClose
        maskClosable={false}
        style={{ top: 50 }}
        width="85%"
        afterClose={this.handleAfterClose}
        footer={false}
      >
        <TableEmployees
          list={employeesList}
          loading={loading}
          checkRoleEmployee={this.checkRoleEmployee(roles)}
        />
      </Modal>
    );
  }
}

export default GlobalEmployeeSearch;

import React, { Component } from 'react';
import { connect } from 'umi';

import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

@connect(({ user: { currentUser: { employee: { _id: idCurrentUser = '' } = {} } = {} } = {} }) => ({
  idCurrentUser,
}))
class EmployeeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      employee = {},
      itemSelected = '',
      renderCardInfo = () => {},
      idCurrentUser = '',
      isCollapsed = false,
    } = this.props;
    const { _id: idEmpl = '', employees: listEmployees = [] } = employee;

    const isActive = itemSelected === idEmpl;
    const isCurrentUser = idEmpl === idCurrentUser;
    const listActiveEmployee = listEmployees.filter((item) => item.status === 'ACTIVE');

    const className = isActive ? styles.selectNode : styles.node;
    const className2 = isCurrentUser ? styles.currentUserNode : styles.employeeNode;

    return (
      <div id={idEmpl} className={`${className2} ${styles.node} ${className}`}>
        {renderCardInfo(employee, 'employee')}
        {listActiveEmployee.length > 0 && isCollapsed ? (
          <div className={styles.node__bottom_reportees}>
            {`${listActiveEmployee.length} reportees`}
          </div>
        ) : null}
        {isCurrentUser ? <div className={styles.node__bottom_you1}>You</div> : null}
      </div>
    );
  }
}

export default EmployeeNode;

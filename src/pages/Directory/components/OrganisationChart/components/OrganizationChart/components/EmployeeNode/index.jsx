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

  addToRefs = (el, id) => {
    const { employeeRef, refTemp } = this.props;
    if (el && !refTemp.includes(el)) {
      refTemp.push(el);
      employeeRef.push({
        ref: el,
        id,
      });
    }

    return el;
  };

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

    const className = isActive ? styles.selectNode : styles.node;
    const className2 = isCurrentUser ? styles.currentUserNode : styles.employeeNode;

    return (
      <div
        ref={(el) => this.addToRefs(el, idEmpl)}
        id={idEmpl}
        className={`${className2} ${styles.node} ${className}`}
      >
        {renderCardInfo(employee, 'employee')}
        {listEmployees.length > 0 && isCollapsed ? (
          <div className={styles.node__bottom_reportees}>{`${listEmployees.length} reportees`}</div>
        ) : null}
        {isCurrentUser ? <div className={styles.node__bottom_you1}>You</div> : null}
      </div>
    );
  }
}

export default EmployeeNode;

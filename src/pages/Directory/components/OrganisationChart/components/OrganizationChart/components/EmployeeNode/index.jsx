import React, { Component } from 'react';

import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

class EmployeeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { employee = {}, itemSelected = '', renderCardInfo = () => {} } = this.props;
    const { _id: idEmpl = '' } = employee;

    const isActive = itemSelected === idEmpl;
    const className = isActive ? styles.selectNode : styles.node;
    return (
      <div id={idEmpl} className={`${styles.employeeNode} ${styles.node} ${className}`}>
        {renderCardInfo(employee)}
      </div>
    );
  }
}

export default EmployeeNode;

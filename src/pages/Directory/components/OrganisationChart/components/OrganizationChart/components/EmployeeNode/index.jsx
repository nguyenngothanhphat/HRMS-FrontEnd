import React, { Component } from 'react';

import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

class EmployeeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addToRefs = (el, id) => {
    const { employeeRef } = this.props;
    console.log(employeeRef);
    if (el && !employeeRef.includes(el)) {
      employeeRef.push({
        ref: el,
        id,
      });
    }

    return el;
  };

  render() {
    const { employee = {}, itemSelected = '', renderCardInfo = () => {} } = this.props;
    const { _id: idEmpl = '' } = employee;

    const isActive = itemSelected === idEmpl;
    const className = isActive ? styles.selectNode : styles.node;
    return (
      <div
        ref={(el) => this.addToRefs(el, idEmpl)}
        id={idEmpl}
        className={`${styles.employeeNode} ${styles.node} ${className}`}
      >
        {renderCardInfo(employee, 'employee')}
      </div>
    );
  }
}

export default EmployeeNode;

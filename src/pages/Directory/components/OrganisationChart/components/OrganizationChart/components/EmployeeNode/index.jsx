import React, { Component } from 'react';

import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

class EmployeeNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { listEmployees = [], renderCardInfo = () => {} } = this.props;

    return (
      <div className={styles.childrenList}>
        {listEmployees.length > 0 ? (
          <>
            {listEmployees.map((empl) => {
              const {
                _id: idEmpl = '',
                generalInfo: {
                  avatar: emplAvatar = '',
                  firstName: emplFirstName = '',
                  middleName: emplMiddleName = '',
                  lastName: emplLastName = '',
                } = {} || {},
                department: { name: deptName = '' } = {} || {},
                title: { name: jobTitleName = '' } = {} || {},
                location: {
                  headQuarterAddress: { country: { name: countryName = '' } = {} || {} } = {} || {},
                } = {} || {},
              } = empl;
              const legalName = `${emplFirstName} ${emplMiddleName} ${emplLastName}`;

              return (
                <div id={idEmpl} key={idEmpl} className={`${styles.employeeNode} ${styles.node}`}>
                  {renderCardInfo(emplAvatar, legalName, jobTitleName, deptName, countryName)}
                </div>
              );
            })}
          </>
        ) : null}
      </div>
    );
  }
}

export default EmployeeNode;

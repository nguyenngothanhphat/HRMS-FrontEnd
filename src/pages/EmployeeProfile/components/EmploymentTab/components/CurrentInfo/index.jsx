import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import styles from './styles.less';
import UserProfilePopover from '@/components/UserProfilePopover';

function CurrentInfo(props) {
  const { employeeProfile = {} } = props;
  const {
    title,
    joinDate = '',
    location,
    employeeType = {},
    manager,
    compensation = {},
    department = {},
  } = employeeProfile?.originData?.employmentData || {};
  // const {
  //   // compensationType = '',
  //   currentAnnualCTC = '',
  //   timeOffPolicy = '',
  // } = employeeProfile?.originData?.compensationData || {};

  const managerInfo = {
    ...manager,
    legalName: manager?.generalInfo?.legalName,
    userId: manager?.generalInfo?.userId,
    workEmail: manager?.generalInfo?.workEmail,
    workNumber: manager?.generalInfo?.workNumber,
  };

  const data = {
    title: title?.name || 'Missing title',
    department: department?.name || 'Missing department',
    grade: 'Missing grade',
    initialJoiningDate: 'Missing initial joining date',
    joiningDate: joinDate
      ? moment(joinDate).locale('en').format('Do MMMM YYYY')
      : 'Missing joined date',
    location: location?.name || 'Missing location',
    employType: employeeType?.name || 'Missing employment type',
    compensationType: compensation.compensationType || 'This person is missing payment method',
    // annualSalary: String(currentAnnualCTC || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    manager: manager ? (
      <UserProfilePopover placement="leftBottom" data={managerInfo}>
        <span className={styles.manager}>{manager?.generalInfo?.legalName}</span>
      </UserProfilePopover>
    ) : (
      'Missing reporting manager'
    ),
    // timeOff: timeOffPolicy || 'This person is not allowed to take time off',
  };
  return (
    <div style={{ margin: '24px' }}>
      {[
        'title',
        'department',
        'grade',
        'initialJoiningDate',
        'joiningDate',
        'location',
        'compensationType',
        'employType',
        'manager',
      ].map((item) => {
        let info;
        switch (item) {
          case 'title':
            info = 'Title';
            break;
          case 'department':
            info = 'Department';
            break;
          case 'grade':
            info = 'Grade';
            break;
          case 'joiningDate':
            info = 'Joined Date';
            break;
          case 'initialJoiningDate':
            info = 'Initial Joining Date';
            break;
          case 'location':
            info = 'Location';
            break;
          case 'employType':
            info = 'Employment Type';
            break;
          case 'compensationType':
            info = 'Compensation Type';
            break;
          case 'manager':
            info = 'Manager';
            break;
          case 'timeOff':
            info = 'Time Off Policy';
            break;
          default:
            info = '';
        }
        return (
          <div key={Math.random().toString(36).substring(7)} className={styles.items}>
            <div>{info}</div>
            <div>{item === 'annualSalary' ? `$${data[item]}` : data[item]}</div>
          </div>
        );
      })}
    </div>
  );
}
export default connect(({ employeeProfile }) => ({ employeeProfile }))(CurrentInfo);

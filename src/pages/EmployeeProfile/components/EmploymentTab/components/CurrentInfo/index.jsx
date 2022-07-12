import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import styles from './styles.less';
import UserProfilePopover from '@/components/UserProfilePopover';

const CurrentInfo = (props) => {
  const { employeeProfile = {} } = props;
  const {
    title,
    joinDate = '',
    initialJoinDate = '',
    location,
    employeeType = {},
    empTypeOther = '',
    manager,
    titleInfo = {},
    // compensation = {},
    department = {},
  } = employeeProfile?.originData?.employmentData || {};

  const managerInfo = {
    ...manager,
    legalName: manager?.generalInfo?.legalName,
    userId: manager?.generalInfo?.userId,
    workEmail: manager?.generalInfo?.workEmail,
    workNumber: manager?.generalInfo?.workNumber,
    location: {
      state: manager?.locationInfo?.headQuarterAddress?.state,
      countryName: manager?.locationInfo?.headQuarterAddress?.country?.name,
    },
    department: manager?.departmentInfo,
    title: manager?.titleInfo,
  };

  const getInitialJoiningDate = () => {
    let value = '';
    if (initialJoinDate) value = initialJoinDate;
    else {
      value = joinDate;
    }
    return moment(value).locale('en').format('Do MMMM YYYY');
  };

  const data = {
    title: title?.name || '',
    department: department?.name || '',
    grade: titleInfo?.gradeInfo?.name || '',
    initialJoiningDate: getInitialJoiningDate(),
    joiningDate: joinDate ? moment(joinDate).locale('en').format('Do MMMM YYYY') : '',
    location: location?.name || '',
    employmentType: employeeType?.name || '',
    employeeType: empTypeOther || '', // what is this?
    manager:
      manager && manager?.generalInfo ? (
        <UserProfilePopover placement="rightBottom" data={managerInfo}>
          <span className={styles.manager}>
            {manager?.generalInfo?.legalName} ({manager?.generalInfo?.userId})
          </span>
        </UserProfilePopover>
      ) : (
        ''
      ),
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
        'employeeType',
        'employmentType',
        'manager',
      ].map((item) => {
        let info;
        switch (item) {
          case 'title':
            info = 'Job Title';
            break;
          case 'department':
            info = 'Department';
            break;
          case 'grade':
            info = 'Grade';
            break;
          case 'joiningDate':
            info = 'Joining Date';
            break;
          case 'initialJoiningDate':
            info = 'Initial Joining Date';
            break;
          case 'location':
            info = 'Location';
            break;
          case 'employmentType':
            info = 'Employment Type';
            break;
          case 'employeeType':
            info = 'Employee Type';
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
};
export default connect(({ employeeProfile }) => ({ employeeProfile }))(CurrentInfo);

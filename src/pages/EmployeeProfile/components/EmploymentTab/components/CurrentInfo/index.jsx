import React from 'react';
import moment from 'moment';
import { connect } from 'umi';
import styles from './styles.less';

function CurrentInfo(props) {
  const { employeeProfile = {} } = props;
  const {
    title = {},
    joinDate = '',
    location = {},
    employeeType = {},
    manager = {},
  } = employeeProfile?.originData?.employmentData || {};
  const {
    compensationType = '',
    currentAnnualCTC = '',
    timeOffPolicy = '',
  } = employeeProfile?.originData?.compensationData || {};

  const data = {
    title: title?.name || 'Missing title',
    joiningDate: joinDate
      ? moment(joinDate).locale('en').format('MM.DD.YY')
      : 'Missing joined date',
    location: location?.name || 'Missing location',
    employType: employeeType?.name || 'Missing employment type',
    compenType: compensationType || 'This person is missing payment method',
    annualSalary: String(currentAnnualCTC || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    manager: manager?.generalInfo?.firstName || 'Missing reporting manager',
    timeOff: timeOffPolicy || 'This person is not allowed to take time off',
  };
  return (
    <div style={{ margin: '24px' }}>
      {['title', 'joiningDate', 'location', 'employType', 'compenType', 'manager', 'timeOff'].map(
        (item) => {
          let info;
          switch (item) {
            case 'title':
              info = 'Title';
              break;
            case 'joiningDate':
              info = 'Joined Date';
              break;
            case 'location':
              info = 'Location';
              break;
            case 'employType':
              info = 'Employment Type';
              break;
            case 'compenType':
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
        },
      )}
    </div>
  );
}
export default connect(({ employeeProfile }) => ({ employeeProfile }))(CurrentInfo);

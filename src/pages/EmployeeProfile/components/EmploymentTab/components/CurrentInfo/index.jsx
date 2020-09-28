import React, { useEffect } from 'react';
import moment from 'moment';
import { useParams, connect } from 'umi';
import styles from './styles.less';

function CurrentInfo(props) {
  const { dispatch, employeeProfile } = props;
  const params = useParams();

  const {
    title,
    joinDate,
    location,
    employeeType,
    manager,
  } = employeeProfile.originData.employmentData;
  const {
    compensationType,
    currentAnnualCTC,
    timeOffPolicy,
  } = employeeProfile.originData.compensationData;

  const data = {
    title: title.name,
    joiningDate: moment(joinDate).locale('en').format('Do MMMM YYYY'),
    location: location.name,
    employType: employeeType.name,
    compenType: compensationType || 'This person is missing payment method',
    annualSalary: currentAnnualCTC || 0,
    manager: manager.generalInfo.firstName,
    timeOff: timeOffPolicy || 'This person is not allowed to take time off',
  };
  useEffect(() => {
    dispatch({
      type: 'employeeProfile/fetchEmploymentInfo',
      payload: params.reId,
    });
  }, [data]);

  return (
    <div style={{ margin: '24px' }}>
      {[
        'title',
        'joiningDate',
        'location',
        'employType',
        'compenType',
        'annualSalary',
        'manager',
        'timeOff',
      ].map((item) => {
        let info;
        switch (item) {
          case 'title':
            info = 'Title';
            break;
          case 'joiningDate':
            info = 'Joining Date';
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
          case 'annualSalary':
            info = 'Current Annual CTC';
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

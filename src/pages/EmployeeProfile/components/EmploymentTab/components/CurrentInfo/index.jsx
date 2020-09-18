import React from 'react';
import styles from './styles.less';

export default function CurrentInfo(props) {
  const { data } = props;

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

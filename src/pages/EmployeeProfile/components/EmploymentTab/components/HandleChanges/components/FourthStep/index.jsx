import React from 'react';
import styles from './styles.less';

export default function FourthStep(props) {
  const { onRadioChange } = props;
  return (
    <div>
      <div className={styles.headings}>
        What do you wish to notify about the changes that are made?
      </div>

      <label htmlFor className={styles.container}>
        <input value="Employee" onChange={(e) => onRadioChange(e, 'employee')} type="checkbox" />
        <span className={styles.checkmark} />
        Employee
      </label>
      <label htmlFor className={styles.container}>
        <input
          value="Employee’s Reporting Manager"
          onChange={(e) => onRadioChange(e, 'reportingManager')}
          type="checkbox"
        />
        <span className={styles.checkmark} />
        Employee’s Reporting Manager
      </label>
      <label htmlFor className={styles.container}>
        <input value="HR Team" onChange={(e) => onRadioChange(e, 'hrTeam')} type="checkbox" />
        <span className={styles.checkmark} />
        HR Team
      </label>
    </div>
  );
}

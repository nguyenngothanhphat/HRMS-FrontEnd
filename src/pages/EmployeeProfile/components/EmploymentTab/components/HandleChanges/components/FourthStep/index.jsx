import React from 'react';
import styles from './styles.less';

export default function FourthStep(props) {
  const { onRadioChange, radio } = props;
  return (
    <div>
      <div className={styles.headings}>
        What do you wish to notify about the changes that are made?
      </div>

      <label htmlFor className={styles.container}>
        <input
          value={4}
          checked={radio.toEmployee}
          onChange={(e) => onRadioChange(e)}
          type="checkbox"
        />
        <span className={styles.checkmark} />
        Employee
      </label>
      <label htmlFor className={styles.container}>
        <input
          value={5}
          checked={radio.toManager}
          onChange={(e) => onRadioChange(e)}
          type="checkbox"
        />
        <span className={styles.checkmark} />
        Employee’s Reporting Manager
      </label>
      <label htmlFor className={styles.container}>
        <input value={6} checked={radio.toHR} onChange={(e) => onRadioChange(e)} type="checkbox" />
        <span className={styles.checkmark} />
        HR Team
      </label>
    </div>
  );
}

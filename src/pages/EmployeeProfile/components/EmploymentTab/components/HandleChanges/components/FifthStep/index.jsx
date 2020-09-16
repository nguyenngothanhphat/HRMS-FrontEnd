import React from 'react';
import styles from './styles.less';

export default function FifthStep(props) {
  const { name, data, currentData } = props;
  return (
    <div>
      <div className={styles.headings}>Review</div>
      <div className={styles.item}>
        <div>{name} is promoted to :</div>
        <div>
          <div>{data.newTitle || currentData.title}</div>
        </div>
      </div>
      <div className={styles.item}>
        <div>Revised Salary :</div>
        <div>
          <div>${data.newSalary || currentData.salary}</div>
        </div>
      </div>
      <div className={styles.item}>
        <div>Location :</div>
        <div>
          <div>{data.newLocation || currentData.location}</div>
        </div>
      </div>
    </div>
  );
}

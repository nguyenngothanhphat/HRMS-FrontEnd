import React, { PureComponent } from 'react';
import { Link } from 'umi';
import styles from './index.less';

const array = [
  {
    info: 'Aditya has handled over 120 designers across 200 projects.',
  },
  {
    info: ' Aditya has won Terralogic over 50 accounts',
  },
  {
    info: ' Accounts Aditya handled brought over 25 cr revenue for the company',
  },
  {
    info:
      'Aditya handled 6 of the biggest accounts for Terralogic namely: Bajaj DRx, NJ Group, Hukoomi, Udaan & Intel',
  },
];

export default class InfoEmployee extends PureComponent {
  render() {
    return (
      <div className={styles.rightContent}>
        <div className={styles.header}>
          <span className={styles.textTitle}>Aditya’s Career highlights within Terralogic</span>
        </div>
        <div className={styles.straightLine} />
        <div className={styles.bodyContent}>
          {array.map(({ info }) => (
            <div className={styles.textData}>{info}</div>
          ))}
          <Link style={{ textDecoration: 'underline' }}>View Aditya’s Career graph</Link>
        </div>
      </div>
    );
  }
}

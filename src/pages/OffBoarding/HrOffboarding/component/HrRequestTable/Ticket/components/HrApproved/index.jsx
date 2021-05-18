import { Button } from 'antd';
import React, { PureComponent } from 'react';
import LastWorkingDate from '../LastWorkingDate';
import styles from './index.less';

export default class HrApproved extends PureComponent {
  render() {
    return (
      <div className={styles.hrApproved}>
        <div>Last working day (HR Approved)</div>
        <div>
          <div className={styles.hrApproved__tileDate}>Last working date</div>
          <LastWorkingDate />
        </div>
        <div className={styles.hrApproved__footer}>
          <div className={styles.hrApproved__footer__text}>
            By default notifications will be sent to the request, his reporting manager and
            recursively loop to your department head.
          </div>
          <div style={{ display: 'flex' }}>
            <Button className={styles.btnCancel}>Cancel</Button>
            <Button className={styles.btnSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    );
  }
}

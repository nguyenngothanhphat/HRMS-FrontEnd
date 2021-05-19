import { Button } from 'antd';
import React, { PureComponent } from 'react';
import LastWorkingDate from '../LastWorkingDate';
import styles from './index.less';

export default class HrApproved extends PureComponent {
  render() {
    const { myRequest = {} } = this.props;
    return (
      <div className={styles.hrApproved}>
        <div>Last working day (HR Approved)</div>
        <div>
          <div className={styles.hrApproved__titleDate}>Last working date</div>
          <LastWorkingDate myRequest={myRequest} />
        </div>
        <div className={styles.hrApproved__footer}>
          <div className={styles.hrApproved__footer__text}>
            By default notifications will be sent to the request, his reporting manager and
            recursively loop to your department head.
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="link" className={styles.btnCancel}>
              Cancel
            </Button>
            <Button type="primary" className={styles.btnSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

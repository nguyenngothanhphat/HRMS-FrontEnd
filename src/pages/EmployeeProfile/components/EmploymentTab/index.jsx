import React, { PureComponent } from 'react';
import { Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import styles from './index.less';

class EmploymentTab extends PureComponent {
  render() {
    return (
      <div className={styles.employmentTab}>
        <Row className={styles.employmentTab_title} justify="space-between" align="middle">
          <span>Employment & Compensation</span>
          <span span={4}>
            <u>Make changes</u>
          </span>
        </Row>
        <Row className={styles.employmentTab_title} align="middle">
          <span>Change History</span>
          <EditOutlined className={styles.employmentTab_changeIcon} />
        </Row>
      </div>
    );
  }
}

export default EmploymentTab;

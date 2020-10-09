import React, { PureComponent } from 'react';
import { Table } from 'antd';
// import { Link, formatMessage } from 'umi';

import styles from './index.less';

class CustomEmailsTableField extends PureComponent {
  render() {
    const data = [
      {
        emailSubject: 'Onboarding email',
        createdOn: '24th August, 2020',
        triggerEvent: 'Person starts work',
        frequency: 'Once',
        action: 'name',
      },
      {
        emailSubject: 'Onboarding email',
        createdOn: '24th August, 2020',
        triggerEvent: 'Person starts work',
        frequency: 'Once',
        action: 'name',
      },
    ];
    const columns = [
      {
        title: 'Email subject',
        dataIndex: 'emailSubject',
        key: 'emailSubject',
      },
      {
        title: 'Created on',
        dataIndex: 'createdOn',
        key: 'createdOn',
      },
      {
        title: 'Trigger event',
        dataIndex: 'triggerEvent',
        key: 'triggerEvent',
      },
      {
        title: 'Frequency',
        dataIndex: 'frequency',
        key: 'frequency',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
      },
    ];
    return (
      <div className={styles.CustomEmailsTableField}>
        <div className={styles.CustomEmailsTableField_title}>Custom emails created</div>
        <div className={styles.CustomEmailsTableField_table}>
          <Table dataSource={data} columns={columns} size="middle" pagination={false} />
        </div>
      </div>
    );
  }
}

export default CustomEmailsTableField;

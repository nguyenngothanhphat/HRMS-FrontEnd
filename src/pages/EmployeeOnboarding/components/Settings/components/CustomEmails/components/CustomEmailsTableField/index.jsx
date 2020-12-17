/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, connect } from 'umi';
import trashIcon from './assets/trashIcon.svg';

import styles from './index.less';

@connect(({ employeeSetting: { dataSubmit = {} } = {}, loading }) => ({
  dataSubmit,
  loading: loading.effects['employeeSetting/addCustomEmail'],
}))
class CustomEmailsTableField extends PureComponent {
  _renderData = () => {
    const { dataSubmit } = this.props;
    const {
      subject = 'Onboarding email',
      createdAt = '24th August, 2020',
      triggerEvent: { name: triggerEventName = 'Person starts work' } = {},
    } = dataSubmit;

    const newData = [
      {
        emailSubject: subject,
        createdOn: createdAt,
        triggerEvent: triggerEventName,
        frequency: 'None',
        action: 'name',
      },
      {
        emailSubject: subject,
        createdOn: createdAt,
        triggerEvent: triggerEventName,
        frequency: 'None',
        action: 'name',
      },
    ];

    // const data = [
    //   {
    //     emailSubject: 'Onboarding email',
    //     createdOn: '24th August, 2020',
    //     triggerEvent: 'Person starts work',
    //     frequency: 'Once',
    //     action: 'name',
    //   },
    //   {
    //     emailSubject: 'Onboarding email',
    //     createdOn: '24th August, 2020',
    //     triggerEvent: 'Person starts work',
    //     frequency: 'Once',
    //     action: 'name',
    //   },
    // ];
    return newData;
  };

  _renderColumns = () => {
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
        render: () => (
          <a href="#">{formatMessage({ id: 'component.customEmailsTableField.viewEmail' })}</a>
        ),
      },
      {
        title: '',
        dataIndex: 'delete',
        key: 'delete',
        render: () => <img src={trashIcon} alt="trash" />,
      },
    ];
    return columns;
  };

  render() {
    return (
      <div className={styles.CustomEmailsTableField}>
        <div className={styles.CustomEmailsTableField_title}>
          {formatMessage({ id: 'component.customEmailsTableField.titleTable' })}
        </div>
        <div className={styles.CustomEmailsTableField_table}>
          <Table
            dataSource={this._renderData()}
            columns={this._renderColumns()}
            size="middle"
            pagination={false}
          />
        </div>
      </div>
    );
  }
}

export default CustomEmailsTableField;

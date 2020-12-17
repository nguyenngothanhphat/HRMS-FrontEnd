/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, connect } from 'umi';
import trashIcon from './assets/trashIcon.svg';

import styles from './index.less';

@connect(({ employeeSetting: { dataSubmit = {}, listCustomEmail = [] } = {}, loading }) => ({
  dataSubmit,
  listCustomEmail,
  loading: loading.effects['employeeSetting/addCustomEmail'],
}))
class CustomEmailsTableField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
    };
  }

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeSetting/fecthListCustomEmail',
      payload: {},
    });
  };

  _renderData = () => {
    const { listCustomEmail } = this.props;
    const cloneListEmail = [...listCustomEmail];
    const newListCustomEmail = [];

    cloneListEmail.forEach((item) => {
      newListCustomEmail.push({
        emailSubject: item.subject !== undefined ? item.subject : '',
        createdOn: item.createdAt !== undefined ? item.createdAt : '',
        triggerEvent: item.triggerEvent.name !== undefined ? item.triggerEvent.name : '',
        frequency: 'None',
        action: 'name',
      });
    });

    return newListCustomEmail;
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
    const { listCustomEmail } = this.props;
    const { pageSelected } = this.state;
    const rowSize = 5;

    // const scroll = {
    //   x: '100vw',
    //   y: 'max-content',
    // };

    const pagination = {
      position: ['bottomRight'],
      total: listCustomEmail.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.customEmailsTableField.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.customEmailsTableField.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };
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
            onRow={(record) => {
              return {
                onClick: () => this.handleProfileEmployee(record), // click row
              };
            }}
            rowKey={(record) => record._id}
            pagination={
              listCustomEmail.length > rowSize
                ? { ...pagination, total: listCustomEmail.length }
                : false
            }
            // scroll={scroll}
          />
        </div>
      </div>
    );
  }
}

export default CustomEmailsTableField;

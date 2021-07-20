/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Spin, Tooltip, Tabs } from 'antd';
import { formatMessage, connect, Link, history } from 'umi';
import moment from 'moment';
import CustomEmailImage from '@/assets/customEmail.svg';
import FileIcon from './images/doc.svg';
import DeleteIcon from './images/delete.svg';

import styles from './index.less';

@connect(
  ({ employeeSetting: { dataSubmit = {}, listCustomEmailOffboarding = [] } = {}, loading }) => ({
    dataSubmit,
    listCustomEmailOffboarding,
    loading: loading.effects['employeeSetting/deleteCustomEmailItem'],
    loadingFetchList: loading.effects['employeeSetting/fetchListCustomEmailOffboarding'],
  }),
)
class CustomEmailsTableField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      currentRecord: {},
      activeKey: '1',
    };
  }

  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  handleClickCustomEmail = (row) => {
    this.setState({
      currentRecord: row,
    });
  };

  fetchData = async (tabId) => {
    const { dispatch } = this.props;
    this.setState({
      activeKey: tabId,
    });

    await dispatch({
      type: 'employeeSetting/fetchListCustomEmailOffboarding',
      payload: {
        type: 'OFF-BOARDING',
        isDefault: tabId === '1',
      },
    });
  };

  componentDidMount = () => {
    this.fetchData('1');
  };

  _renderData = (list) => {
    const cloneListEmail = [...list];
    const newList = [];

    cloneListEmail.reverse().forEach((item) => {
      const formatDate = `${moment(item.createdAt).locale('en').format('MM.DD.YY')}`;

      newList.push({
        idCustomEmail: item._id,
        emailSubject: item.subject !== undefined ? item.subject : 'Onboarding email',
        createdOn: formatDate !== undefined ? formatDate : '08.24.20',
        triggerEvent:
          item.triggerEvent.name !== undefined ? item.triggerEvent.name : 'Person starts work',
        frequency: 'None',
        action: 'name',
      });
    });

    return newList;
  };

  refreshPage = () => {
    history.go(0);
  };

  handleActionDelete = (customEmailId) => {
    const { dispatch } = this.props;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'employeeSetting/deleteCustomEmailItem',
      payload: {
        id: customEmailId,
      },
    });
  };

  _renderColumns = () => {
    const { activeKey } = this.state;
    const columns = [
      {
        title: formatMessage({ id: 'component.customEmailsTableField.emailSubject' }),
        dataIndex: 'emailSubject',
        key: 'emailSubject',
        width: '30%',
        render: (emailSubject) => {
          const { currentRecord = {} } = this.state;
          const { idCustomEmail = '' } = currentRecord;

          return (
            <Link to={`/offboarding/edit-email/${idCustomEmail}`}>
              <div className={styles.fileName}>
                <img src={FileIcon} alt="name" />
                <span>{emailSubject}</span>
              </div>
            </Link>
          );
        },
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.createdOn' }),
        dataIndex: 'createdOn',
        key: 'createdOn',
        width: '20%',
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.triggerEvent' }),
        // title: 'Trigger event',
        dataIndex: 'triggerEvent',
        key: 'triggerEvent',
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.frequency' }),
        width: '15%',
        dataIndex: 'frequency',
        key: 'frequency',
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.actions' }),
        dataIndex: 'actions',
        key: 'actions',
        width: '15%',
        render: () => {
          const { currentRecord = {} } = this.state;
          const { idCustomEmail = '' } = currentRecord;

          return (
            <div className={styles.actions}>
              <Link to={`/offboarding/edit-email/${idCustomEmail}`}>View mail</Link>
              {activeKey !== '1' && (
                <Tooltip title="Delete">
                  <img
                    src={DeleteIcon}
                    alt="delete"
                    onClick={() => this.handleActionDelete(idCustomEmail)}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ];
    return columns;
  };

  addNewEmailTemplate = () => {
    history.push('/offboarding/settings/custom-emails/create-custom-email');
  };

  _renderTable = (list) => {
    const { loadingFetchList } = this.props;
    const { pageSelected } = this.state;
    const rowSize = 5;

    const pagination = {
      position: ['bottomRight'],
      total: list.length,
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
      <Table
        dataSource={this._renderData(list)}
        columns={this._renderColumns()}
        size="middle"
        loading={loadingFetchList}
        onRow={(record) => {
          return {
            onMouseEnter: () => this.handleClickCustomEmail(record), // click row
          };
        }}
        rowKey={(record) => record._id}
        pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
      />
    );
  };

  render() {
    const { listCustomEmailOffboarding } = this.props;
    const { activeKey } = this.state;

    return (
      <div className={styles.CustomEmailsTableField}>
        <Tabs onTabClick={this.fetchData} activeKey={activeKey}>
          <Tabs.TabPane tab="System Default Emails" key="1">
            <div className={styles.CustomEmailsTableField_table}>
              {this._renderTable(listCustomEmailOffboarding)}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Custom Emails" key="2">
            <div className={styles.CustomEmailsTableField_table}>
              {this._renderTable(listCustomEmailOffboarding)}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default CustomEmailsTableField;

/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Spin, Tooltip, Skeleton, Tabs } from 'antd';
import { formatMessage, connect, Link, history } from 'umi';
import moment from 'moment';
import CustomEmailImage from '@/assets/customEmail.svg';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import FileIcon from './images/doc.svg';
import DeleteIcon from './images/delete.svg';

import styles from './index.less';

@connect(
  ({
    employeeSetting: {
      dataSubmit = {},
      listCustomEmailOnboarding = [],
      listDefaultCustomEmailOnboarding = [],
    } = {},
    loading,
  }) => ({
    dataSubmit,
    listCustomEmailOnboarding,
    listDefaultCustomEmailOnboarding,
    loading: loading.effects['employeeSetting/deleteCustomEmailItem'],
    loadingFetchList: loading.effects['employeeSetting/fetchListCustomEmailOnboarding'],
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
    console.log('tabId', tabId);
    const { dispatch } = this.props;
    this.setState({
      activeKey: tabId,
    });

    await dispatch({
      type: 'employeeSetting/fetchListCustomEmailOnboarding',
      payload: {
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
        type: 'ON-BOARDING',
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
        tenantId: getCurrentTenant(),
      },
    });
  };

  _renderColumns = () => {
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
            <Link to={`/employee-onboarding/edit-email/${idCustomEmail}`}>
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
              <Link to={`/employee-onboarding/edit-email/${idCustomEmail}`}>View mail</Link>
              <Tooltip title="Delete">
                <img
                  src={DeleteIcon}
                  alt="delete"
                  onClick={() => this.handleActionDelete(idCustomEmail)}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  addNewEmailTemplate = () => {
    history.push('/employee-onboarding/create-email-reminder');
  };

  render() {
    const {
      listCustomEmailOnboarding,
      listDefaultCustomEmailOnboarding,
      loadingFetchList,
    } = this.props;
    const { pageSelected, activeKey } = this.state;
    const rowSize = 5;

    // const scroll = {
    //   x: '100vw',
    //   y: 'max-content',
    // };

    const pagination = {
      position: ['bottomRight'],
      total:
        activeKey === '1'
          ? listDefaultCustomEmailOnboarding.length
          : listCustomEmailOnboarding.length,
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
        {/* {listDefaultCustomEmailOnboarding.length === 0 ? (
                <>
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyImage}>
                      <img src={CustomEmailImage} alt="custom-email" />
                    </div>
                    <div className={styles.texts}>
                      <span className={styles.bigText}>Custom emails</span>
                      <span className={styles.smallText}>
                        Custom emails created by you will be shown here
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <> */}
        <Tabs onTabClick={this.fetchData} activeKey={activeKey}>
          <Tabs.TabPane tab="System Default Emails" key="1">
            <div className={styles.CustomEmailsTableField_table}>
              <Table
                dataSource={this._renderData(listDefaultCustomEmailOnboarding)}
                columns={this._renderColumns()}
                size="middle"
                loading={loadingFetchList}
                onRow={(record) => {
                  return {
                    onMouseEnter: () => this.handleClickCustomEmail(record), // click row
                  };
                }}
                rowKey={(record) => record._id}
                pagination={
                  listDefaultCustomEmailOnboarding.length > rowSize
                    ? { ...pagination, total: listDefaultCustomEmailOnboarding.length }
                    : false
                }
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Custom Emails" key="2">
            <div className={styles.CustomEmailsTableField_table}>
              <Table
                dataSource={this._renderData(listCustomEmailOnboarding)}
                columns={this._renderColumns()}
                size="middle"
                loading={loadingFetchList}
                onRow={(record) => {
                  return {
                    onMouseEnter: () => this.handleClickCustomEmail(record), // click row
                  };
                }}
                rowKey={(record) => record._id}
                pagination={
                  listCustomEmailOnboarding.length > rowSize
                    ? { ...pagination, total: listCustomEmailOnboarding.length }
                    : false
                }
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
        {/* </>
              )} */}
      </div>
    );
  }
}

export default CustomEmailsTableField;

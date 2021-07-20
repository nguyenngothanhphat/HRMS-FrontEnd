/* eslint-disable no-console */
// import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Table, Tabs, Tooltip } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history, Link } from 'umi';
import DeleteIcon from './images/delete.svg';
import FileIcon from './images/doc.svg';
import styles from './index.less';

@connect(
  ({ employeeSetting: { dataSubmit = {}, listCustomEmailOnboarding = [] } = {}, loading }) => ({
    dataSubmit,
    listCustomEmailOnboarding,
    loading: loading.effects['employeeSetting/deleteCustomEmailItem'],
    loadingFetchList: loading.effects['employeeSetting/fetchListCustomEmailOnboarding'],
  }),
)
class CustomEmailsTableField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      size: 10,
      currentRecord: {},
      activeKey: '1',
    };
  }

  onChangePagination = (pageNumber, pageSize) => {
    this.setState({
      pageSelected: pageNumber,
      size: pageSize,
    });
  };

  handleClickCustomEmail = (row) => {
    this.setState({
      currentRecord: row,
    });
  };

  fetchData = async (tabId) => {
    const { dispatch } = this.props;
    const { pageSelected, size } = this.state;
    this.setState({
      activeKey: tabId,
    });

    await dispatch({
      type: 'employeeSetting/fetchListCustomEmailOnboarding',
      payload: {
        type: 'ON-BOARDING',
        isDefault: tabId === '1',
        page: pageSelected,
        limit: size,
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
    const { pageSelected, size } = this.state;
    if (!dispatch) {
      return;
    }
    dispatch({
      type: 'employeeSetting/deleteCustomEmailItem',
      payload: {
        id: customEmailId,
        page: pageSelected,
        limit: size,
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
            <Link to={`/employee-onboarding/settings/edit-email/${idCustomEmail}`}>
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
        dataIndex: 'idCustomEmail',
        key: 'idCustomEmail',
        width: '15%',
        render: (idCustomEmail) => {
          return (
            <div className={styles.actions}>
              <Link to={`/employee-onboarding/settings/edit-email/${idCustomEmail}`}>
                View mail
              </Link>
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
    history.push('/employee-onboarding/settings/create-email-reminder');
  };

  _renderTable = (list) => {
    const { loadingFetchList } = this.props;
    const { pageSelected, size } = this.state;
    // const rowSize = 5;

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
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => this.onChangePagination(page, pageSize),
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
        pagination={pagination}
      />
    );
  };

  render() {
    const { listCustomEmailOnboarding } = this.props;
    const { activeKey } = this.state;

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
              {this._renderTable(listCustomEmailOnboarding)}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Custom Emails" key="2">
            <div className={styles.CustomEmailsTableField_table}>
              {this._renderTable(listCustomEmailOnboarding)}
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

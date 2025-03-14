/* eslint-disable no-console */
// import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Tabs, Tooltip } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history, Link } from 'umi';
import CommonTable from '@/components/CommonTable';
import DeleteIcon from './images/delete.svg';
import FileIcon from './images/doc.svg';
import styles from './index.less';

@connect(
  ({
    employeeSetting: {
      activeTabCustomEmail = '',
      dataSubmit = {},
      listCustomEmailOnboarding = [],
    } = {},
    loading,
  }) => ({
    dataSubmit,
    listCustomEmailOnboarding,
    loading: loading.effects['employeeSetting/deleteCustomEmailItem'],
    loadingFetchList: loading.effects['employeeSetting/fetchListCustomEmailOnboarding'],
    activeTabCustomEmail,
  }),
)
class CustomEmailsTableField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      size: 10,
      currentRecord: {},
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
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        activeTabCustomEmail: tabId,
      },
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
    const { activeTabCustomEmail = '1' } = this.props;
    this.fetchData(activeTabCustomEmail);
  };

  _renderData = (list) => {
    const cloneListEmail = [...list];
    const newList = [];

    cloneListEmail.reverse().forEach((item) => {
      const formatDate = `${moment(item.createdAt).locale('en').format('MM.DD.YY')}`;

      newList.push({
        idCustomEmail: item._id,
        isDefault: item.isDefault,
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
    const { activeTabCustomEmail } = this.props;
    const columns = [
      {
        title: formatMessage({ id: 'component.customEmailsTableField.emailSubject' }),
        dataIndex: 'emailSubject',
        key: 'emailSubject',
        width: '30%',
        render: (emailSubject) => {
          const { currentRecord = {} } = this.state;
          const { idCustomEmail = '', isDefault = false } = currentRecord;

          const link = isDefault
            ? `/onboarding/settings/view-email/${idCustomEmail}`
            : `/onboarding/settings/edit-email/${idCustomEmail}`;

          return (
            <Link to={link}>
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
          const { currentRecord = {} } = this.state;
          const { isDefault = false } = currentRecord;
          const link = isDefault
            ? `/onboarding/settings/view-email/${idCustomEmail}`
            : `/onboarding/settings/edit-email/${idCustomEmail}`;
          return (
            <div className={styles.actions}>
              <Link to={link}>View mail</Link>
              {activeTabCustomEmail !== '1' && (
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
    history.push('/onboarding/settings/custom-emails/create-email-reminder');
  };

  _renderTable = (list) => {
    const { loadingFetchList } = this.props;
    const { pageSelected, size } = this.state;

    return (
      <CommonTable
        list={this._renderData(list)}
        columns={this._renderColumns()}
        loading={loadingFetchList}
        onRow={(record) => {
          return {
            onMouseEnter: () => this.handleClickCustomEmail(record), // click row
          };
        }}
        rowKey="_id"
        isBackendPaging
        onChangePage={this.onChangePagination}
        page={pageSelected}
        limit={size}
      />
    );
  };

  render() {
    const { listCustomEmailOnboarding, activeTabCustomEmail } = this.props;

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
        <Tabs onTabClick={this.fetchData} activeKey={activeTabCustomEmail}>
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

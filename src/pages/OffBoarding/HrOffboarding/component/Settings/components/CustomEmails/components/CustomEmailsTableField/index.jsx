/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Spin, Tooltip } from 'antd';
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
  }),
)
class CustomEmailsTableField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      currentRecord: {},
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

  componentDidMount = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'employeeSetting/fetchListCustomEmailOffboarding',
      payload: {},
    });
  };

  _renderData = () => {
    const { listCustomEmailOffboarding } = this.props;
    const cloneListEmail = [...listCustomEmailOffboarding];
    const newlistCustomEmailOffboarding = [];

    cloneListEmail.reverse().forEach((item) => {
      const formatDate = `${moment(item.createdAt).locale('en').format('MM.DD.YY')}`;

      newlistCustomEmailOffboarding.push({
        idCustomEmail: item._id,
        emailSubject: item.subject !== undefined ? item.subject : 'Onboarding email',
        createdOn: formatDate !== undefined ? formatDate : '08.24.20',
        triggerEvent:
          item.triggerEvent.name !== undefined ? item.triggerEvent.name : 'Person starts work',
        frequency: 'None',
        action: 'name',
      });
    });

    return newlistCustomEmailOffboarding;
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
      payload: customEmailId,
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
    history.push('/offboarding/create-custom-email');
  };

  render() {
    const { listCustomEmailOffboarding, loading } = this.props;
    const { pageSelected } = this.state;
    const rowSize = 5;

    // const scroll = {
    //   x: '100vw',
    //   y: 'max-content',
    // };

    const pagination = {
      position: ['bottomRight'],
      total: listCustomEmailOffboarding.length,
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
        {loading ? (
          <div className={styles.CustomEmailsTableField_loading}>
            <Spin size="large" />
          </div>
        ) : (
          <div>
            {listCustomEmailOffboarding.length === 0 ? (
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
              <>
                <div className={styles.CustomEmailsTableField_title}>
                  <span className={styles.title}>
                    {formatMessage({ id: 'component.customEmailsTableField.titleTable' })}
                  </span>
                </div>
                <div className={styles.CustomEmailsTableField_table}>
                  <Table
                    dataSource={this._renderData()}
                    columns={this._renderColumns()}
                    size="middle"
                    onRow={(record) => {
                      return {
                        onMouseEnter: () => this.handleClickCustomEmail(record), // click row
                      };
                    }}
                    rowKey={(record) => record._id}
                    pagination={
                      listCustomEmailOffboarding.length > rowSize
                        ? { ...pagination, total: listCustomEmailOffboarding.length }
                        : false
                    }
                    scroll={{ y: 300 }}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default CustomEmailsTableField;

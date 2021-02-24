/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { Table, Spin } from 'antd';
import { formatMessage, connect, Link, history } from 'umi';
import moment from 'moment';
import AddIcon from '@/assets/add-symbols.svg';
import trashIcon from './assets/trashIcon.svg';

import styles from './index.less';

@connect(
  ({ employeeSetting: { dataSubmit = {}, listCustomEmailOnboarding = [] } = {}, loading }) => ({
    dataSubmit,
    listCustomEmailOnboarding,
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
      type: 'employeeSetting/fetchListCustomEmailOnboarding',
      payload: {},
    });
  };

  _renderData = () => {
    const { listCustomEmailOnboarding } = this.props;
    const cloneListEmail = [...listCustomEmailOnboarding];
    const newlistCustomEmailOnboarding = [];

    cloneListEmail.reverse().forEach((item) => {
      const formatDate = `${moment(item.createdAt).locale('en').format('Do MMMM, YYYY')}`;

      newlistCustomEmailOnboarding.push({
        idCustomEmail: item._id,
        emailSubject: item.subject !== undefined ? item.subject : 'Onboarding email',
        createdOn: formatDate !== undefined ? formatDate : '24th August, 2020',
        triggerEvent:
          item.triggerEvent.name !== undefined ? item.triggerEvent.name : 'Person starts work',
        frequency: 'None',
        action: 'name',
      });
    });

    return newlistCustomEmailOnboarding;
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
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.createdOn' }),
        dataIndex: 'createdOn',
        key: 'createdOn',
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.triggerEvent' }),
        // title: 'Trigger event',
        dataIndex: 'triggerEvent',
        key: 'triggerEvent',
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.frequency' }),
        dataIndex: 'frequency',
        key: 'frequency',
      },
      {
        title: formatMessage({ id: 'component.customEmailsTableField.actions' }),
        dataIndex: 'actions',
        key: 'actions',
        render: () => {
          const { currentRecord = {} } = this.state;
          const { idCustomEmail = '' } = currentRecord;

          return (
            <Link to={`/employee-onboarding/edit-email/${idCustomEmail}`}>
              {formatMessage({ id: 'component.customEmailsTableField.editEmail' })}
            </Link>
          );
        },
      },
      // {
      //   title: '',
      //   dataIndex: 'delete',
      //   key: 'delete',
      //   render: () => {
      //     const { currentRecord = {} } = this.state;
      //     const { idCustomEmail = '' } = currentRecord;
      //     const { loading } = this.props;

      //     return (
      //       <img
      //         src={trashIcon}
      //         alt="trash"
      //         className={styles.trashIcon}
      //         onClick={() => this.handleActionDelete(idCustomEmail)}
      //         loading={loading}
      //       />
      //     );
      //   },
      // },
    ];
    return columns;
  };

  addNewEmailTemplate = () => {
    history.push('/employee-onboarding/create-email-reminder');
  };

  render() {
    const { listCustomEmailOnboarding, loading } = this.props;
    const { pageSelected } = this.state;
    const rowSize = 5;

    // const scroll = {
    //   x: '100vw',
    //   y: 'max-content',
    // };

    const pagination = {
      position: ['bottomRight'],
      total: listCustomEmailOnboarding.length,
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
            <div className={styles.CustomEmailsTableField_title}>
              <span className={styles.title}>
                {formatMessage({ id: 'component.customEmailsTableField.titleTable' })}
              </span>
              <div className={styles.addButton} onClick={this.addNewEmailTemplate}>
                <img src={AddIcon} alt="add" />
                <span>Add new email template</span>
              </div>
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
                  listCustomEmailOnboarding.length > rowSize
                    ? { ...pagination, total: listCustomEmailOnboarding.length }
                    : false
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CustomEmailsTableField;

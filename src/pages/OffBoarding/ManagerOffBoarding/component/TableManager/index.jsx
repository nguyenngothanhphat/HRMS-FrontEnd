/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Avatar } from 'antd';
import moment from 'moment';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';

class TableManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: '1',
    };
  }

  push = (id) => {
    history.push(`/offboarding/review/${id}`);
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    const { data = [], textEmpty = 'No resignation request is submitted', loading } = this.props;
    const { pageNavigation } = this.state;
    const rowSize = 10;

    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      pageSize: rowSize,
      current: pageNavigation,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <span className={styles.title__value}>{ticketID}</span>;
        },
        fixed: 'left',
        width: 200,
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <span>{employee.employeeId}</span>;
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'requestDate',
        render: (requestDate) => {
          return <span>{moment(requestDate).format('YYYY/MM/DD')}</span>;
        },
        width: 200,
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'employee',
        render: (employee) => {
          const { generalInfo: { firstName = '' } = {} } = employee;
          return (
            <span className={`${styles.title__value} ${styles.title__requteeName}`}>
              {firstName}
            </span>
          );
        },
        width: 200,
      },
      // {
      //   title: <span className={styles.title}>Current Project </span>,
      //   dataIndex: 'currentProject',
      //   width: 200,
      // },
      // {
      //   title: <span className={styles.title}>Project Manager </span>,
      //   dataIndex: 'projectManager',
      //   width: 200,
      // },
      {
        title: <span className={styles.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: (_, row) => {
          const { hrManager: { generalInfo: { avatar: avtHrManager = '' } = {} } = {} } =
            this.props;
          const { manager: { generalInfo: { avatar: avtManager = '' } = {} } = {} } = row;
          const arrAvt = [avtManager, avtHrManager];
          return (
            <div className={styles.rowAction}>
              {arrAvt.map(
                (item, index) =>
                  item && (
                    <div key={index} style={{ marginRight: '13px', display: 'inline-block' }}>
                      <Avatar src={item} size={20} icon={<UserOutlined />} />
                    </div>
                  ),
              )}
            </div>
          );
        },
      },
      {
        title: <span className={styles.title}>Action</span>,
        dataIndex: '_id',
        render: (_id) => (
          <div className={styles.rowAction}>
            <span onClick={() => this.push(_id)}>View Request</span>
          </div>
        ),
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div className={styles.tableStyles}>
        <Table
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          rowSelection={{
            ...rowSelection,
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={{ ...pagination, total: data.length }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableManager;

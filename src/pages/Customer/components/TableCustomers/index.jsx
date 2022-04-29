import { Table } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage, history } from 'umi';
import UserProfilePopover from '../UserProfilePopover';
import styles from './index.less';

class TableCustomers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      visible: false,
      pageSize: 10,
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setFirstPage();
    }
  }

  handleProfile = (account) => {
    history.push(`/customer-management/customers/customer-profile/${account}`);
  };

  generateColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'page.customermanagement.customerID' }),
        dataIndex: 'customerId',
        align: 'center',
        fixed: 'left',
        width: '10%',
        render: (customerId) => {
          return (
            <div
              style={{ fontWeight: '700', color: '#2C6DF9' }}
              onClick={() => this.handleProfile(customerId)}
            >
              {customerId}
            </div>
          );
        },
      },
      {
        title: formatMessage({ id: 'page.customermanagement.companyAlias' }),
        dataIndex: 'dba',
        align: 'center',
        width: '10%',
        render: (dba) => <span className={styles.blueText}>{dba}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.openLeads' }),
        dataIndex: 'openLeads',
        width: '10%',
        align: 'center',
        render: (openLeads) => <span className={styles.blueText}>{openLeads}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTickets' }),
        dataIndex: 'pendingTickets',
        width: '10%',
        align: 'center',
        render: (pendingTickets) => <span className={styles.blueText}>{pendingTickets}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTasks' }),
        dataIndex: 'pendingTasks',
        width: '10%',
        align: 'center',
        render: (pendingTasks) => <span className={styles.blueText}>{pendingTasks}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.activeProjects' }),
        dataIndex: 'activeProjects',
        width: '10%',
        align: 'center',
        render: (activeProjects) => <span className={styles.blueText}>{activeProjects}</span>,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.status' }),
        dataIndex: 'status',
        align: 'center',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'page.customermanagement.accountOwner' }),
        dataIndex: 'accountOwner',
        align: 'center',
        key: 'legalName',
        width: '10%',
        render: (accountOwner = {}) => {
          return (
            <UserProfilePopover data={accountOwner || {}} placement="leftTop">
              <span className={styles.blueText}>
                {accountOwner?.generalInfo?.legalName ? accountOwner?.generalInfo?.legalName : ''}
              </span>
            </UserProfilePopover>
          );
        },
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  deleteEmployee = (record, e) => {
    e.stopPropagation();
  };

  // pagination
  onChangePagination = (pageNumber, pageSize) => {
    this.setState({
      pageSelected: pageNumber,
      pageSize,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  // onSortChange = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  //   push to customer profile
  handleProfileCustomer = (_id) => {
    // history.push(`/employees/employee-profile/${_id}`);
  };

  render() {
    const { listCustomer, loadingCustomer } = this.props;
    const { pageSelected, selectedRowKeys, visible, pageSize } = this.state;
    const scroll = {
      x: 'max-content',
      y: 'max-content',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: listCustomer.length,
      showTotal: (total, range) => (
        <span>
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      defaultPageSize: pageSize,
      showSizeChanger: true,
      pageSize,
      pageSizeOptions: ['10', '25', '50', '100'],
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.tableCustomers}>
        <Table
          size="middle"
          loading={loadingCustomer}
          onRow={(record) => {
            return {
              onClick: () => this.handleProfileCustomer(record._id), // click row
            };
          }}
          //   rowSelection={rowSelection}
          pagination={{ ...pagination }}
          columns={this.generateColumns()}
          dataSource={listCustomer}
          scroll={scroll}
          rowKey={(record) => record._id}
        />
      </div>
    );
  }
}

export default TableCustomers;

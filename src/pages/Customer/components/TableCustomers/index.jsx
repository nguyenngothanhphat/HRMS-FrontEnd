import React, { PureComponent } from 'react';
import { Col, Popover, Table, Row } from 'antd';
import { formatMessage, history, connect, Link } from 'umi';
import moment from 'moment';
import styles from './index.less';

class TableCustomers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      visible: false,
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
        className: `${styles.employeeId} `,
      },
      {
        title: formatMessage({ id: 'page.customermanagement.openLeads' }),
        dataIndex: 'openLeads',
        width: '10%',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTickets' }),
        dataIndex: 'pendingTickets',
        width: '10%',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'page.customermanagement.pendingTasks' }),
        dataIndex: 'pendingTasks',
        width: '10%',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'page.customermanagement.activeProjects' }),
        dataIndex: 'activeProjects',
        width: '10%',
        align: 'center',
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
        render: (accountOwner) => {
          return (
            <Popover
              placement="left"
              content={() => (
                <div style={{ width: '380px', padding: '12px', borderRadius: '5px' }}>
                  <div style={{ borderBottom: '1px solid #EAECEF' }}>
                    <Row>
                      <Col span={8}>
                        <img
                          src={
                            accountOwner?.generalInfo.avatar ? accountOwner?.generalInfo.avatar : ''
                          }
                          alt="avatar"
                        />
                      </Col>
                      <Col span={16}>
                        <p style={{ fontWeight: '700' }}>
                          {accountOwner?.generalInfo?.legalName
                            ? accountOwner?.generalInfo?.legalName
                            : ''}
                        </p>
                        <p>{accountOwner?.title?.name ? accountOwner?.title?.name : ''}</p>
                        <p>
                          {accountOwner?.department?.name ? accountOwner?.department?.name : ''}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <Col span={12}>
                        <p>Reporting Manager:</p>
                      </Col>
                      <Col span={12}>
                        <p>
                          {accountOwner?.manager?.generalInfo?.firstName
                            ? accountOwner?.manager?.generalInfo?.firstName
                            : ''}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p>Mobile:</p>
                      </Col>
                      <Col span={12}>
                        <p>{/* {accountOwner?.generalInfo?.firstName} */}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p>Email:</p>
                      </Col>
                      <Col span={12}>
                        <p>
                          {accountOwner?.generalInfo?.personalEmail
                            ? accountOwner?.generalInfo.personalEmail
                            : ''}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p>Location:</p>
                      </Col>
                      <Col span={12}>
                        <p>
                          {accountOwner?.location?.headQuarterAddress?.addressLine1
                            ? accountOwner?.location?.headQuarterAddress?.addressLine1
                            : ''}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <p>Locaton Time:</p>
                      </Col>
                      <Col span={12}>
                        <p />
                      </Col>
                    </Row>
                  </div>
                  <div style={{ borderTop: '1px solid #EAECEF', paddingTop: '20px' }}>
                    <Link
                      to={`/employees/employee-profile/${accountOwner?._id}`}
                      style={{ textDecoration: 'underline' }}
                    >
                      View full profile
                    </Link>
                  </div>
                </div>
              )}
            >
              <div>
                {accountOwner?.generalInfo?.legalName ? accountOwner?.generalInfo?.legalName : ''}
              </div>
            </Popover>
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
  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
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
    const { pageSelected, selectedRowKeys, visible } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100vw',
      y: 'max-content',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: listCustomer.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
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
          pagination={{ ...pagination, total: listCustomer.length }}
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

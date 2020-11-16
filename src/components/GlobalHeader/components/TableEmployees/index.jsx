import React, { Component } from 'react';
import { history, formatMessage } from 'umi';
import { CaretDownOutlined } from '@ant-design/icons';
import { Table, Empty } from 'antd';
import styles from './index.less';

class TableEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedName: {},
      pageSelected: 1,
      isSort: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { list } = this.props;
    if (prevProps.list !== list) {
      this.setFirstPage();
    }
  }

  renderUser = (generalInfo) => {
    return (
      <div className={styles.directoryTableName}>
        {/* {generalInfo.avatar ? (
          <Avatar size="medium" className={styles.avatar} src={generalInfo.avatar} alt="avatar" />
        ) : (
          <Avatar className={styles.avatar_emptySrc} alt="avatar" />
        )} */}
        <p>{`${generalInfo.firstName} ${generalInfo.lastName}`}</p>
      </div>
    );
  };

  generateColumns = (sortedName) => {
    const { isSort } = this.state;
    const columns = [
      {
        title: '#',
        key: 'index',
        dataIndex: 'index',
        fixed: 'left',
        width: '5%',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        key: 'employeeId',
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
        width: '10%',
        fixed: 'left',
        align: 'left',
      },
      {
        title: (
          <div className={styles.directoryTable_fullName}>
            {formatMessage({ id: 'component.directory.table.fullName' })}
            {isSort ? null : <CaretDownOutlined className={styles.directoryTable_iconSort} />}
          </div>
        ),
        dataIndex: 'generalInfo',
        key: 'generalInfo',
        render: (generalInfo) => (generalInfo ? this.renderUser(generalInfo) : ''),
        align: 'left',
        sorter: (a, b) =>
          a.generalInfo && a.generalInfo.firstName
            ? `${a.generalInfo.firstName} ${a.generalInfo.lastName}`.localeCompare(
                `${b.generalInfo.firstName} ${b.generalInfo.lastName}`,
              )
            : null,
        sortOrder: sortedName.columnKey === 'generalInfo' && sortedName.order,
        fixed: 'left',
        width: '10%',
        sortDirections: ['ascend', 'descend', 'ascend'],
      },
      {
        title: formatMessage({ id: 'component.directory.table.title' }),
        dataIndex: 'title',
        key: 'title',
        render: (title) => <span>{title ? title.name : ''}</span>,
        width: '10%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.department' }),
        dataIndex: 'department',
        key: 'department',
        render: (department) => (
          <span className={styles.directoryTable_deparmentText}>
            {department ? department.name : ''}
          </span>
        ),
        width: '16%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.reportingManager' }),
        dataIndex: 'manager',
        key: 'manager',
        render: (manager) => (
          <span>
            {manager.generalInfo
              ? `${manager.generalInfo.firstName} ${manager.generalInfo.lastName}`
              : ''}
          </span>
        ),
        align: 'left',
        width: '15%',
      },
      {
        title: 'Email',
        dataIndex: 'generalInfo',
        key: 'email',
        render: (generalInfo) => <span>{generalInfo?.workEmail}</span>,
        align: 'left',
      },
      {
        title: 'Contact Number',
        key: 'contactNumber',
        render: (location) => <span>{location ? location.name : ''}</span>,
        width: '10%',
        align: 'left',
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        width: '8%',
        align: 'left',
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  handleChangeTable = (_pagination, _filters, sorter) => {
    const descend = 'descend';
    const ascend = 'ascend';
    let isSort = false;
    if (sorter.order === descend || sorter.order === ascend) {
      isSort = true;
    }
    this.setState({
      sortedName: sorter,
      isSort,
    });
  };

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

  handleProfileEmployee = (row) => {
    const { _id = '', location: { name = '' } = {} } = row;
    history.push({
      pathname: `/employees/employee-profile/${_id}`,
      state: { location: name },
    });
  };

  render() {
    const { sortedName = {}, pageSelected } = this.state;
    const { list = [], loading, checkRoleEmployee } = this.props;
    const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: list.length,
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
    const parseList = list.map((employee, index) => {
      return {
        index: index + 1,
        ...employee,
      };
    });
    return (
      <div className={styles.tableEmployees}>
        <Table
          className={!checkRoleEmployee ? `${styles.tableEmployees__content}` : ''}
          size="small"
          columns={this.generateColumns(sortedName)}
          onRow={(record) => {
            if (checkRoleEmployee) {
              return null;
            }
            return {
              onClick: () => this.handleProfileEmployee(record), // click row
            };
          }}
          dataSource={parseList}
          rowKey={(record) => record._id}
          // pagination={false}
          pagination={list.length > rowSize ? { ...pagination, total: list.length } : false}
          loading={loading}
          onChange={this.handleChangeTable}
          locale={{
            emptyText: (
              <Empty
                description={formatMessage(
                  { id: 'component.onboardingOverview.noData' },
                  { format: 0 },
                )}
              />
            ),
          }}
          scroll={{ x: 'max-content', y: 'max-content' }}
        />
      </div>
    );
  }
}

export default TableEmployees;

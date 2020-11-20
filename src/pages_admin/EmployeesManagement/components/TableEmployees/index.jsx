import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage, history, connect } from 'umi';
import moment from 'moment';
import ModalConfirmRemove from '../ModalConfirmRemove';
import styles from './index.less';

@connect(({ loading, employeesManagement }) => ({
  loadingEmployeeProfile: loading.effects['employeesManagement/fetchEmployeeDetail'],
  employeesManagement,
}))
class TableEmployees extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      visible: false,
      selectedEmployeeId: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setFirstPage();
    }
  }

  generateColumns = () => {
    const columns = [
      {
        title: formatMessage({ id: 'component.directory.table.fullName' }),
        dataIndex: 'generalInfo',
        align: 'left',
        fixed: 'left',
        width: '12%',
        render: (generalInfo) =>
          generalInfo ? (
            <span className={styles.fullName}>
              {`${generalInfo.firstName} ${generalInfo.lastName}`}
            </span>
          ) : (
            ''
          ),
      },
      {
        title: formatMessage({ id: 'component.directory.table.employeeID' }),
        dataIndex: 'generalInfo',
        align: 'left',
        width: '10%',
        className: `${styles.employeeId} `,
        render: (generalInfo) => <span>{generalInfo ? generalInfo.employeeId : ''}</span>,
      },
      {
        title: formatMessage({ id: 'pages_admin.employees.table.joinedDate' }),
        dataIndex: 'joinDate',
        width: '8%',
        align: 'left',
        render: (joinDate) =>
          joinDate ? <span>{moment(joinDate).locale('en').format('MMM - Do, YY')}</span> : '',
      },
      {
        title: formatMessage({ id: 'pages_admin.employees.table.email' }),
        dataIndex: 'generalInfo',
        width: '15%',
        align: 'left',
        render: (generalInfo) => (
          <span>{generalInfo && generalInfo.workEmail ? generalInfo.workEmail : ''}</span>
        ),
      },
      {
        title: formatMessage({ id: 'component.directory.table.location' }),
        dataIndex: 'location',
        key: 'location',
        render: (location) => <span>{location ? location.name : ''}</span>,
        align: 'left',
      },
      {
        title: 'Job Title',
        dataIndex: 'title',
        // width: '10%',
        align: 'left',
        render: (title) => <span>{title ? title.name : ''}</span>,
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
        // align: 'left',
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
        // align: 'left',
        width: '10%',
      },
      {
        title: formatMessage({ id: 'component.directory.table.employmentType' }),
        dataIndex: 'employeeType',
        key: 'employmentType',
        render: (employeeType) => <span>{employeeType ? employeeType.name : ''}</span>,
        align: 'center',
        width: '10%',
      },
      {
        title: 'Action',
        dataIndex: '_id',
        width: '5%',
        align: 'center',
        render: (_id) => (
          <div className={styles.employeesAction}>
            <img
              src="assets/images/remove.svg"
              alt="removeIcon"
              onClick={(e) => this.deleteEmployee(e)}
              width="15px"
            />
          </div>
        ),
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
      selectedEmployeeId: null,
    });
  };

  deleteEmployee = (e, record) => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'employeesManagement/fetchEmployeeDetail',
    //   id: record,
    // }).then(() => {
    e.stopPropagation();
    this.setState({
      selectedEmployeeId: record,
      visible: true,
    });
    // });
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
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  handleProfileEmployee = (_id) => {
    history.push(`/employees/employee-profile/${_id}`);
  };

  render() {
    const {
      data = [],
      loading,
      employeesManagement: { employeeDetail = {} },
    } = this.props;
    const { pageSelected, selectedRowKeys, visible, selectedEmployeeId } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100vw',
      y: 'max-content',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
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
      <div className={styles.tableEmployees}>
        <Table
          size="small"
          loading={loading}
          onRow={(record) => {
            return {
              onClick: () => this.handleProfileEmployee(record._id), // click row
            };
          }}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.generateColumns()}
          dataSource={data}
          scroll={scroll}
          rowKey={(record) => record._id}
          // onChange={this.onSortChange}
        />
        <ModalConfirmRemove
          titleModal="Confirm Remove Employee"
          visible={visible}
          handleCancel={this.handleCancel}
          employee={employeeDetail}
        />
      </div>
    );
  }
}

export default TableEmployees;

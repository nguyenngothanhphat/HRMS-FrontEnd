import React, { PureComponent } from 'react';
import { Table } from 'antd';
// import empty from '@/assets/empty.svg';
// import persion from '@/assets/people.svg';
import { Link } from 'umi';
// import persion from '@/assets/people.svg';
import classNames from 'classnames';
import styles from './index.less';

class TableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderAction = (id) => {
    return (
      <div className={styles.rowAction}>
        <Link className={styles.rowAction__link} to={`/offboarding/relieving-detail/${id}`}>
          Start Relieving Formalities
        </Link>
      </div>
    );
  };

  _renderEmployeeId = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    return newItem[0].employee.generalInfo.employeeId;
  };

  _renderEmployeeName = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    return <span className={styles.requteeName}>{newItem[0].employee.generalInfo.legalName}</span>;
  };

  _renderDepartment = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    return newItem[0].department.name;
  };

  _renderLastWorkingDate = (id) => {
    const { data = [] } = this.props;
    const newItem = data?.filter((item) => item._id === id);
    const date = newItem[0].lastWorkingDate?.slice(0, 10);
    return date;
  };

  render() {
    const { data = [], isClosedTable = false, loading } = this.props;
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
      // pageSize: rowSize,
      // current: pageSelected,
      // onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={styles.title}>Ticket ID </span>,
        dataIndex: 'ticketID',
        fixed: 'left',
        width: 150,
        render: (ticketID) => <span className={styles.ticketId}>{ticketID}</span>,
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: '_id',
        render: (_id) => this._renderEmployeeId(_id),
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: '_id',
        render: (_id) => this._renderEmployeeName(_id),
        width: 180,
      },
      {
        title: <span className={styles.title}>Department </span>,
        dataIndex: '_id',
        render: (_id) => this._renderDepartment(_id),
        width: 150,
      },
      {
        title: <span className={styles.title}>Approved LWD</span>,
        dataIndex: '_id',
        render: (_id) => this._renderLastWorkingDate(_id),
        width: 150,
      },
      {
        title: !isClosedTable ? <span className={styles.title}>Action </span> : null,
        dataIndex: '_id',
        align: 'left',
        render: (_id) => (!isClosedTable ? this.renderAction(_id) : null),
        width: 250,
      },
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: (record) => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
      }),
    };

    return (
      <div className={styles.tableComponent}>
        <Table
          loading={loading}
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          pagination={{ ...pagination, total: data.length }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          onChange={this.handleChangeTable}
        />
      </div>
    );
  }
}
export default TableComponent;

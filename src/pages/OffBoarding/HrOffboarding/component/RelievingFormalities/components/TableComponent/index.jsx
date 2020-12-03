import React, { PureComponent } from 'react';
import { Table } from 'antd';
// import empty from '@/assets/empty.svg';
// import persion from '@/assets/people.svg';
import { history } from 'umi';
// import persion from '@/assets/people.svg';
import styles from './index.less';

class TableComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  push = () => {
    history.push('/hr-offboarding/HrRequest/1854545');
  };

  renderAction = () => {
    return (
      <div className={styles.rowAction}>
        <span onClick={this.push}>Start Relieving Formalities</span>
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
    return `${newItem[0].employee.generalInfo.legalName}`;
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
      },
      {
        title: <span className={styles.title}>Department </span>,
        dataIndex: '_id',
        render: (_id) => this._renderDepartment(_id),
      },
      {
        title: <span className={styles.title}>LWD </span>,
        dataIndex: '_id',
        render: (_id) => this._renderLastWorkingDate(_id),
      },
      {
        title: !isClosedTable ? <span className={styles.title}>Action </span> : null,
        dataIndex: 'Action',
        align: 'left',
        render: () => (!isClosedTable ? this.renderAction() : null),
      },
    ];

    return (
      <div className={styles.tableComponent}>
        <Table
          loading={loading}
          // locale={{
          //   emptyText: (
          //     <span>
          //       {/* <img src={empty} alt="" /> */}
          //       <p className={styles.textEmpty}>No data</p>
          //     </span>
          //   ),
          // }}
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

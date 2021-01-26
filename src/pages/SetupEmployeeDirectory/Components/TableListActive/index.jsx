import { Table } from 'antd';
import React, { Component } from 'react';
import s from './index.less';

class TableListActive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    const { loading, data = [] } = this.props;
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
        title: <span className={s.title}>Full Name</span>,
        dataIndex: 'generalInfo',
        key: 'fullName',
        render: (generalInfo = {}) => {
          return <p className={s.text}>{generalInfo?.firstName}</p>;
        },
      },
      {
        title: <span className={s.title}>Employee ID</span>,
        dataIndex: 'employeeId',
        key: 'employeeId',
        render: (employeeId) => {
          return <p className={s.text}>{employeeId}</p>;
        },
      },
      {
        title: <span className={s.title}>Email</span>,
        dataIndex: 'generalInfo',
        key: 'email',
        render: (generalInfo) => {
          return <p className={s.text}>{generalInfo?.workEmail}</p>;
        },
      },
      {
        title: <span className={s.title}>Title</span>,
        dataIndex: 'title',
        key: 'title',
        render: (title) => {
          return <p className={s.text}>{title}</p>;
        },
      },
      {
        title: <span className={s.title}>Department</span>,
        dataIndex: 'department',
        key: 'department',
        render: (department) => {
          return <p className={s.text}>{department?.name}</p>;
        },
      },
      {
        title: <span className={s.title}>Location</span>,
        dataIndex: 'location',
        key: 'location',
        render: (location) => {
          return <p className={s.text}>{location?.name}</p>;
        },
      },
      {
        title: <span className={s.title}>Reporting Manager</span>,
        dataIndex: 'manager',
        key: 'manager',
        render: (manager) => {
          return <p className={s.text}>{manager?.generalInfo?.firstName}</p>;
        },
      },
    ];

    return (
      <div className={s.tableDocuments}>
        <Table
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={{
            ...pagination,
            total: data.length,
            hideOnSinglePage: true,
          }}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </div>
    );
  }
}
export default TableListActive;

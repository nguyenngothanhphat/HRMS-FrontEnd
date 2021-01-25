import { Table } from 'antd';
import React, { Component } from 'react';
import s from './index.less';

const data = [
  { role: 'Owner' },
  { role: 'CEO' },
  { role: 'ADMIN-CSA' },
  { role: 'HR-GLOBAL' },
  { role: 'HR-MANAGER' },
];

class TableAdministrators extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  componentDidMount() {}

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    // const { data = [] } = this.props;
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
        title: <span className={s.title}>Admin Name</span>,
        dataIndex: 'name',
        key: 'name',
        render: (name) => {
          return <p className={s.text}>{name}</p>;
        },
      },
      {
        title: <span className={s.title}>Admin Role</span>,
        dataIndex: 'role',
        key: 'role',
        render: (role) => {
          return <p className={s.text}>{role}</p>;
        },
      },
      {
        title: <span className={s.title}>Email</span>,
        dataIndex: 'email',
        key: 'email',
        render: (email) => {
          return <p className={s.text}>{email}</p>;
        },
      },

      {
        title: <span className={s.title}>Action</span>,
        dataIndex: 'email',
        key: 'action',
        render: (email, row) => {
          return email ? (
            <p onClick={() => console.log('row', row)} className={s.textAction}>
              Edit
            </p>
          ) : (
            <p className={s.textAction}>Add</p>
          );
        },
      },
    ];

    return (
      <div className={s.tableAdministrators}>
        <Table
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={{
            ...pagination,
            total: data.length,
            hideOnSinglePage: true,
          }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          loading={false}
        />
      </div>
    );
  }
}
export default TableAdministrators;

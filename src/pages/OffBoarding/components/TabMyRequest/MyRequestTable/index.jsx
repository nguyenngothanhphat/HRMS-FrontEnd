/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Avatar } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import t from './index.less';

class TableManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  push = (data) => {
    history.push(`/offboarding/my-request/${data}`);
  };

  // onChangePagination = (pageNumber) => {
  //   this.setState({
  //     pageNavigation: pageNumber,
  //   });
  // };

  render() {
    const {
      data = [],
      loading,
      textEmpty = 'No resignation request is submitted',
      pageSelected,
      size,
      total: totalData,
      getPageAndSize = () => {},
    } = this.props;
    // const { pageNavigation } = this.state;
    // const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: totalData,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of
          <b>{total}</b>
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const columns = [
      {
        title: <span className={t.title}>Ticket ID</span>,
        dataIndex: 'ticketID',
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={t.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <p>{employee.employeeId}</p>;
        },
      },
      {
        title: <span className={t.title}>Requested on</span>,
        dataIndex: 'createdAt',
        render: (createdAt) => {
          return <p>{moment(createdAt).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={t.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
      },
      {
        title: <span className={t.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: (_, row) => {
          const { hrManager: { generalInfo: { avatar: avtHrManager = '' } = {} } = {} } =
            this.props;
          const { manager: { generalInfo: { avatar: avtManager = '' } = {} } = {} } = row;
          const arrAvt = [avtManager, avtHrManager];
          return (
            <div className={t.rowAction}>
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
        title: <span className={t.title}>Reason of leaving</span>,
        dataIndex: 'reasonForLeaving',
        render: (reasonForLeaving) => <div className={t.reason}>{reasonForLeaving}</div>,
      },
      {
        title: <span className={t.title}>Action</span>,
        dataIndex: '_id',
        render: (_id) => (
          <div className={t.rowAction}>
            <span onClick={() => this.push(_id)}>View Request</span>
          </div>
        ),
      },
    ];

    return (
      <div className={t.employeeTable}>
        <Table
          locale={{
            emptyText: (
              <div className={t.viewEmpty}>
                <img src={empty} alt="" />
                <p className={t.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}
export default TableManager;

/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, notification, Popover } from 'antd';
// import { Table, Popover, notification, Avatar } from 'antd';
import moment from 'moment';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
// import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.less';

class HrTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
      selectedRowKeys: [],
    };
  }

  renderContent = (row) => {
    const { _id = '', nodeStep = 1, relievingStatus = '' } = row;
    return (
      <div
        style={{ textDecoration: 'underline', cursor: 'pointer', color: '#2C6DF9' }}
        onClick={() => this.checkFunction(_id, nodeStep, relievingStatus)}
      >
        Move to relieving formalities
      </div>
    );
  };

  checkFunction = (id, nodeStep, relievingStatus) => {
    const { moveToRelieving = () => {} } = this.props;
    const payload = { id, relievingStatus: 'IN-QUEUES' };
    if (!relievingStatus && nodeStep === 1) {
      moveToRelieving(payload);
    } else {
      this.openNotificationWithIcon(nodeStep);
    }
  };

  openNotificationWithIcon = (nodeStep) => {
    const description = nodeStep < 2 ? 'Please submit LWD' : 'Moved to relieving formalities';
    notification.warning({
      message: 'Notification',
      description,
    });
  };

  push = (data) => {
    history.push(`/offboarding/review/${data}`);
  };

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { pageNavigation, selectedRowKeys = [] } = this.state;
    const {
      data = [],
      loading,
      textEmpty = 'No resignation request is submitted',
      isTabAccept = false,
    } = this.props;
    // const dateFormat = 'YYYY/MM/DD';
    const rowSize = 10;
    const newData = data.map((item) => {
      return {
        key: item._id,
        ...item,
      };
    });

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
        fixed: 'left',
        width: 150,
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        width: 150,
        render: (employee) => {
          return <p>{employee.employeeId}</p>;
        },
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'createDate',
        width: 200,
        render: (createDate) => {
          return <p>{moment(createDate).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'employee',
        // width: 150,
        ellipsis: true,
        render: (employee) => {
          const { generalInfo = {} } = employee;
          return (
            <p className={styles.requteeName}>
              {Object.keys(employee).length === 0 ? '' : generalInfo.firstName}
            </p>
          );
        },
      },
      {
        title: <span className={styles.title}>Current Project</span>,
        dataIndex: 'project',
        width: 200,
        render: (project) => {
          const { manager = '' } = project[0];
          return <p>{Object.keys(manager).length === 0 ? '' : manager}</p>;
        },
      },
      {
        title: <span className={styles.title}>Project Manager</span>,
        dataIndex: 'project',
        width: 200,
        render: (project) => {
          const { manager = '' } = project[0];
          return <p>{Object.keys(manager).length === 0 ? '' : manager}</p>;
        },
      },
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
        title: <span className={styles.title}>Department</span>,
        dataIndex: 'department',
        render: (department) => {
          return <p>{department?.name}</p>;
        },
      },
      {
        title: <span className={styles.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
      },
      {
        title: <span className={styles.title}>Action</span>,
        dataIndex: '_id',
        align: 'left',
        render: (_id, row) => {
          return (
            <div className={styles.viewAction}>
              <p className={styles.viewAction__text} onClick={() => this.push(_id)}>
                View Request
              </p>
              {isTabAccept && (
                <div className={styles.viewAction__popOver}>
                  <Popover
                    content={this.renderContent(row)}
                    title={false}
                    trigger="hover"
                    placement="bottomRight"
                  >
                    <span className={styles.viewAction__popOver__dots}>&#8285;</span>
                  </Popover>
                </div>
              )}
            </div>
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.HRtableStyles}>
        <Table
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={newData}
          hideOnSinglePage
          pagination={{ ...pagination, total: data.length }}
          rowKey={(record) => record._id}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </div>
    );
  }
}
export default HrTable;

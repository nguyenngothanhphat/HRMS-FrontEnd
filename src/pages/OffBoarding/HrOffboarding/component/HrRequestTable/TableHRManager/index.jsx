/* eslint-disable react/no-array-index-key */
import React, { PureComponent } from 'react';
import { Table, Popover, notification, Avatar } from 'antd';
import moment from 'moment';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
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
    const { _id = '', approvalStep = 1, relievingStatus = '' } = row;
    return (
      <div
        style={{ textDecoration: 'underline', cursor: 'pointer', color: '#2C6DF9' }}
        onClick={() => this.checkFunction(_id, approvalStep, relievingStatus)}
      >
        Move to relieving formalities
      </div>
    );
  };

  checkFunction = (id, approvalStep, relievingStatus) => {
    const { moveToRelieving = () => {} } = this.props;
    const payload = { id, relievingStatus: 'IN-QUEUES' };
    if (approvalStep === 2 && !relievingStatus) {
      moveToRelieving(payload);
    } else {
      this.openNotificationWithIcon(approvalStep);
    }
  };

  openNotificationWithIcon = (approvalStep) => {
    const description = approvalStep === 1 ? 'Please submit LWD' : 'Moved to relieving formalities';
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
        render: (ticketID) => {
          return <p>{ticketID}</p>;
        },
      },
      {
        title: <span className={styles.title}>Employee ID </span>,
        dataIndex: 'employee',
        render: (employee) => {
          return <p>{employee.employeeId}</p>;
        },
      },
      {
        title: <span className={styles.title}>Created date </span>,
        dataIndex: 'createDate',
        render: (createDate) => {
          return <p>{moment(createDate).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={styles.title}>Requ’tee Name </span>,
        dataIndex: 'employee',
        render: (employee) => {
          const { generalInfo = {} } = employee;
          return <p>{generalInfo.firstName}</p>;
        },
      },
      {
        title: <span className={styles.title}>Assigned </span>,
        dataIndex: 'Assigned',
        render: (_, row) => {
          const {
            hrManager: { generalInfo: { avatar: avtHrManager = '' } = {} } = {},
          } = this.props;
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

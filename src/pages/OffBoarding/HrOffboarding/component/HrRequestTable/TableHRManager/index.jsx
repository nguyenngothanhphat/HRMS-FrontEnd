import React, { PureComponent } from 'react';
import { Table, Popover, notification } from 'antd';
import moment from 'moment';
import empty from '@/assets/empty.svg';
import persion from '@/assets/people.svg';
import { history } from 'umi';
// import persion from '@/assets/people.svg';
import styles from './index.less';

class HrTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
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

  render() {
    const { pageNavigation } = this.state;
    const {
      data = [],
      loading,
      textEmpty = 'No resignation request is submitted',
      isTabAccept = false,
    } = this.props;
    // const dateFormat = 'YYYY/MM/DD';
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
        render: () => (
          <div className={styles.rowAction}>
            <p>
              <span>
                <img src={persion} style={{ marginTop: '10px' }} alt="" />
              </span>
              <span>
                <img src={persion} style={{ marginTop: '10px' }} alt="" />
              </span>
            </p>
          </div>
        ),
      },
      {
        title: <span className={styles.title}>Department</span>,
        dataIndex: 'department',
      },
      {
        title: <span className={styles.title}>LWD</span>,
        dataIndex: 'lastWorkingDate',
        render: (lastWorkingDate) => {
          return <p>{lastWorkingDate && moment(lastWorkingDate).format('YYYY/MM/DD')} </p>;
        },
      },
      {
        title: <span className={styles.title}>LWD Change</span>,
        dataIndex: 'LwdChange',
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
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={{ ...pagination, total: data.length }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </div>
    );
  }
}
export default HrTable;

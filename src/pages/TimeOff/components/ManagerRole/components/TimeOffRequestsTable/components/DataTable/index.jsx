import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import { history, connect } from 'umi';
import ApproveIcon from '@/assets/approveTR.svg';
import OpenIcon from '@/assets/openTR.svg';
import CancelIcon from '@/assets/cancelTR.svg';
import moment from 'moment';
import styles from './index.less';

@connect(({ loading }) => ({
  loadingFetchLeaveRequests: loading.effects['timeOff/fetchLeaveRequestOfEmployee'],
}))
class DataTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: '_id',
      align: 'left',
      fixed: 'left',
      render: (_id) => (
        <span className={styles.ID} onClick={() => this.viewRequest(_id)}>
          ID
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'center',
      render: (type) => <span>{type ? type.shortType : ''}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },

    // {
    //   title: 'Leave date',
    //   width: '20%',
    //   dataIndex: 'leaveTimes',
    //   align: 'left',
    // },
    {
      title: `Req’ted on `,
      dataIndex: 'onDate',
      align: 'center',
      // width: '30%',
      render: (onDate) => <span>{moment(onDate).locale('en').format('MM.DD.YYYY')}</span>,
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment(a.onDate).isAfter(moment(b.onDate)),
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'center',
    },
    {
      title: 'Assigned',
      align: 'left',
      dataIndex: 'assigned',
      // width: '25%',
      render: (assigned) => {
        return (
          <div className={styles.rowAction}>
            <Avatar.Group
              maxCount={3}
              maxStyle={{
                color: '#FFA100',
                backgroundColor: '#EAF0FF',
              }}
            >
              {assigned.map((user) => {
                const { firstName = '', lastName = '', avatar = '', workEmail = '' } = user;
                const { approvalManagerEmail } = this.state;
                return (
                  <Tooltip title={`${firstName} ${lastName}`} placement="top">
                    <Avatar
                      size="small"
                      style={
                        approvalManagerEmail === workEmail
                          ? { backgroundColor: '#EAF0FF', border: '3px solid #FFA100' }
                          : { backgroundColor: '#EAF0FF' }
                      }
                      src={avatar}
                    />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          </div>
        );
      },
    },
    {
      title: 'Action',
      align: 'center',
      dataIndex: '_id',
      // width: '25%',
      render: (_id) => {
        const { category = '' } = this.props;
        if (category === 'MY') {
          return (
            <div className={styles.rowAction}>
              <span onClick={() => this.viewRequest(_id)}>View Request</span>
            </div>
          );
        }
        return (
          <div className={styles.rowAction}>
            <img src={OpenIcon} onClick={() => this.onOpenClick(_id)} alt="open" />
            <img src={ApproveIcon} onClick={this.onApproveClick} alt="approve" />
            <img src={CancelIcon} onClick={this.onCancelClick} alt="cancel" />
          </div>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
      approvalManagerEmail: '',
    };
  }

  // HANDLE TEAM REQUESTS
  onOpenClick = (_id) => {
    history.push({
      pathname: `/time-off/manager-view-request/${_id}`,
      // state: { location: name },
    });
  };

  onApproveClick = () => {
    alert('Approve');
  };

  onCancelClick = () => {
    alert('Cancel');
  };

  // view request
  viewRequest = (_id) => {
    history.push({
      pathname: `/time-off/view-request/${_id}`,
      // state: { location: name },
    });
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

  onSelectChange = (selectedRowKeys) => {
    // eslint-disable-next-line no-console
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  // PARSE DATA FOR TABLE
  processData = (data) => {
    return data.map((value) => {
      const {
        fromDate = '',
        toDate = '',
        approvalManager: {
          generalInfo: { workEmail = '' } = {},
          generalInfo: generalInfoA = {},
        } = {},
        cc = [],
      } = value;

      // GET ID OF APPROVE MANAGER
      this.setState({
        approvalManagerEmail: workEmail,
      });

      let leaveTimes = '';
      if (fromDate !== '' && fromDate !== null && toDate !== '' && toDate !== null) {
        leaveTimes = `${moment(fromDate).locale('en').format('MM.DD.YYYY')} - ${moment(toDate)
          .locale('en')
          .format('MM.DD.YYYY')}`;
      }

      const employeeFromCC = cc.map((each) => {
        const { generalInfo = {} } = each;
        return generalInfo;
      });
      const assigned = [generalInfoA, ...employeeFromCC];

      return {
        ...value,
        leaveTimes,
        assigned,
      };
    });
  };

  render() {
    const { data = [], loadingFetchLeaveRequests } = this.props;
    const { selectedRowKeys } = this.state;
    // const rowSize = 20;

    const parsedData = this.processData(data);
    const scroll = {
      x: '40vw',
      y: 'max-content',
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.DataTable}>
        <Table
          size="middle"
          loading={loadingFetchLeaveRequests}
          rowSelection={rowSelection}
          pagination={false}
          columns={this.columns}
          dataSource={parsedData}
          scroll={scroll}
          rowKey="_id"
        />
      </div>
    );
  }
}

export default DataTable;

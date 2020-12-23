import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

@connect(({ loading }) => ({
  loading1: loading.effects['timeOff/fetchMyCompoffRequests'],
  loading2: loading.effects['timeOff/fetchTeamCompoffRequests'],
}))
class CompoffTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      render: (id) => {
        const { ticketID = '', _id = '' } = id;
        return (
          <span className={styles.ID} onClick={() => this.viewRequest(_id)}>
            {ticketID}
          </span>
        );
      },
    },
    {
      title: 'Project',
      dataIndex: 'project',
      align: 'left',
      render: (project) => <span>{project ? project.name : ''}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
    },
    {
      title: `Req’ted on `,
      dataIndex: 'onDate',
      align: 'left',
      render: (onDate) => <span>{moment(onDate).locale('en').format('MM.DD.YYYY')}</span>,
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment(a.onDate).isAfter(moment(b.onDate)),
      },
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Assigned',
      align: 'left',
      dataIndex: 'assigned',
      render: (assigned) => {
        return (
          <div className={styles.rowAction}>
            <Avatar.Group
              maxCount={2}
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
      align: 'left',
      dataIndex: '_id',
      render: (_id) => (
        <div className={styles.rowAction}>
          <span onClick={() => this.viewRequest(_id)}>View Request</span>
        </div>
      ),
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

  // view request
  viewRequest = (_id) => {
    history.push({
      pathname: `/time-off/view-compoff-request/${_id}`,
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
        manager: { generalInfo: { workEmail = '' } = {}, generalInfo: generalInfoA = {} } = {},
        cc = [],
        ticketID = '',
        _id = '',
        // extraTime = [],
      } = value;

      // GET ID OF APPROVE MANAGER
      this.setState({
        approvalManagerEmail: workEmail,
      });

      // let duration = {};
      // if (extraTime.length !== 0) {
      //   duration = {
      //     fromDate: extraTime[0].date,
      //     toDate: extraTime[extraTime.length - 1].date,
      //   };
      // }
      // console.log('duration', duration);

      let employeeFromCC = [];
      if (cc.length > 0) {
        employeeFromCC = cc[0].map((each) => {
          return each;
        });
      }
      const assigned = [generalInfoA, ...employeeFromCC];

      return {
        ...value,
        // duration,
        assigned,
        id: {
          ticketID,
          _id,
        },
      };
    });
  };

  render() {
    const { data = [], loading1, loading2 } = this.props;
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
      <div className={styles.CompoffTable}>
        <Table
          size="middle"
          loading={loading1 || loading2}
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
export default CompoffTable;

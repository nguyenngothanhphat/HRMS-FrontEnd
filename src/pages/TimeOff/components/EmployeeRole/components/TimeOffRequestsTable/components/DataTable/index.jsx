import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import styles from './index.less';

export default class DataTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      align: 'left',
      render: () => <span>ID</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      align: 'left',
      render: (type) => <span>{type ? type.shortType : ''}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Leave date',
      width: '20%',
      dataIndex: 'leaveTimes',
      align: 'left',
    },
    {
      title: `Req’ted on `,
      dataIndex: 'onDate',
      align: 'left',
      render: (onDate) => <span>{moment(onDate).locale('en').format('MM.DD.YYYY')}</span>,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
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
                backgroundColor: '#464646',
              }}
            >
              {assigned.map((user) => {
                const { firstName = '', lastName = '', avatar = '', workEmail = '' } = user;
                const { approvalManagerEmail } = this.state;
                return (
                  <Tooltip title={`${firstName} ${lastName}`} placement="top">
                    <Avatar
                      style={
                        approvalManagerEmail === workEmail
                          ? { backgroundColor: '#464646', border: '2px solid #FFA100' }
                          : { backgroundColor: '#464646' }
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

      const leaveTimes = `${moment(fromDate).locale('en').format('MM.DD.YYYY')} - ${moment(toDate)
        .locale('en')
        .format('MM.DD.YYYY')}`;

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
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    // const rowSize = 20;

    const parsedData = this.processData(data);
    // const scroll = {
    //   x: '',
    //   y: 'max-content',
    // };

    // const pagination = {
    //   position: ['bottomRight'],
    //   total: data.length,
    //   showTotal: (total, range) => (
    //     <span>
    //       Showing{' '}
    //       <b>
    //         {range[0]} - {range[1]}
    //       </b>{' '}
    //       total
    //     </span>
    //   ),
    //   pageSize: rowSize,
    //   current: pageSelected,
    //   onChange: this.onChangePagination,
    // };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className={styles.DataTable}>
        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          // pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={parsedData}
          // scroll={scroll}
          rowKey="_id"
        />
      </div>
    );
  }
}

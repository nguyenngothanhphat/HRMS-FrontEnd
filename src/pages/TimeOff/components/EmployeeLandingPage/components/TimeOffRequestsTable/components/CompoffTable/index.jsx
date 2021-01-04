import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

@connect(({ timeOff, loading, user }) => ({
  loadingFetchMyCompoffRequests: loading.effects['timeOff/fetchMyCompoffRequests'],
  timeOff,
  user,
}))
class CompoffTable extends PureComponent {
  columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'id',
      align: 'left',
      fixed: 'left',
      width: '15%',
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
                const { firstName = '', lastName = '', avatar = '' } = user;
                return (
                  <Tooltip title={`${firstName} ${lastName}`} placement="top">
                    <Avatar size="small" style={{ backgroundColor: '#EAF0FF' }} src={avatar} />
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
        manager: { generalInfo: generalInfoA = {} } = {},
        cc = [],
        ticketID = '',
        _id = '',
        extraTime = [],
      } = value;

      let duration = '';
      if (extraTime.length !== 0) {
        const fromDate = extraTime[0].date;
        const toDate = extraTime[extraTime.length - 1].date;
        duration = `${moment(fromDate).format('DD.MM.YYYY')} - ${moment(toDate).format(
          'DD.MM.YYYY',
        )}`;
      }

      let employeeFromCC = [];
      if (cc.length > 0) {
        employeeFromCC = cc[0].map((each) => {
          return each;
        });
      }
      const assigned = [generalInfoA, ...employeeFromCC];

      return {
        ...value,
        duration,
        assigned,
        id: {
          ticketID,
          _id,
        },
      };
    });
  };

  render() {
    const { data = [], loadingFetchMyCompoffRequests } = this.props;
    const { selectedRowKeys, pageSelected } = this.state;
    const rowSize = 10;

    const parsedData = this.processData(data);
    const pagination = {
      position: ['bottomLeft'],
      total: parsedData.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          Showing{'  '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const scroll = {
      x: '60vw',
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
          rowSelection={rowSelection}
          loading={loadingFetchMyCompoffRequests}
          pagination={{ ...pagination, total: parsedData.length }}
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

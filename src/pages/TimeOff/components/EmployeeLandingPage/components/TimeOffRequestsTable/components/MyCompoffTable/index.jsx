import React, { PureComponent } from 'react';
import { Table, Avatar, Tooltip, Spin } from 'antd';
import { history, connect } from 'umi';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';
import DefaultAvatar from '@/assets/defaultAvatar.png';

import styles from './index.less';

@connect(({ dispatch, timeOff, loading, user }) => ({
  loadingFetchMyCompoffRequests: loading.effects['timeOff/fetchMyCompoffRequests'],
  timeOff,
  user,
  dispatch,
}))
class MyCompoffTable extends PureComponent {
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
      render: (project) => <span>{project ? project.projectName : '-'}</span>,
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      align: 'left',
      render: (duration) => <span>{duration !== 0 ? duration : '-'}</span>,
    },
    {
      title: `Requested on `,
      dataIndex: 'onDate',
      align: 'left',
      render: (onDate) => <span>{moment.utc(onDate).locale('en').format('MM/DD/YYYY')}</span>,
      defaultSortOrder: ['ascend'],
      sorter: {
        compare: (a, b) => moment.utc(a.onDate).isAfter(moment.utc(b.onDate)),
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
                const { legalName = '', avatar = '' } = user;
                return (
                  <Tooltip title={legalName} placement="top">
                    <Avatar
                      size="small"
                      style={{ backgroundColor: '#EAF0FF' }}
                      src={avatar || DefaultAvatar}
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
      // fixed: 'right',
      dataIndex: '_id',
      // width: '15%',
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
      // pageSelected: 1,
      selectedRowKeys: [],
    };
  }

  // view request
  viewRequest = (_id) => {
    history.push({
      pathname: `/time-off/overview/personal-compoff/view/${_id}`,
      // state: { location: name },
    });
  };

  // pagination
  onChangePagination = (pageNumber) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/savePaging',
      payload: {
        page: pageNumber,
      },
    });
  };

  // setFirstPage = () => {
  //   this.setState({
  //     pageSelected: 1,
  //   });
  // };

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  // PARSE DATA FOR TABLE
  processData = (data) => {
    return data.map((value) => {
      const {
        ticketID = '',
        _id = '',
        extraTime = [],
        approvalFlow: { step1 = {}, step2 = {}, step3 = {} } = {},
      } = value;

      let duration = '';
      if (extraTime.length !== 0) {
        const fromDate = extraTime[0].date;
        const toDate = extraTime[extraTime.length - 1].date;
        duration = `${moment.utc(fromDate).format('MM/DD/YYYY')} - ${moment
          .utc(toDate)
          .format('MM/DD/YYYY')}`;
      }

      const oneAssign = (step) => {
        const { employee: { generalInfo: { legalName = '', avatar = '' } = {} } = {} } = step;
        return {
          legalName,
          avatar,
        };
      };
      const assigned = [oneAssign(step1), oneAssign(step2), oneAssign(step3)];

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
    const {
      data = [],
      loadingFetchMyCompoffRequests = false,
      timeOff: {
        paging: { page, limit, total },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;
    // const rowSize = 10;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const tableLoading = {
      spinning: loadingFetchMyCompoffRequests,
      indicator: <Spin indicator={antIcon} />,
    };

    const parsedData = this.processData(data);
    const pagination = {
      position: ['bottomLeft'],
      total,
      showTotal: (totals, range) => (
        <span>
          {' '}
          Showing{'  '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {totals}{' '}
        </span>
      ),
      pageSize: limit,
      current: page,
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
      <div className={styles.MyCompoffTable}>
        <Table
          size="middle"
          rowSelection={rowSelection}
          loading={tableLoading}
          pagination={{ ...pagination, total }}
          columns={this.columns}
          dataSource={parsedData}
          scroll={scroll}
          rowKey={(id) => id.ticketID}
        />
        {parsedData.length === 0 && <div className={styles.paddingContainer} />}
      </div>
    );
  }
}

export default MyCompoffTable;

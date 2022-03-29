import React, { Component } from 'react';
import { Table, Popover } from 'antd';
import moment from 'moment';
import { connect, formatMessage, history } from 'umi';
import { getTimezoneViaCity } from '@/utils/times';
import AddComment from './components/AddComment';
import OverviewComment from './components/OverviewComment';
import PopupProjectManager from './components/PopupProjectManager';
import PopupProjectName from './components/PopupProjectName';
import PopupCustomer from './components/PopupCustomer';

import styles from './index.less';

class TableProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1, // popup hover name
      timezoneList: [],
      currentTime: moment(),
    };
  }

  componentDidMount() {
    this.fetchTimezone();
    this.setCurrentTime();
  }

  componentDidUpdate(prevProps) {
    const { listLocationsByCompany = [] } = this.props;
    if (
      JSON.stringify(prevProps.listLocationsByCompany) !== JSON.stringify(listLocationsByCompany)
    ) {
      this.fetchTimezone();
    }
  }

  setCurrentTime = () => {
    // compare two time by hour & minute. If minute changes, get new time
    const timeFormat = 'HH:mm';
    const { currentTime } = this.state;
    const parseTime = (timeString) => moment(timeString, timeFormat);
    const check = parseTime(moment().format(timeFormat)).isAfter(
      parseTime(moment(currentTime).format(timeFormat)),
    );

    if (check) {
      this.setState({
        currentTime: moment(),
      });
    }
  };

  fetchTimezone = () => {
    const { listLocationsByCompany = [] } = this.props;
    const timezoneList = [];
    listLocationsByCompany.forEach((location) => {
      const {
        headQuarterAddress: { addressLine1 = '', addressLine2 = '', state = '', city = '' } = {},
        _id = '',
      } = location;
      timezoneList.push({
        locationId: _id,
        timezone:
          getTimezoneViaCity(city) ||
          getTimezoneViaCity(state) ||
          getTimezoneViaCity(addressLine1) ||
          getTimezoneViaCity(addressLine2),
      });
    });
    this.setState({
      timezoneList,
    });
  };

  formatDate = (date, typeFormat) => {
    if (!date) {
      return '-';
    }
    return moment(date).format(typeFormat);
  };

  getProjectManage = (obj) => {
    if (!obj) {
      return '-';
    }
    const getInfo = obj ? obj.generalInfo : {};
    return getInfo;
  };

  onChangePagination = (pageNumber) => {
    const { onChangePage = () => {}, isBackendPaging = false } = this.props;

    if (isBackendPaging) {
      onChangePage(pageNumber);
    } else {
      this.setState({
        pageSelected: pageNumber,
      });
    }
  };

  viewProfile = (_id) => {
    history.push(`/directory/employee-profile/${_id}`);
  };

  render() {
    const { pageSelected } = this.state;
    const {
      data = [],
      loading = false,
      page = 1,
      limit = 10,
      total: totalProp,
      isBackendPaging = false,
      allowModify = false,
    } = this.props;
    const { timezoneList, currentTime } = this.state;
    const { listLocationsByCompany = [] } = this.props;

    const pagination = {
      position: ['bottomLeft'],
      total: isBackendPaging ? totalProp : data.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: limit,
      current: isBackendPaging ? page : pageSelected,
      onChange: this.onChangePagination,
    };

    const dataSource = data.map((obj, x) => {
      return {
        key: x + 1,
        id: obj.id,
        projectId: obj.projectId,
        projectName: obj.projectName || '-',
        customer: obj.customerName || '-',
        projectType: obj.engagementType || '-',
        projectManager: obj.projectManager || '-',
        startDate: this.formatDate(obj.startDate, 'MM/DD/YYYY'),
        endDate: this.formatDate(obj.endDate, 'MM/DD/YYYY'),
        resivedEndDate: this.formatDate(obj.newEndDate, 'MM/DD/YYYY'),
        status: obj.projectStatus || '-',
        resourcePlan: obj.resourcesPlanned || '-',
        resourceAssigned: obj.resourcesAssigned || '-',
        billableResource: obj.billableResources || '-',
        bufferResource: obj.bufferResources || '-',
        billEfficiency: `${obj.billingEfficiency ? obj.billingEfficiency : 0}%` || '-',
        billableEffor: obj.billableEffort || '-',
        spentEffor: obj.spentEffort || '-',
        variance: obj.variance || '-',
        comment: obj.comments,
      };
    });

    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (value, row) => {
          return (
            <Popover
              content={<PopupProjectName dataProjectName={row} />}
              trigger="hover"
              placement="bottomRight"
              overlayClassName={styles.popupContentProjectManager}
            >
              <span className={styles.projectName}>{value}</span>
            </Popover>
          );
        },
        sorter: (a, b) => a.projectName.localeCompare(b.projectName),
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        render: (value, row) => (
          <Popover
            content={<PopupCustomer dataCustomer={row} />}
            trigger="hover"
            placement="bottomRight"
            overlayClassName={styles.popupContentProjectManager}
          >
            <span className={styles.projectName}>{value}</span>
          </Popover>
        ),
        sorter: (a, b) => a.customer.localeCompare(b.customer),
      },
      {
        title: 'Project Type',
        dataIndex: 'projectType',
        key: 'projectType',
        sorter: (a, b) => a.projectType.localeCompare(b.projectType),
      },
      {
        title: 'Project Manager',
        dataIndex: 'projectManager',
        key: 'projectManager',
        render: (value) => (
          <Popover
            content={
              <PopupProjectManager
                listLocationsByCompany={listLocationsByCompany}
                propsState={{ currentTime, timezoneList }}
                dataProjectManager={value}
              />
            }
            trigger="hover"
            placement="bottomRight"
            overlayClassName={styles.popupContentProjectManager}
          >
            <span
              className={styles.projectName}
              onClick={() => this.viewProfile(value?.generalInfo?.userId)}
            >
              {value?.generalInfo?.legalName || '-'}
            </span>
          </Popover>
        ),
        sorter: (a, b) =>
          a.projectManager?.generalInfo?.legalName.localeCompare(
            b.projectManager?.generalInfo?.legalName,
          ),
      },
      {
        title: (
          <div className={styles.dateHeaderContainer}>
            <div>Start Date</div>
            <div className={styles.dateFormat}>(mm/dd/yyyy)</div>
          </div>
        ),
        dataIndex: 'startDate',
        key: 'startDate',
        sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
      },
      {
        title: (
          <div className={styles.dateHeaderContainer}>
            <div>End Date</div>
            <div className={styles.dateFormat}>(mm/dd/yyyy)</div>
          </div>
        ),
        dataIndex: 'endDate',
        key: 'endDate',
        sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
      },
      {
        title: (
          <div className={styles.dateHeaderContainer}>
            <div>Revised End Date</div>
            <div className={styles.dateFormat}>(mm/dd/yyyy)</div>
          </div>
        ),
        dataIndex: 'resivedEndDate',
        key: 'resivedEndDate',
        sorter: (a, b) => moment(a.resivedEndDate).unix() - moment(b.resivedEndDate).unix(),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: 'Resource Planned',
        dataIndex: 'resourcePlan',
        key: 'resourcePlan',
        sorter: (a, b) => a.resourcePlan - b.resourcePlan,
      },
      {
        title: 'Resource Assigned',
        dataIndex: 'resourceAssigned',
        key: 'resourceAssigned',
        sorter: (a, b) => a.resourceAssigned - b.resourceAssigned,
      },
      {
        title: 'Billable Resource',
        dataIndex: 'billableResource',
        key: 'billableResource',
        sorter: (a, b) => a.billableResource - b.billableResource,
      },
      {
        title: 'Buffer Resource',
        dataIndex: 'bufferResource',
        key: 'bufferResource',
        sorter: (a, b) => a.bufferResource - b.resourceAssigned,
      },
      {
        title: 'Billing Efficiency (%)',
        dataIndex: 'billEfficiency',
        key: 'billEfficiency',
        sorter: (a, b) => a.billEfficiency.localeCompare(b.billEfficiency),
      },
      {
        title: 'Billable Effort (days)',
        dataIndex: 'billableEffor',
        key: 'billableEffor',
        sorter: (a, b) => a.billableEffor - b.billableEffor,
      },
      {
        title: 'Spent Effort (days)',
        dataIndex: 'spentEffor',
        key: 'spentEffor',
        sorter: (a, b) => a.spentEffor - b.spentEffor,
      },
      {
        title: 'Variance',
        dataIndex: 'variance',
        key: 'variance',
        sorter: (a, b) => a.variance - b.variance,
      },
      {
        title: 'Comments',
        dataIndex: 'comment',
        key: 'comment',
        width: '10%',
        render: (value, row) => {
          const { fetchProjectList } = this.props;
          let displayValue;
          if (value) {
            const getRow = dataSource.filter((x) => x.id === row.id).length;
            const line = getRow === 0 || getRow === 1 ? 3 : getRow * 3;
            displayValue = (
              <span>
                <OverviewComment row={row} line={line} fetchProjectList={fetchProjectList} />
              </span>
            );
          } else {
            displayValue = (
              <span>
                {allowModify ? <AddComment data={row} fetchProjectList={fetchProjectList} /> : '-'}
              </span>
            );
          }
          return displayValue;
        },
        sorter: (a, b) => {
          if (a.comment && b.comment) {
            return a.comment.localeCompare(b.comment);
          }
          return null;
        },
      },
    ];

    return (
      <div className={styles.TableProject}>
        <Table
          className={styles.tableProject}
          dataSource={dataSource}
          columns={columns}
          loading={loading}
          pagination={pagination}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}

export default connect(({ locationSelection: { listLocationsByCompany = [] } }) => ({
  listLocationsByCompany,
}))(TableProject);

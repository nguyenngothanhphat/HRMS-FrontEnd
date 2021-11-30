import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { connect, formatMessage } from 'umi';
import AddComment from './components/AddComment';
import OverviewComment from './components/OverviewComment';
import styles from './index.less';

class TableProject extends Component {
  constructor(props) {
    super(props);
    this.state = { pageSelected: 1 };
  }

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
    const getProjectManager = getInfo ? getInfo.legalName : '-';
    return getProjectManager;
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

  render() {
    const { pageSelected } = this.state;
    const {
      data = [],
      loading = false,
      page = 1,
      limit = 10,
      total: totalProp,
      isBackendPaging = false,
    } = this.props;

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
        projectManager: this.getProjectManage(obj.projectManager),
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
        render: (value) => {
          return <span className={styles.projectName}>{value}</span>;
        },
        sorter: (a, b) => a.projectName.localeCompare(b.projectName),
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        render: (value) => {
          return <span className={styles.projectName}>{value}</span>;
        },
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
        render: (value) => {
          return <span className={styles.projectName}>{value}</span>;
        },
        sorter: (a, b) => a.projectManager.localeCompare(b.projectManager),
      },
      {
        title: (
          <div>
            <div>Start Date</div>
            <div>(mm/dd/yyyy)</div>
          </div>
        ),
        dataIndex: 'startDate',
        key: 'startDate',
        sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
      },
      {
        title: (
          <div>
            <div>End Date</div>
            <div>(mm/dd/yyyy)</div>
          </div>
        ),
        dataIndex: 'endDate',
        key: 'endDate',
        sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
      },
      {
        title: (
          <div>
            <div>Resived End Date</div>
            <div>(mm/dd/yyyy)</div>
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
        title: 'Resource Planed',
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
        title: 'Billing Efficiency',
        dataIndex: 'billEfficiency',
        key: 'billEfficiency',
        sorter: (a, b) => a.billEfficiency.localeCompare(b.billEfficiency),
      },
      {
        title: 'Billable Effor (days)',
        dataIndex: 'billableEffor',
        key: 'billableEffor',
        sorter: (a, b) => a.billableEffor - b.billableEffor,
      },
      {
        title: 'Spent Effor (days)',
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
        render: (value, row) => {
          const {fetchProjectList} = this.props;
          let displayValue;
          if (value) {
            const getRow = dataSource.filter((x) => x.id === row.id).length;
            const line = getRow === 0 || getRow === 1 ? 3 : getRow * 3;
            displayValue = <span><OverviewComment row={row} line={line} fetchProjectList={fetchProjectList} /></span>
          } else {
            displayValue = <span><AddComment data={row} fetchProjectList={fetchProjectList} /></span>
          }
          return ( displayValue );
        },
        sorter: (a, b) => a.comment.localeCompare(b.comment),
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

export default connect(() => ({}))(TableProject);

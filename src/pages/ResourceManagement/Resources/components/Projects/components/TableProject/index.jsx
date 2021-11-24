import React, { Component } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import AddComment from './components/AddComment';
import OverviewComment from './components/OverviewComment';
import styles from './index.less';

class TableProject extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { total, pageSelected, size, getPageAndSize } = this.props;
    const pagination = {
      position: ['bottomLeft'],
      total,
      showTotal: () => (
        <span>
          Showing{' '}
          <b>
            {(pageSelected - 1) * size + 1} - {pageSelected * size}
          </b>{' '}
          of {total}
        </span>
      ),
      pageSize: 100,
      current: pageSelected,
      onChange: (page) => getPageAndSize(page, size),
    };

    const dataSource = [
      {
        key: '1',
        projectName: 'HRMS (TL-Comp)',
        customer: 'Terralogic Company',
        projectType: 'M&M',
        projectManager: 'Randy Dias',
        startDate: '12/23/2021',
        endDate: '09/16/2022',
        resivedEndDate: '02/12/2022',
        status: 'Engaging',
        resourcePlan: 2,
        resourceAssigned: 3,
        billableResource: 2,
        bufferResource: 1,
        billEfficiency: '85%',
        billableEffor: 3,
        spentEffor: 5,
        variance: 2,
        comment: 'Lorem Ipsum is'
      },
      {
        key: '2',
        projectName: 'Entrible',
        customer: 'Terralogic Company',
        projectType: 'T&M',
        projectManager: 'Nolan Rhiel',
        startDate: '05/17/2021',
        endDate: '02/11/2022',
        resivedEndDate: '02/12/2022',
        status: 'Lang',
        resourcePlan: 1,
        resourceAssigned: 3,
        billableResource: 4,
        bufferResource: 5,
        billEfficiency: '60%',
        billableEffor: 7,
        spentEffor: 3,
        variance: 4,
        comment: ''
      },
      {
        key: '3',
        projectName: 'Billable',
        customer: 'Terra-Comp',
        projectType: 'K&M',
        projectManager: 'Nolan Rhiel',
        startDate: '02/12/2021',
        endDate: '02/11/2022',
        resivedEndDate: '02/12/2022',
        status: 'Billable',
        resourcePlan: 2,
        resourceAssigned: 5,
        billableResource: 3,
        bufferResource: 4,
        billEfficiency: '70%',
        billableEffor: 2,
        spentEffor: 3,
        variance: 1,
        comment: 'dummy text of the printing and typesetting industry.'
      },
      {
        key: '4',
        projectName: 'Alska comp',
        customer: 'Terra-Comp',
        projectType: 'L&M',
        projectManager: 'Nolan Rhiel',
        startDate: '10/07/2021',
        endDate: '04/03/2022',
        resivedEndDate: '02/12/2022',
        status: 'inprocess',
        resourcePlan: 8,
        resourceAssigned: 6,
        billableResource: 3,
        bufferResource: 9,
        billEfficiency: '90%',
        billableEffor: 4,
        spentEffor: 1,
        variance: 3,
        comment: 'printing and typesetting industry.'
      },
    ];

    const columns = [
      {
        title: 'Project Name',
        dataIndex: 'projectName',
        key: 'projectName',
        render: (value) => {
            return <span className={styles.projectName}>{value}</span>
        },
        sorter: (a, b) => a.projectName.localeCompare(b.projectName)
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        render: (value) => {
            return <span className={styles.projectName}>{value}</span>
        },
        sorter: (a, b) => a.customer.localeCompare(b.customer)
      },
      {
        title: 'Project Type',
        dataIndex: 'projectType',
        key: 'projectType',
        sorter: (a, b) => a.projectType.localeCompare(b.projectType)
      },
      {
        title: 'Project Manager',
        dataIndex: 'projectManager',
        key: 'projectManager',
        render: (value) => {
            return <span className={styles.projectName}>{value}</span>
        },
        sorter: (a, b) => a.projectManager.localeCompare(b.projectManager)
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
        sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix()
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
        sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix()
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
        sorter: (a, b) => moment(a.resivedEndDate).unix() - moment(b.resivedEndDate).unix()
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: (a, b) => a.status.localeCompare(b.status)
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
        sorter: (a, b) => a.billEfficiency - b.billEfficiency,
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
            if(value ){
                const getRow = dataSource.filter((x) => x.key === row.key).length;
                const line = getRow === 0 || getRow === 1 ? 3 : getRow * 3;
                return <span><OverviewComment row={row} line={line} /></span>
            } 
            return <span><AddComment data={row} /></span>
        },
        sorter: (a, b) => a.comment.localeCompare(b.comment),
      },
    ];

    return (
      <div className={styles.tableProject}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          rowKey="id"
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}

export default TableProject;

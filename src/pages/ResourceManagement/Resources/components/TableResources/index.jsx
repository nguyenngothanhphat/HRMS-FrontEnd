import React, { PureComponent } from 'react';
import {
  Table,
  // , Dropdown, Menu, Input
} from 'antd';
import moment from 'moment';
// import { DownOutlined, SearchOutlined } from '@ant-design/icons';

import empty from '@/assets/timeOffTableEmptyIcon.svg';
// import addAction from '@/assets/resource-action-add.svg';
import styles from './index.less';

class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // pageNavigation: '1',
      currentTime: moment(),
    };
  }

  componentDidMount = () => {
    this.setCurrentTime();
  };

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

  openViewTicket = (ticketID) => {
    const { data = [] } = this.props;
    let id = '';

    data.forEach((item) => {
      if (item.ticketID === ticketID) {
        id = item._id;
      }
    });

    if (id) {
      // history.push(`/offboarding/list/review/${id}`);
    }
  };

  handleSelect = (e) => {
    e.preventDefault();
  };

  render() {
    const {
      data = [],
      textEmpty = 'No resignation request is submitted',
      loading,
      pageSelected,
      size,
      getPageAndSize = () => {},
    } = this.props;
    const pagination = {
      position: ['bottomLeft'],
      total: data.length, // totalAll,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {data.length}
        </span>
      ),
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };
    const mapping = new Set();
    const rowRendered = (record, index) => {
      if (index === size - 1) {
        mapping.clear();
      }
    };
    const renderCell = (value, row) => {
      const obj = {
        children: value,
        props: {
          rowSpan: 0,
        },
      };
      const template = `${row.employeeId}_${value}`;
      if (!mapping.has(template)) {
        const count = data.filter((x) => x.employeeId === row.employeeId).length;
        mapping.add(template);
        obj.props.rowSpan = count;
      }
      return obj;
    };
    
    const localCompare = (a, b) => {
      if (!a && !b) {
        return 0;
      }
      if (!a && b) {
        return -1;
      }
      if (a && !b) {
        return 1;
      }
      return a.localeCompare(b);
    };
    const columns = [
      {
        title: 'Name',
        dataIndex: 'employeeName',
        key: 'userId',
        width: '12%',
        render: (value, row) => {
          return renderCell(value, row);
        },
        sorter: (a, b) => {
          return a.employeeName.localeCompare(b.employeeName);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: '10%',
        render: (value, row) => {
          return renderCell(value, row);
        },
        sorter: (a, b) => {
          return localCompare(a.division, b.division);
        },
        sortDirections: ['ascend', 'descend']
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        width: '12%',
        key: 'designation',
        render: (value, row) => {
          return renderCell(value, row);
        },
        sorter: (a, b) => {
          return localCompare(a.designation, b.designation)
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Experience',
        dataIndex: 'experience',
        width: '7%',
        render: (value, row) => {
          return renderCell(value, row);
        },
        sorter: (a, b) => {
          return a.experience - b.experience;
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Current Project',
        dataIndex: 'projectName',
        width: '10%',
        sorter: (a, b) => {
          return localCompare(a.projectName, b.projectName);
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Status',
        dataIndex: 'billStatus',
        width: '7%',
        key: 'priority',
        render: (billStatus) => {
          // if (priority === 'High') {
          //   return <span className={styles.priorityHigh}>{billStatus}</span>;
          // }
          // if (priority === 'Normal') {
          //   return <span className={styles.priorityMedium}>{billStatus}</span>;
          // }
          return <span className={styles.priorityLow}>{billStatus}</span>;
        },
        sorter: (a, b) => {
          return localCompare(a.billStatus, b.billStatus)
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Utilization',
        dataIndex: 'utilization',
        width: '6%',
        key: 'utilization',
        sorter: (a, b) => {
          return a.utilization - b.utilization;
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        width: '6%',
        key: 'subject',
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        width: '6%',
        key: 'subject',
      },
      {
        title: 'Actions',
        width: '6%',
        // dataIndex: 'subject',
        key: 'action',
        render: (value, row) => {
          const obj = {
            children: '',
            props: { rowSpan: 0 },
          };
          const template = `${row.employeeId}_add`;
          if (!mapping.has(template)) {
            const count = data.filter((x) => x.employeeId === row.employeeId).length;
            console.log(`count user record: ${count}`);
            mapping.add(template);
            obj.props.rowSpan = count;
            // return obj
          }
          console.log(`value: ${JSON.stringify(obj)}`);
          return obj;
          // {
          //   title: 'Actions',
          //   //dataIndex: 'subject',
          //   key: 'action',
          //   //render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
          //   render: (action) => (<Button.Group>
          //     <Button style={{marginRight: '15px', width: '45px', height: '45px',borderRadius: '50%'}} 
          //     onClick={() => this.showAlert(action)}>
          //       <img src={addAction} alt="attachIcon"/>
          //       </Button>
          //     <Button style={{width: '45px', height: '45px',borderRadius: '50%'}}>
          //       <img src={historyIcon} alt="historyIcon"/>
          //     </Button>
          //   </Button.Group>)
          // }
          // showAlert = (row) => {
          //   alert(JSON.stringify(row))
        
          //   // Modal.confirm({
          //   //   title: checkPropss
          //   // })
          // }
        
        },
      },
    ];

    return (
      <div className={styles.TableTickets}>
        <Table
          width="100%"
          locale={{
            emptyText: (
              <div className={styles.viewEmpty}>
                <img src={empty} alt="" />
                <p className={styles.textEmpty}>{textEmpty}</p>
              </div>
            ),
          }}
          loading={loading}
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={pagination}
          onChange={this.handleChangeTable}
          rowKey="id"
          onRow={rowRendered}
          scroll={{ x: 1500, y: 487 }}
        />
      </div>
    );
  }
}
export default TableTickets;

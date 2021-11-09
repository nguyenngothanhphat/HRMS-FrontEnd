import React, { PureComponent } from 'react';
import {
  Button,
  Table,
  // , Dropdown, Menu, Input
} from 'antd';
import moment from 'moment';
// import { DownOutlined, SearchOutlined } from '@ant-design/icons';

import empty from '@/assets/timeOffTableEmptyIcon.svg';
import addIcon from '@/assets/resource-action-add.svg';
import historyIcon from '@/assets/resource-management-edit.svg';

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
    const id = '';

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

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
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
    data.forEach((x, index) => {
      x.page = Math.floor(index / size) + 1;
      // console.log(`page item ${Math.floor(index / size)}`);
    });

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
    const showAlert = (row) => {
      alert(JSON.stringify(row));

      // Modal.confirm({
      //   title: checkPropss,
      // });
    };

    const mapping = new Set();
    const rowRendered = (record, index) => {
      // console.log(`row renders: ${ index} ${JSON.stringify(record)}`)
      if (index === size - 1) {
        // mapping.clear();
      }
    };
    const renderCell = (value, row, display) => {
      const obj = {
        children: display,
        props: {
          rowSpan: 0,
          class: styles.disableHover,
        },
      };
      const template = `${row.employeeId}_${pageSelected}_${value}`;
      // if(col) {
      //   console.log(`page ${pageSelected}`)
      // }

      if (!mapping.has(template)) {
        const count = data.filter((x) => {
          // console.log(JSON.stringify(x))
          return x.employeeId === row.employeeId && x.page === pageSelected;
        }).length;
        // console.log(`count: ${count}`)
        obj.props.rowSpan = count;
        mapping.add(template);
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
    const resourceStatusClass = (resourceStatus) => {
      try {
        console.log(resourceStatus);
        if (resourceStatus && resourceStatus.includes('Now')) {
          return 'now';
        }
        if (resourceStatus && resourceStatus.includes('Soon')) {
          return 'soon';
        }
        return 'available';
      } catch (ex) {
        return 'available';
      }
    };
    const columns = [
      {
        title: 'Name',
        dataIndex: 'employeeName',
        key: 'employeeName',
        width: '12%',
        render: (value, row) => {
          const statusClass = resourceStatusClass(row.availableStatus);
          const div = (
            <div className={styles.employeeName}>
              {value}
              <div>
                <div className={styles[statusClass]}>{row.availableStatus}</div>
              </div>
            </div>
          );
          return renderCell(value, row, div);
        },
        sorter: (a, b) => {
          return a.employeeName.localeCompare(b.employeeName);
        },
        className: 'right-left-border',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        width: '10%',
        render: (value, row) => {
          const display = <span className={styles.division}>{value}</span>;
          return renderCell(value, row, display);
        },
        sorter: (a, b) => {
          return localCompare(a.division, b.division);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        width: '12%',
        key: 'designation',
        render: (value, row) => {
          const display = <span className={styles.basicCellField}>{value}</span>;
          return renderCell(value, row, display);
        },
        sorter: (a, b) => {
          return localCompare(a.designation, b.designation);
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Experience',
        dataIndex: 'experience',
        width: '7%',
        render: (value, row) => {
          const display = <span className={styles.basicCellField}>{value}</span>;
          return renderCell(value, row, display);
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
        render: (value) => {
          const display = <span className={styles.employeeName}> {value}</span>;
          const obj = {
            children: display,
            props: {
              rowSpan: 1,
              className: 'left-border',
            },
          };
          return obj;
        },
        sorter: (a, b) => {
          // const templateA = a.projectName ? `${a.employeeId}_${a.projectName}` : a.projectName
          // const templateB = b.projectName ? `${b.employeeId}_${b.projectName}` : b.projectName
          // return localCompare(templateA, templateB);

          return localCompare(a.projectName, b.projectName);
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Status',
        dataIndex: 'billStatus',
        width: '6%',
        key: 'billStatus',
        render: (billStatus) => {
          return <span className={styles.basicCellField}> {billStatus}</span>;
        },
        sorter: (a, b) => {
          return localCompare(a.billStatus, b.billStatus);
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
        width: '7%',
        key: 'startDate',
        render: (value) => {
          return <span className={styles.basicCellField}>{value}</span>;
        },
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        width: '7%',
        key: 'endDate',
        render: (value) => {
          return <span className={styles.basicCellField}>{value}</span>;
        },
      },
      {
        title: 'Actions',
        width: '3%',
        // dataIndex: 'subject',
        key: 'action',
        render: (value, row, col) => {
          const buttonGroup = (
            <Button.Group>
              <Button
                style={{ marginRight: '15px', width: '45px', height: '45px', borderRadius: '50%' }}
                onClick={() => showAlert(value)}
              >
                <img src={addIcon} alt="attachIcon" />
              </Button>
              <Button style={{ width: '45px', height: '45px', borderRadius: '50%' }}>
                <img src={historyIcon} alt="historyIcon" />
              </Button>
            </Button.Group>
          );
          const obj = renderCell('add', row, buttonGroup);
          if (col === size - 1) {
            mapping.clear();
          }
          return obj;
        },
        className: 'right-left-border',
      },
    ];

    return (
      <div className={styles.TableResources}>
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
          onChange={this.onTableChange}
          rowKey="id"
          onRow={rowRendered}
          scroll={{ y: 500 }}
        />
      </div>
    );
  }
}
export default TableTickets;

import React, { PureComponent } from 'react';
import {
  Table,
  Row,
  Col,
  Button
} from 'antd';
import moment from 'moment';
import { PlusCircleFilled } from '@ant-design/icons';
import {formatMessage} from 'umi'
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import AddActionBTN from './components/Add';
import EditActionBTN from './components/Edit';
import styles from './index.less';
import ProjectProfile from '../ComplexView/components/PopoverProfiles/components/ProjectProfile';
import UserProfile from '../ComplexView/components/PopoverProfiles/components/UserProfile';
import CommonModal from '@/components/CommonModal';
class TableResources extends PureComponent {
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

  handleSelect = (e) => {
    e.preventDefault();
  };

  onTableChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  parseDate = (dateText) => {
    if(!dateText) {
      return '-'
    }
    return moment(dateText).format('MM/DD/YYYY')
  }

  handleLongText = (text, length) => {
    console.log(`text: ${text}`)
    if(!text) {
      return ''
    }
    if (text.length < length) {
      return text;
    }

    const formatText = text.substring(0, length)
    return `${formatText}...${formatText.includes('(') ? ')' : ''}`
  }

  cloneObj = (obj) => {
    const newObj = {}
    // eslint-disable-next-line no-restricted-syntax
    for(const [key, value] of Object.entries(obj)) {
      newObj[key] = value
    }
    return newObj
  }

  formatResource = (resourceList) => {
    const { projectList } = this.props
    // console.log('formating resource')
    const dataList = [];
    // eslint-disable-next-line no-restricted-syntax
    resourceList.forEach((obj, index) => {
      const { departmentInfo, titleInfo, generalInfo, projects} = obj;
      const availableStatus = 'Available Now'
      const userName = generalInfo.workEmail.substring(0, generalInfo.workEmail.indexOf('@'))
      const employeeName = `${ generalInfo.firstName } ${generalInfo.firstName} ${ userName ? (`(${  userName  })`) : ''}`;
      const newObj = {
        employeeId: obj._id,
        employeeName: this.handleLongText(employeeName.trim(), 25),
        availableStatus,
        division: departmentInfo.name,
        designation: titleInfo.name,
        experience: generalInfo.totalExp,
        projectName: '-',
        utilization: 0,
        billStatus: '-',
        startDate: '-',
        endDate: '-',
        comment: ''
      };
      if(projects.length === 0){
        if(index % 2 === 0) {
          projects.push(
            {name: 'Abc Project', billStatus: 'Billing', utilization: 50},
          )
          projects.push(
            {name: 'Abc Project 2', billStatus: 'Billing', utilization: 50},
          )
        }
      }
      let ability = 0
      // eslint-disable-next-line no-restricted-syntax
      for(const p of projects) {
        ability += p.utilization
      }
      newObj.availableStatus = ability < 100 ? 'Available Now' : 'Available Soon'
      console.log(`project length ${  projects.length}`)
      if(projects.length === 0) {
        dataList.push(newObj);
      } else {
        // eslint-disable-next-line no-restricted-syntax
        for(const p of projects) {
          const project = projectList.find(x => x.id === p.projectId)
          console.log(`loop in projects: ${ JSON.stringify(p) }`)
          const pObj = this.cloneObj(newObj)
          pObj.projectName = project.name || '-'
          pObj.utilization = p.utilization || 0
          pObj.startDate = this.parseDate(p.startDate)
          pObj.endDate = this.parseDate(p.endDate)
          pObj.billStatus = p.billStatus || '-'
          pObj.project = project
          dataList.push(pObj);
        }
      }
    })
    // for (const obj, index of resourceList) {
    console.log(`formatDataSource: ${JSON.stringify(dataList)}`);
    return dataList;
  };

  render() {
    const {
      data = [],
      textEmpty = 'No resignation request is submitted',
      loading,
      total,
      pageSelected,
      size,
      getPageAndSize,
    } = this.props;
    // const formatData = this.formatResource(data)
    const pagination = {
      position: ['bottomLeft'],
      total, // totalAll,
      showTotal: () => (
        <span>
          Showing{' '}
          <b>
            {(pageSelected-1) * size} - {pageSelected * size}
          </b>{' '}
          of {total}
        </span>
      ),
      pageSize: data.length,
      current: pageSelected,
      onChange: (page) => getPageAndSize(page, size),
    };

    const mapping = new Set();

    const renderCell = (value, row, display) => {
      const obj = {
        children: display,
        props: {
          rowSpan: 0,
          className: styles.disableHover,
        },
      };
      const template = `${row.employeeId}_${value}`;
      if (!mapping.has(template)) {
        const count = data.filter((x) => {
          return x.employeeId === row.employeeId;
        }).length;
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
        // width: '12%',
        render: (value, row) => {
          const statusClass = resourceStatusClass(row.availableStatus);
          const div = (
            <div>
              <div>
                <div className={styles.resourceStatus}>
                  <span className={styles[statusClass]}>{row.availableStatus}</span>
                </div>
              </div>
              <UserProfile placement="leftTop">
                <div className={styles.employeeName}>{value}</div>
              </UserProfile>
              
            </div>
          );
          return renderCell(value, row, div);
        },
        sorter: (a, b) => {
          return a.employeeName.localeCompare(b.employeeName);
        },
        fixed: 'left',
        className: 'firstColumn',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        // width: '10%',
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
        // width: '12%',
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
        // width: '7%',
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
        // width: '10%',
        render: (value, row) => {
          const employeeRowCount = data.filter(x => x.employeeId === row.employeeId).length
          const display = <ProjectProfile placement="leftTop"><span className={styles.employeeName}> {value}</span></ProjectProfile>;
          const obj = {
            children: display,
            props: {
              rowSpan: 1,
              className: employeeRowCount > 1 ? 'left-border' : '',
            },
          };
          return obj;
        },
        sorter: (a, b) => {
          return localCompare(a.projectName, b.projectName);
        },
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Status',
        dataIndex: 'billStatus',
        // width: '6%',
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
        // width: '6%',
        key: 'utilization',
        sorter: (a, b) => {
          return a.utilization - b.utilization;
        },
        // defaultSortOrder: 'ascend',
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: (<div className={styles.dateHeaderContainer}><div>Start Date</div><div>(MM/dd/yyyy)</div></div>),
        dataIndex: 'startDate',
        // width: '7%',
        key: 'startDate',
        render: (value) => {
          return <span className={styles.basicCellField}>{value}</span>;
        },
      },
      {
        title: (<div className={styles.dateHeaderContainer}><div>End Date</div><div>(MM/dd/yyyy)</div></div>),
        dataIndex: 'endDate',
        // width: '7%',
        key: 'endDate',
        render: (value) => {
          return <span className={styles.basicCellField}>{value}</span>;
        },
      },
      {
        title: (<div className={styles.dateHeaderContainer}><div>Revised End Date</div><div>(MM/dd/yyyy)</div></div>),
        dataIndex: 'endDate',
        // width: '7%',
        key: 'revisedEndDate',
        render: (value) => {
          return <span className={styles.basicCellField}>{value}</span>;
        },
      },
      {
        title: 'Comment',
        // width: '10%',
        dataIndex: 'comment',
        key: 'comment',
        render: (value, row) => {
          const employeeRowCount = data.filter(x => x.employeeId === row.employeeId).length
          let text
          if(value) {
            text = (<span className={styles.comment}>{value}</span>)
          } else {
            text = (
              <span><CommonModal data={row} /></span>
            );
          }
          const obj = renderCell('comment', row, text);
          obj.props.className = employeeRowCount > 1 ? 'left-border' : '';
          return obj;
        },
        // className: 'right-left-border',
      },
      {
        title: 'Actions',
        // width: '3%',
        // dataIndex: 'subject',
        key: 'action',
        render: (value, row, col) => {
          // const buttonGroup = actionAddAndEdit(row);
          const buttonGroup = (
            <span>
              <AddActionBTN dataPassRow={row} /> <EditActionBTN dataPassRow={row} />
            </span>
          );
          const obj = renderCell('add', row, buttonGroup);
          if (col === data.length - 1) {
            mapping.clear();
          }
          return obj;
        },
        className: 'right-left-border',
        fixed: 'right'
      },
    ];

    return (
      <div className={styles.TableResources}>
        <Table
          // width="100%"
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
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}
export default TableResources;

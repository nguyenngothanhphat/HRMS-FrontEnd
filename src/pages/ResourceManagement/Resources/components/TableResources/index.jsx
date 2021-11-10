
import React, { PureComponent, useState } from 'react';
import { Table, Row, Col, Button, Modal, Form, Input, Select, DatePicker, Tooltip, Card} from 'antd';
const { TextArea } = Input;
import moment from 'moment';
import { InfoCircleOutlined } from '@ant-design/icons';
import addAction from '@/assets/resource-action-add1.svg';
import historyIcon from '@/assets/resource-management-edit1.svg';
import datePickerIcon from '@/assets/resource-management-datepicker.svg'
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import styles from './index.less';

class TableTickets extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // pageNavigation: '1',
      currentTime: moment(),
    };
    // this.showModal= this.showModal.bind(this);
    // this.handleOk = this.handleOk.bind(this);
    // this.handleCancel = this.handleCancel.bind(this);
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
        currentTime: moment()
      });
    }
  };
  actionAddAndEdit = (row) => {
    const [visible, setVisible] = useState(false);
    function showModal () {
      setVisible(true);
    }

    function handleOk (event) {
      setVisible(false);
    }

    function handleCancel () {
      setVisible(false);
    }
    return <div>
    <img src={addAction} alt="attachIcon" onClick={showModal} className={styles.buttonAdd}/>       
    <Modal
    title="Assign to project"
    width="60%"
    visible={visible}
    onOk={handleOk}
    onCancel={handleCancel}
    okText='Assign to project'
    cancelButtonProps={{ style: { color: 'red', border: '1px solid white' } }}
    okButtonProps={{style: {background: '#FFA100', border: '1px solid #FFA100', color: 'white', borderRadius: '25px'}}}
  >
    <Form layout='vertical'>
    <Row>
      <Col span={12}>
        <Form.Item label='Project' name="project">  
          <Select defaultValue={row.projectName} style={{ width: '95%', borderRadius: '8px' }}>
            <Option value="jack">project 0</Option>
            <Option value="lucy">project 1</Option>
            <Option value="Yiminghe">project 2</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Status'>
          <Select defaultValue={row.projectName} style={{ width: '95%', borderRadius: '8px' }}>
            <Option value="jack">project 0</Option>
            <Option value="lucy">project 1</Option>
            <Option value="Yiminghe">project 2</Option>
          </Select>
        </Form.Item>
        <Form.Item label='Bandwith Allocation (%)'>
        <Input placeholder="100" style={{width: '95%'}}
          suffix={
            <Tooltip title="Extra information">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
        />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item label='Start Date'>
          <DatePicker placeholder='Enter Start Date' picker="week" 
          style={{width: '95%', borderRadius: '8px', color: 'blue'}}
          suffixIcon={<img src={datePickerIcon}/>}/>
        </Form.Item>
        <Form.Item label='End Date*'>
          <DatePicker placeholder='Enter End Date' picker="week" 
          style={{width: '95%', borderRadius: '8px', color: 'blue'}}
          suffixIcon={<img src={datePickerIcon}/>}/>
        </Form.Item>
      </Col>
    </Row>    
    <Form.Item label='Comments (optional)'>
      <TextArea placeholder="Enter Comments"
        autoSize={{ minRows: 4, maxRows: 8 }}
      />
    </Form.Item>  
    <p style={{color: 'lightgray'}}>*Tentative End Date</p>
    <Form.Item label='Project Detail'>
    <Card style={{background: '#F6F7F9'}}>
      <Row>
        <Col span={12}>
          <p>Customer: <span style={{color: '#2C6DF9'}}> {row.employeeName}</span></p> 
          <p>Project: <span style={{color: '#2C6DF9'}}> {row.projectName}</span></p> 
          <p>Engagement Type: <span style={{color: '#2C6DF9'}}> {row.billStatus}</span></p> 
          <p>Start Date: <span style={{color: '#2C6DF9'}}> {row.startDate}</span></p> 
          <p>End Date: <span style={{color: '#2C6DF9'}}> {row.endDate}</span></p>  
        </Col>
        <Col span={12}>
          <Row>
            <Col span={12}>
              Current resource allocation :
            </Col>
            <Col span={12}>
              <p>2/3 UX Designers (Billable)</p>
              <p>1/2 UI Designer (Billable)</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
    </Form.Item>
    </Form>
  </Modal> 
  <img src={historyIcon} alt="historyIcon" className={styles.buttonEdit}/>
  </div>
  }
  //state = { visible: false }
  // showModal = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // }
  // handleOk = (e) => {
  //   console.log(e);
  //   this.setState({
  //     visible: false,
  //   });
  // }
  // handleCancel = (e) => {
  //   console.log(e);
  //   this.setState({
  //     visible: false,
  //   });
  // }
  // showAlert = (row) => {
  //   alert(JSON.stringify(row))
  // }

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
          const buttonGroup = this.actionAddAndEdit(row);
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

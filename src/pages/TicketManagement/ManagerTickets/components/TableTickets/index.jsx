import React, { PureComponent } from 'react';
import { Table, Dropdown, Button, Menu, Input } from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';
import empty from '@/assets/timeOffTableEmptyIcon.svg';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import { getCurrentTimeOfTimezoneOption } from '@/utils/times';
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
      history.push(`/offboarding/list/review/${id}`);
    }
  };
  
  render() {
    const pagination = {
      position: ['bottomLeft'],
      total: 30, //totalAll,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          of {data.length}
        </span>
      ),
      pageSize: 10, //size
      current: 1, //pageSelected,
      onChange: (page, pageSize) => {
        //getPageAndSize(page, pageSize);
      },
    };
    //dropdown select
    const children = [];
  for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }
    const menu = (
      <Menu>
        <div className="inputSearch">
           <Input 
            placeholder="Search by name" 
            prefix={<SearchOutlined />} 
           />
        </div>
        <Menu.Divider />
        <Menu.Item> Lewis Tuan</Menu.Item>
        <Menu.Item>Vo Nghia</Menu.Item>
      </Menu>
    );
    // Thay thế data khi co du lieu
    const columns = [
        {
            title: 'Ticket ID',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'User ID',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Name',
            dataIndex: 'address',
            key: '1',
        },
        {
            title: 'Request Date',
            dataIndex: 'address',
            key: '2',
        },
        {
            title: 'Request Type',
            dataIndex: 'address',
            key: '3',
        },
        {
            title: 'Priority',
            dataIndex: 'address',
            key: '4',
        },
        {
            title: 'Loacation',
            dataIndex: 'address',
            key: '5',
        },
        {
            title: 'Subject',
            dataIndex: 'address',
            key: '6',
        },
        {
            title: 'Assign To',
            key: 'operation',
            fixed: 'right',
            render: () => {
              return (
                <Dropdown overlayClassName="dropDown" overlay={ menu } trigger={['click']}>
                  <div onClick={e => e.preventDefault()}>
                    Select User &emsp;
                    <DownOutlined/>
                  </div>
              </Dropdown>
              )
            }
        },
    ];
    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            key: i,
            name: `Edrward ${i}`,
            age: 32,
            address: `London Park no. ${i}`,
        });
    }

    return (
      <div className={styles.TableTickets}>
            <Table
                columns={columns}
                dataSource={data}
                scroll={{ x: 1500, y: 487 }}
                pagination={{
                    ...pagination,
                    total: 30,
                }}
            />
        </div>
    );
  }
}
export default TableTickets;

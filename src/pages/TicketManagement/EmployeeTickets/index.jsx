import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TicketQueue from './components/TicketQueue';
import MyTickets from './components/MyTickets';
import styles from './index.less';

@connect(
  ({
    ticketManagement: { listOffAllTicket = [], totalList = [] } = {},
    user: { currentUser: { employee = {} } = {} } = {},
  }) => ({
    employee,
    listOffAllTicket,
    totalList,
  }),
)
class EmployeeTicket extends Component {
  componentDidMount() {
    const {
      tabName = '',
      employee: {
        departmentInfo: { _id: idDepart = '' },
      },
      employee: { _id = '' } = {},
    } = this.props;
    if (!tabName) {
      history.replace(`/ticket-management/ticket-queue`);
    } else {
      const { dispatch } = this.props;
      if (!dispatch) {
        return;
      }
      dispatch({
        type: 'ticketManagement/fetchListEmployee',
        payload: {},
      });
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {
          employeeAssignee: _id,
          departmentAssign: idDepart,
        },
      });
    }
  }

  handleChangeTable = (key) => {
    history.push(`/ticket-management/${key}`);
    const {
      dispatch,
      employee: { _id = '' },
      employee: { departmentInfo: { _id: idDepart = '' } = {} },
    } = this.props;
    if (key === 'ticket-queue') {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {
          employeeAssignee: _id,
          departmentAssign: idDepart,
        },
      });
    } else {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['Assigned'],
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {
          employeeAssignee: _id,
          departmentAssign: idDepart,
        },
      });
    }
  };

  render() {
    const { TabPane } = Tabs;
    const { listOffAllTicket = [], totalList = [] } = this.props;
    const { tabName = '' } = this.props;
    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'ticket-queue'}
            onChange={(key) => {
              this.handleChangeTable(key);
            }}
          >
            <TabPane tab="TicketQueue" key="ticket-queue">
              <TicketQueue data={listOffAllTicket} countData={totalList} />
            </TabPane>
            <TabPane tab="MyTickets" key="my-tickets">
              <MyTickets data={listOffAllTicket} countData={totalList} />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default EmployeeTicket;

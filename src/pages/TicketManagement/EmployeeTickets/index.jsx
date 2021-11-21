import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TicketQueue from './components/TicketQueue';
import MyTickets from './components/MyTickets';
import styles from './index.less';

@connect(({ ticketManagement: { listOffAllTicket = [], totalList = [] } = {} }) => ({
  listOffAllTicket,
  totalList,
}))
class EmployeeTicket extends Component {
  componentDidMount() {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`/ticket-management/ticket-queue`);
    } else {
      const { dispatch } = this.props;
      if (!dispatch) {
        return;
      }
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {},
      });
    }
  }

  handleChangeTable = (key) => {
    history.push(`/ticket-management/${key}`);
    const { dispatch } = this.props;
    if (key === 'ticket-queue') {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
        },
      });
    } else {
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['Assigned'],
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

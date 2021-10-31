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
      history.replace(`/ticket-management/alltickets`);
    } else {
      const { dispatch } = this.props;
      if (!dispatch) {
        return;
      }
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: 'New',
        },
      });
      dispatch({
        type: 'ticketManagement/fetchToTalList',
        payload: {},
      });
    }
  }

  render() {
    const { TabPane } = Tabs;
    const { listOffAllTicket = [], totalList = [] } = this.props;
    const { tabName = '' } = this.props;
    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'ticketqueue'}
            onChange={(key) => {
              history.push(`/ticket-management/${key}`);
            }}
          >
            <TabPane tab="TicketQueue" key="ticketqueue">
              <TicketQueue data={listOffAllTicket} countData={totalList} />
            </TabPane>
            <TabPane tab="MyTickets" key="mytickets">
              <MyTickets data={listOffAllTicket} countData={totalList} />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default EmployeeTicket;

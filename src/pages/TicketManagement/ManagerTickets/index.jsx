import { Tabs } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import AllTicket from './components/AllTickets';
import styles from './index.less';

@connect(({ ticketManagement: { listOffAllTicket = [], totalList = [] } = {} }) => ({
  listOffAllTicket,
  totalList,
}))
class ManagerTicket extends Component {
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

    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey="all-tickets"
            onChange={(key) => {
              history.push(`/ticket-management/${key}`);
            }}
          >
            <TabPane tab="Overview" key="overview">
              {/* <OverView /> */}
            </TabPane>
            <TabPane tab="All Tickets" key="all-tickets">
              <AllTicket data={listOffAllTicket} countData={totalList} />
            </TabPane>
          </Tabs>
        </PageContainer>
      </div>
    );
  }
}

export default ManagerTicket;

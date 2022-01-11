import { Tabs } from 'antd';
import React, { Component } from 'react';
import { connect, history } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import AllTicket from './components/AllTickets';
import styles from './index.less';
import WorkInProgress from '@/components/WorkInProgress';

@connect(({ ticketManagement: { listOffAllTicket = [], totalList = [] } = {} }) => ({
  listOffAllTicket,
  totalList,
}))
class ManagerTicket extends Component {
  componentDidMount() {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`/ticket-management/all-tickets`);
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
        type: 'ticketManagement/fetchToTalList',
        payload: {},
      });
      dispatch({
        type: 'ticketManagement/fetchLocationList',
        payload: {},
      });
      dispatch({
        type: 'ticketManagement/fetchListAllTicket',
        payload: {
          status: ['New'],
        },
      });
    }
  }

  render() {
    const { TabPane } = Tabs;
    const { listOffAllTicket = [], totalList = [], tabName = '' } = this.props;

    if (!tabName) return '';
    return (
      <div className={styles.TicketManagement}>
        <PageContainer>
          <Tabs
            activeKey={tabName || 'all-tickets'}
            onChange={(key) => {
              history.push(`/ticket-management/${key}`);
            }}
          >
            <TabPane tab="Overview" key="overview">
              <WorkInProgress />;
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

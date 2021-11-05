import React, { Component } from 'react';
import { Tabs } from 'antd';
import { history, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import TicketQueue from './components/TicketQueue';
import MyTickets from './components/MyTickets';
import styles from './index.less';

const { TabPane } = Tabs;
const baseModuleUrl = '/resource-management'

class EmployeeTicket extends Component {

    componentDidMount() {
        const { tabName = '' } = this.props;
        if (!tabName) {
            history.replace(`${baseModuleUrl}/all-resources`);
        }
    }

    render() {
        const { tabName = '' } = this.props;
        return (
          <div className={styles.ResourceManagement}>
            <PageContainer>
              <Tabs
                activeKey={tabName || 'ticketqueue'}
                onChange={(key) => {
                            history.push(`${baseModuleUrl}/${key}`);
                        }}
              >
                <TabPane tab="TicketQueue" key="ticketqueue">
                  <TicketQueue />
                </TabPane>
                <TabPane tab="MyTickets" key="mytickets">
                  <MyTickets />
                </TabPane>
              </Tabs>
            </PageContainer>
          </div>
        )
    }
}

export default EmployeeTicket
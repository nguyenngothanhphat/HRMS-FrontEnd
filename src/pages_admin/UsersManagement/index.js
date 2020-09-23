import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { formatMessage } from 'umi';
import { Tabs } from 'antd';
import styles from './index.less';
import TableContainer from './components/TableContainer';

export default class UsersManagement extends PureComponent {
  operations = () => {
    return <div />;
  };

  render() {
    const { TabPane } = Tabs;
    return (
      <PageContainer>
        <div className={styles.containerUsers}>
          <Tabs defaultActiveKey="1" tabBarExtraContent={this.operations()}>
            <TabPane tab={formatMessage({ id: 'pages_admin.users.title' })} key="1">
              <TableContainer />
            </TabPane>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}

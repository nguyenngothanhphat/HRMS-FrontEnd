import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { history } from 'umi';
import { Tabs } from 'antd';
import HRrequestTable from './component/HrRequestTable';
import RelievingFormalities from './component/RelievingFormalities';
import Settings from './component/Settings';
import styles from './index.less';

class HROffboarding extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const { tabName = '' } = this.props;

    return (
      <PageContainer>
        <div className={styles.containerEmployeeOffboarding}>
          <div className={styles.tabs}>
            <Tabs
              activeKey={tabName || 'list'}
              onChange={(key) => {
                history.push(`/offboarding/${key}`);
              }}
            >
              <TabPane tab="Terminate work relationship" key="list">
                <div className={styles.paddingHR}>
                  <HRrequestTable onChangeTab={this.onChangeTab} />
                </div>
              </TabPane>
              <TabPane tab="Relieving Formalities" key="hr-relieving-formalities">
                <RelievingFormalities />
              </TabPane>
              <TabPane tab="Settings" key="settings">
                <Settings />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default HROffboarding;

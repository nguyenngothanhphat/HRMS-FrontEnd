import React, { PureComponent } from 'react';
import { history } from 'umi';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import HRrequestTable from './component/HrRequestTable';
import RelievingFormalities from './component/RelievingFormalities';
import Settings from './component/Settings';
import styles from './index.less';

class HROffboarding extends PureComponent {
  componentDidMount = () => {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`/offboarding/list`);
    }
  };

  render() {
    const { TabPane } = Tabs;
    const { tabName = '', type = '' } = this.props;

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
                <Settings type={type} />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default HROffboarding;

import React, { PureComponent } from 'react';
import { history } from 'umi';
import { Tabs } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import HrRequestTable from './components/HrRequestTable';
import RelievingFormalities from './components/RelievingFormalities';
import Settings from './components/Settings';
import styles from './index.less';

class HRView extends PureComponent {
  componentDidMount = () => {
    const { tabName = '' } = this.props;
    if (!tabName) {
      history.replace(`/offboarding`);
    }
  };

  render() {
    const { TabPane } = Tabs;
    const { tabName = '', type = '' } = this.props;
    if (!tabName) return '';
    return (
      <PageContainer>
        <div className={styles.HRView}>
          <div className={styles.tabs}>
            <Tabs
              activeKey={tabName || 'list'}
              onChange={(key) => {
                history.push(`/offboarding/${key}`);
              }}
            >
              <TabPane tab="Terminate work relationship" key="list">
                <div className={styles.paddingHR}>
                  <HrRequestTable onChangeTab={this.onChangeTab} />
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

export default HRView;

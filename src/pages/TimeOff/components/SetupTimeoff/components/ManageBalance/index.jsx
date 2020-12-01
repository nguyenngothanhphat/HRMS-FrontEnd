import React, { PureComponent } from 'react';
// import FileUploadIcon from '@/assets/dropImage.svg';
// import icon from '@/assets/svgIcon.svg';
import { Tabs } from 'antd';
import SwitchTab from './components/Switch';
import styles from './index.less';

const { TabPane } = Tabs;

class ManageBalance extends PureComponent {
  render() {
    return (
      <div className={styles.balance}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Switch" key="1">
            <SwitchTab />
          </TabPane>
          <TabPane tab="Import Data" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ManageBalance;

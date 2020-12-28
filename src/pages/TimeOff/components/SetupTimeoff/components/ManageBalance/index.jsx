import React, { PureComponent } from 'react';
// import FileUploadIcon from '@/assets/dropImage.svg';
// import icon from '@/assets/svgIcon.svg';
import { Tabs } from 'antd';
import SwitchTab from './components/Switch';
// import ImportData from './components/ImportData';
import styles from './index.less';

const { TabPane } = Tabs;

class ManageBalance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
    };
  }

  callback = (key) => {
    this.setState({
      tabId: key,
    });
  };

  render() {
    const { tabId } = this.state;
    return (
      <div className={styles.balance}>
        <Tabs defaultActiveKey="1" onTabClick={this.callback}>
          <TabPane tab="Switch" key="1">
            <SwitchTab tab={tabId} />
          </TabPane>
          <TabPane tab="Import Data" key="2">
            <SwitchTab tab={tabId} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ManageBalance;

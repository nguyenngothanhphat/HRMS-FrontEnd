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
      name: 'Switch',
      content: 'Keep current employee timeoff balances, but move them to new policies',
    };
  }

  callback = (key) => {
    const text = 'Import new timeoff balances for employees.';
    this.setState({
      tabId: key,
      name: key === '1' ? 'Switch' : 'Import Data',
      content:
        key === '1'
          ? 'Keep current employee timeoff balances, but move them to new policies'
          : text,
    });
  };

  render() {
    const { tabId, name, content } = this.state;
    return (
      <div className={styles.balance}>
        <span className={styles.titleText}>Manage existing & future Timeoff employee balances</span>
        <Tabs defaultActiveKey="1" onTabClick={this.callback}>
          <TabPane tab="Switch" key="1" className={styles.balanceTab}>
            <div style={{ marginTop: '20px' }}>
              <SwitchTab tab={tabId} name={name} content={content} />
            </div>
          </TabPane>
          <TabPane tab="Import Data" key="2">
            <div style={{ marginTop: '20px' }}>
              <SwitchTab tab={tabId} name={name} content={content} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default ManageBalance;

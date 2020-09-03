import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';

class Tab extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const { tabs = [] } = this.props;
    return (
      <Tabs defaultActiveKey="1" className={styles.Tab}>
        {tabs.map((tab) => {
          return <TabPane tab={tab.name} key={tab.id} />;
        })}
      </Tabs>
    );
  }
}

export default Tab;

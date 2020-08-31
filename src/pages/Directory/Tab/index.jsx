import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { Tabs } from 'antd';

class Tab extends PureComponent {
  render() {
    const { TabPane } = Tabs;
    const { tabs } = this.props;
    return (
      <Tabs defaultActiveKey="1" className={styles.Tab}>
        {tabs.map((tab) => {
          return <TabPane tab={tab.name} key={tab.id}></TabPane>;
        })}
      </Tabs>
    );
  }
}

Tab.propTypes = {
  tabs: PropTypes.array.isRequired,
};

export default Tab;

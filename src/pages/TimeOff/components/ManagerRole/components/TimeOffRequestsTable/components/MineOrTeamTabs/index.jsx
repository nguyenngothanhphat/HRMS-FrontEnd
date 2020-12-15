import React, { PureComponent } from 'react';
import { Tabs, Spin } from 'antd';
import TimeOffRequestTab from '../TimeOffRequestTab';
import styles from './index.less';

const { TabPane } = Tabs;

class MineOrTeamTabs extends PureComponent {
  renderLoading = () => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '155px 0',
          // height: '310px',
        }}
      >
        <Spin size="medium" />
      </div>
    );
  };

  render() {
    const { data1 = [], data2 = [], type = 0, loadingData } = this.props;
    return (
      <div className={styles.MineOrTeamTabs}>
        <Tabs
          tabPosition="top"
          tabBarGutter={40}
          defaultActiveKey="1"
          // onTabClick={this.onTabClick}
        >
          <TabPane tab="Team Leave Request" key="1">
            {!loadingData ? (
              <TimeOffRequestTab data={data1} type={type} category="TEAM" />
            ) : (
              this.renderLoading()
            )}
          </TabPane>
          <TabPane tab="My Leave Request" key="2">
            {!loadingData ? (
              <TimeOffRequestTab data={data2} type={type} category="MY" />
            ) : (
              this.renderLoading()
            )}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default MineOrTeamTabs;

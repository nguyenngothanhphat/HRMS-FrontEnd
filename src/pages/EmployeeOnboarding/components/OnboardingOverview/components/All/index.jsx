import React, { Component } from 'react';
import { Tabs, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';

import { PROCESS_STATUS } from '@/utils/onboarding';
import styles from './index.less';

const { TabPane } = Tabs;

@connect()
class OnboardingAll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.fetchOnboardingAll();
  };

  fetchOnboardingAll = () => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboard/fetchOnboardListAll',
        payload: {
          processStatus: PROCESS_STATUS.ALL,
          //   name: nameSearch,
        },
      });
    }
  };

  render() {
    return (
      <div className={styles.AllDrafts}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey="all"
            tabBarExtraContent={
              <Input
                onChange={this.onChange}
                placeholder="Search by candidate ID"
                prefix={<SearchOutlined />}
              />
            }
          >
            <TabPane tab="all" key="1">
              {/* <AllTab
                list={dataAll}
                loading={loadingAll}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              /> */}
              abc
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default OnboardingAll;

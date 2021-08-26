import React, { Component } from 'react';
import { Tabs, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';

import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import AllTab from './components/AllTab';

import styles from './index.less';

const { TabPane } = Tabs;

@connect(
  ({ loading, onboarding: { onboardingOverview: { dataAll = [], total = 0 } = {} } = {} }) => ({
    dataAll,
    total,
    loadingAll: loading.effects['onboarding/fetchOnboardListAll'],
  }),
)
class OnboardingAll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      size: 10,
      // nameSearch: '',
    };
  }

  componentDidMount = () => {
    this.fetchOnboardingAll();
  };

  fetchOnboardingAll = () => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardListAll',
        payload: {
          processStatus: NEW_PROCESS_STATUS.ALL_TEMP,
          //   name: nameSearch,
        },
      });
    }
  };

  render() {
    const { dataAll = [], total = 0, loadingAll } = this.props;
    const { pageSelected, size } = this.state;

    return (
      <div className={styles.onboardingAll}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey="all"
            tabBarExtraContent={
              <Input onChange={this.onChange} placeholder="Search" prefix={<SearchOutlined />} />
            }
          >
            <TabPane tab="all" key="1">
              <AllTab
                list={dataAll}
                loading={loadingAll}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
              abc
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default OnboardingAll;

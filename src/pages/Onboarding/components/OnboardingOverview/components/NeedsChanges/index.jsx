import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import NeedsChangesTab from './components/NeedsChangesTab';

import styles from '../index.less';
import SearchOnboarding from '../SearchOnboarding';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    onboarding: { onboardingOverview: { needsChanges = [], total = 0 } = {} } = {},
  }) => ({
    needsChanges,
    total,
    loading: loading.effects['onboarding/fetchOnboardList'],
  }),
)
class NeedsChanges extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      size: 10,
      nameSearch: '',
      loadingSearch: false,
    };

    this.setDebounce = debounce((nameSearch) => {
      this.setState({
        nameSearch,
      });
    }, 500);
  }

  componentDidMount = () => {
    this.fetchOnboardingNeedsChanges('');
  };

  componentDidUpdate = (prepProps, prepStates) => {
    const { nameSearch } = this.state;
    if (prepStates.nameSearch !== nameSearch) {
      this.fetchOnboardingNeedsChanges(nameSearch);
    }
  };

  fetchOnboardingNeedsChanges = (nameSearch = '') => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardList',
        payload: {
          processStatus: [NEW_PROCESS_STATUS.NEEDS_CHANGES],
          name: nameSearch,
        },
      }).then(({ statusCode }) => {
        if (statusCode === 200) {
          this.setState({ loadingSearch: false });
        }
      });
    }
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  onChangeSearch = (value) => {
    const formatValue = value.toLowerCase();
    // this.setState({ loadingSearch: true });
    this.setDebounce(formatValue);
  };

  render() {
    const { needsChanges: data = [], total = 0, loading } = this.props;
    const { tabId, pageSelected, size, loadingSearch } = this.state;

    return (
      <div className={styles.onboardingTab}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey={tabId}
            onChange={this.onChangeTab}
            tabBarExtraContent={<SearchOnboarding onChangeSearch={this.onChangeSearch} />}
          >
            <TabPane key="1">
              <NeedsChangesTab
                list={data}
                loading={loading}
                loadingSearch={loadingSearch}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={total}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default NeedsChanges;

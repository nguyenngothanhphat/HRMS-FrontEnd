import React, { Component } from 'react';
import { Tabs } from 'antd';
import { connect } from 'umi';
import { debounce } from 'lodash';

import AllTab from './components/AllTab';
import styles from '../index.less';
import SearchFilterBar from '../SearchFilterBar';
import { NEW_PROCESS_STATUS } from '@/constants/onboarding';

const { TabPane } = Tabs;

@connect(
  ({ loading, onboarding: { onboardingOverview: { dataAll = [], total = 0 } = {} } = {} }) => ({
    dataAll,
    total,
    loadingAll: loading.effects['onboarding/fetchOnboardListAll'],
    loadingFilter: loading.effects['onboarding/filterOnboardList'],
  }),
)
class OnboardingAll extends Component {
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
    this.fetchOnboardingAll('');
  };

  componentDidUpdate = (prepProps, prepStates) => {
    const { nameSearch } = this.state;
    if (prepStates.nameSearch !== nameSearch) {
      this.fetchOnboardingAll(nameSearch);
    }
  };

  fetchOnboardingAll = (nameSearch = '') => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardListAll',
        payload: {
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
    const { dataAll = [], loadingAll, loadingFilter } = this.props;
    const { pageSelected, size, loadingSearch } = this.state;

    const listDataInProgress = dataAll.filter(
      (x) =>
        ![
          NEW_PROCESS_STATUS.JOINED,
          NEW_PROCESS_STATUS.OFFER_REJECTED,
          NEW_PROCESS_STATUS.OFFER_WITHDRAWN,
        ].includes(x.processStatus),
    );

    return (
      <div className={styles.onboardingTab}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey="all"
            tabBarExtraContent={<SearchFilterBar onChangeSearch={this.onChangeSearch} />}
          >
            <TabPane key="1">
              <AllTab
                list={listDataInProgress}
                loading={loadingAll || loadingFilter}
                loadingSearch={loadingSearch}
                pageSelected={pageSelected}
                size={size}
                getPageAndSize={this.getPageAndSize}
                total={listDataInProgress.length}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default OnboardingAll;

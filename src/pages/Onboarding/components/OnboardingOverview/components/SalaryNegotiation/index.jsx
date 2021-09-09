import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import SalaryNegotiationTab from './components/SalaryNegotiationTab';

import styles from '../index.less';
import SearchOnboarding from '../SearchOnboarding';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    onboarding: { onboardingOverview: { salaryNegotiations = [], total = 0 } = {} } = {},
  }) => ({
    salaryNegotiations,
    total,
    loading: loading.effects['onboarding/fetchOnboardList'],
  }),
)
class SalaryNegotiation extends PureComponent {
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
    this.fetchOnboardingSalaryNegotiation('');
  };

  componentDidUpdate = (prepProps, prepStates) => {
    const { nameSearch } = this.state;
    if (prepStates.nameSearch !== nameSearch) {
      this.fetchOnboardingSalaryNegotiation(nameSearch);
    }
  };

  fetchOnboardingSalaryNegotiation = (nameSearch) => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardList',
        payload: {
          processStatus: NEW_PROCESS_STATUS.SALARY_NEGOTIATION,
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
    this.setState({ loadingSearch: true });
    this.setDebounce(formatValue);
  };

  render() {
    const { salaryNegotiations: data = [], total = 0, loading } = this.props;
    const { tabId, pageSelected, size, loadingSearch } = this.state;
    return (
      <div className={styles.onboardingTab}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey={tabId}
            onChange={this.onChangeTab}
            tabBarExtraContent={<SearchOnboarding onChangeSearch={this.onChangeSearch} />}
          >
            <TabPane tab="Salary Negotiation" key="1">
              <SalaryNegotiationTab
                list={data}
                loading={loading}
                pageSelected={pageSelected}
                loadingSearch={loadingSearch}
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

export default SalaryNegotiation;

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import { debounce } from 'lodash';

import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import CheckListTab from './components/CheckListTab';

import styles from '../index.less';
import SearchOnboarding from '../SearchOnboarding';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    onboarding: {
      onboardingOverview: { checkListVerification = [], total = 0 } = {},
      reloadTableData = false,
    } = {},
  }) => ({
    checkListVerification,
    total,
    reloadTableData,
    loading: loading.effects['onboarding/fetchOnboardList'],
  }),
)
class DocumentCheckList extends PureComponent {
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
    this.fetchOnboardingCheckList('');
  };

  componentDidUpdate = (prepProps, prepStates) => {
    const { nameSearch } = this.state;
    const { reloadTableData, dispatch } = this.props;
    if (prepStates.nameSearch !== nameSearch) {
      this.fetchOnboardingCheckList(nameSearch);
    }
    if (prepProps.reloadTableData !== reloadTableData && reloadTableData) {
      this.fetchOnboardingCheckList(nameSearch);
      dispatch({
        type: 'onboard/save',
        payload: { reloadTableData: false },
      });
    }
  };

  fetchOnboardingCheckList = (nameSearch = '') => {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'onboarding/fetchOnboardList',
        payload: {
          processStatus: [NEW_PROCESS_STATUS.DOCUMENT_CHECKLIST_VERIFICATION],
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
    const { checkListVerification: data = [], total = 0, loading } = this.props;
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
              <CheckListTab
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

export default DocumentCheckList;

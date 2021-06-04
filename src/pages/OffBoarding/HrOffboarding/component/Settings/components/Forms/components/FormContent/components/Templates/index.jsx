import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Tabs, Input } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';
import SystemDefault from './components/SystemDefault';
import Custom from './components/Custom';
import SortIcon from './images/sort.svg';
import ViewModeIcon from './images/view.svg';
import SearchIcon from './images/search.svg';

const { TabPane } = Tabs;

@connect(({ loading, employeeSetting: { formOffBoardingList: list = [] } }) => ({
  list,
  loading: loading.effects['employeeSetting/fetchFormOffBoardingList'],
}))
class Templates extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formType: 'DEFAULT',
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    const { formType } = this.state;

    dispatch({
      type: 'employeeSetting/fetchFormOffBoardingList',
      payload: {
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
        formType,
      },
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const { dispatch } = this.props;
    const { formType } = this.state;

    if (formType !== prevState.formType) {
      dispatch({
        type: 'employeeSetting/fetchFormOffBoardingList',
        payload: {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
          formType,
        },
      });
    }
  }

  fetchData = (key) => {
    this.setState({
      formType: key === '1' ? 'DEFAULT' : 'CUSTOM',
    });
  };

  operations = () => {
    return (
      <div className={styles.operations}>
        <div className={styles.searchBox}>
          <Input placeholder="Search" prefix={<img src={SearchIcon} alt="search" />} />
        </div>
        <div className={styles.sortIcon}>
          <img src={SortIcon} alt="sort" />
        </div>
        <div className={styles.viewModeIcon}>
          <img src={ViewModeIcon} alt="viewMode" />
        </div>
      </div>
    );
  };

  render() {
    const { list, loading } = this.props;

    return (
      <div className={styles.Templates}>
        <div className={styles.tabs}>
          <Tabs
            defaultActiveKey="1"
            onTabClick={this.fetchData}
            tabBarExtraContent={this.operations()}
          >
            <TabPane tab="System Default Form" key="1">
              <SystemDefault list={list} loading={loading} />
            </TabPane>
            <TabPane tab="Custom Form created" key="2">
              <Custom list={list} loading={loading} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

// export default FinalOfferDrafts;
export default Templates;

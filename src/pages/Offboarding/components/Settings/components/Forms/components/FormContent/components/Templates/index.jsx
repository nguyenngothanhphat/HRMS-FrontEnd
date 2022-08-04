import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import Custom from './components/Custom';
import SystemDefault from './components/SystemDefault';
import styles from './index.less';

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

  render() {
    const { list, loading } = this.props;

    return (
      <div className={styles.Templates}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey="1" onTabClick={this.fetchData}>
            <TabPane tab="System Default Forms" key="1">
              <SystemDefault list={list} loading={loading} />
            </TabPane>
            <TabPane tab="Custom created" key="2">
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

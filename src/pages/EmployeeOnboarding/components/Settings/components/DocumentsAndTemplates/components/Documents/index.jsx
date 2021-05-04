import { getCurrentTenant } from '@/utils/authority';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import Templates from './components/Templates';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeSetting: { defaultTemplateListOnboarding = [], customTemplateListOnboarding = [] },
  }) => ({
    defaultTemplateListOnboarding,
    customTemplateListOnboarding,
    loadingDefaultTemplateList:
      loading.effects['employeeSetting/fetchDefaultTemplateListOnboarding'],
    loadingCustomTemplateList: loading.effects['employeeSetting/fetchCustomTemplateListOnboarding'],
  }),
)
class Documents extends PureComponent {
  fetchData = () => {
    const { dispatch } = this.props;
    const currentTenantId = getCurrentTenant();
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateListOnboarding',
      payload: {
        tenantId: currentTenantId,
        type: 'ON_BOARDING',
      },
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateListOnboarding',
      payload: {
        tenantId: currentTenantId,
        type: 'ON_BOARDING',
      },
    });
  };

  componentDidMount = () => {
    this.fetchData();
  };

  render() {
    return (
      <div className={styles.Documents}>
        <Templates fetchData={this.fetchData} />
      </div>
    );
  }
}

export default Documents;

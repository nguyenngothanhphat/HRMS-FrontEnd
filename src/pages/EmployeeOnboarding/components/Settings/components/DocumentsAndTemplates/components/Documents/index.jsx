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
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateListOnboarding',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateListOnboarding',
    });
  };

  componentDidMount = () => {
    this.fetchData();
  };

  render() {
    return (
      <div className={styles.Documents}>
        <Templates />
      </div>
    );
  }
}

export default Documents;

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import Templates from './components/Templates';
import styles from './index.less';

@connect(
  ({
    loading,
    employeeSetting: { defaultTemplateListOffboarding = [], customTemplateListOffboarding = [] },
  }) => ({
    defaultTemplateListOffboarding,
    customTemplateListOffboarding,
    loadingDefaultTemplateList:
      loading.effects['employeeSetting/fetchDefaultTemplateListOffboarding'],
    loadingCustomTemplateList:
      loading.effects['employeeSetting/fetchCustomTemplateListOffboarding'],
  }),
)
class Documents extends PureComponent {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateListOffboarding',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateListOffboarding',
    });
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

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import Templates from './components/Templates';
import styles from './index.less';

@connect(({ loading, employeeSetting: { defaultTemplateList = [], customTemplateList = [] } }) => ({
  defaultTemplateList,
  customTemplateList,
  loadingDefaultTemplateList: loading.effects['employeeSetting/fetchDefaultTemplateList'],
  loadingCustomTemplateList: loading.effects['employeeSetting/fetchCustomTemplateList'],
}))
class Documents extends PureComponent {
  fetchData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateList',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateList',
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

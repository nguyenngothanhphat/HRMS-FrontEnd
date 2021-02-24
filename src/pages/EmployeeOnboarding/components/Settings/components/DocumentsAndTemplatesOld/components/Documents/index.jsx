import React, { PureComponent } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { Link, formatMessage, connect } from 'umi';

import Template from './components/Template';

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
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateListOnboarding',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateListOnboarding',
    });
  };

  _renderTemplates = () => {
    const { defaultTemplateListOnboarding, loadingDefaultTemplateList } = this.props;
    if (loadingDefaultTemplateList) {
      return <Skeleton loading={loadingDefaultTemplateList} active />;
    }
    return defaultTemplateListOnboarding.map((template) => {
      return (
        <Col span={4} className={template}>
          {/* <Link to={`/template-details/${template._id}`}> */}
          <Template template={template} />
          {/* </Link> */}
        </Col>
      );
    });
  };

  _renderRecentDocuments = () => {
    const { customTemplateListOnboarding, loadingCustomTemplateList } = this.props;
    if (loadingCustomTemplateList) {
      return <Skeleton loading={loadingCustomTemplateList} active />;
    }
    return customTemplateListOnboarding.map((template) => {
      return (
        <Col span={4} className={template}>
          {/* <Link to={`/template-details/${template._id}`}> */}
          <Template loading={loadingCustomTemplateList} template={template} />
          {/* </Link> */}
        </Col>
      );
    });
  };

  render() {
    return (
      <div className={styles.Documents}>
        <p className={styles.Documents_title}>
          {' '}
          {formatMessage({ id: 'component.documentAndTemplates.defaultTemplate' })}
        </p>
        <Row gutter={[4, 12]}>{this._renderTemplates()}</Row>
        <p className={styles.Documents_title}>
          {' '}
          {formatMessage({ id: 'component.documentAndTemplates.recentDocuments' })}
        </p>
        <Row gutter={[4, 12]}>{this._renderRecentDocuments()}</Row>
      </div>
    );
  }
}

export default Documents;

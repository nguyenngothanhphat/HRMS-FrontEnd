import React, { PureComponent } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { Link, formatMessage, connect } from 'umi';

import Template from './components/Template';

import styles from './index.less';

@connect(({ loading, employeeSetting: { defaultTemplateList = [], customTemplateList = [] } }) => ({
  defaultTemplateList,
  customTemplateList,
  loadingDefaultTemplateList: loading.effects['employeeSetting/fetchDefaultTemplateList'],
}))
class Documents extends PureComponent {
  _renderTemplates = () => {
    const { defaultTemplateList, loadingDefaultTemplateList } = this.props;
    if (loadingDefaultTemplateList) {
      <Skeleton loading={loadingDefaultTemplateList} active />;
    }
    return defaultTemplateList.map((template) => {
      return (
        <Col span={4} className={template}>
          {/* <Link to={`/template-details/${template._id}`}> */}
          <Template template={template} />
          {/* </Link> */}
        </Col>
      );
    });
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/fetchDefaultTemplateList',
    });
    dispatch({
      type: 'employeeSetting/fetchCustomTemplateList',
    });
  };

  _renderRecentDocuments = () => {
    const { customTemplateList, loadingDefaultTemplateList } = this.props;
    return customTemplateList.map((template) => {
      return (
        <Col span={4} className={template}>
          {/* <Link to={`/template-details/${template._id}`}> */}
          <Template loading={loadingDefaultTemplateList} template={template} />
          {/* </Link> */}
        </Col>
      );
    });
  };

  render() {
    const { loadingDefaultTemplateList } = this.props;

    return (
      <div className={styles.Documents}>
        <p className={styles.Documents_title}>
          {' '}
          {formatMessage({ id: 'component.documentAndTemplates.defaultTemplate' })}
        </p>
        <Row gutter={[4, 12]} loading={loadingDefaultTemplateList}>
          {this._renderTemplates()}
        </Row>
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

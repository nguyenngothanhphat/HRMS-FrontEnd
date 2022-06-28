import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import PageContainer from '@/layouts/layout/src/PageContainer';
import TemplateDetailsHeader from './components/TemplateDetailsHeader';
import TemplateDetailsForm from './components/TemplateDetailsForm';
import TemplateDetailsNote from './components/TemplateDetailsNote';
import styles from './index.less';

class TemplateDetails extends PureComponent {
  render() {
    const {
      match: {
        params: { templateId },
      },
    } = this.props;
    return (
      <PageContainer>
        <div className={styles.TemplateDetails}>
          <TemplateDetailsHeader />
          <div className={styles.TemplateDetails_content}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} lg={17} xl={17}>
                <TemplateDetailsForm templateId={templateId} />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                <TemplateDetailsNote />
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default TemplateDetails;

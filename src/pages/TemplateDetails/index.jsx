import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import PageContainer from '@/layouts/layout/src/PageContainer';
import TemplateDetailsHeader from './components/TemplateDetailsHeader';
import TemplateDetailsForm from './components/TemplateDetailsForm';
import styles from './index.less';

class TemplateDetails extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.TemplateDetails}>
          <TemplateDetailsHeader />
          <div className={styles.TemplateDetails_content}>
            <Row gutter={[24, 0]}>
              <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                <TemplateDetailsForm />
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                8
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default TemplateDetails;

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import PageContainer from '@/layouts/layout/src/PageContainer';
import CreateNewTemplateHeader from './components/CreateNewTemplateHeader';
import CreateNewTemplateForm from './components/CreateNewTemplateForm';
import CreateNewTemplateNote from './components/CreateNewTemplateNote';
import styles from './index.less';

class CreateNewTemplate extends PureComponent {
  render() {
    const { location: { state: { type = '' } = {} } = {} } = this.props;
    return (
      <PageContainer>
        <div className={styles.CreateNewTemplate}>
          <CreateNewTemplateHeader />
          <div className={styles.CreateNewTemplate_content}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} lg={17} xl={17}>
                <CreateNewTemplateForm type={type} />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                <CreateNewTemplateNote />
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default CreateNewTemplate;

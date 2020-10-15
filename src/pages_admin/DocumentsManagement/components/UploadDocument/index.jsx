import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import FileUploadForm from './components/FileUploadForm';
import InformationUploadForm from './components/InformationUploadForm';
import styles from './index.less';

export default class UploadDocument extends PureComponent {
  render() {
    return (
      <PageContainer>
        <div className={styles.UploadDocuments}>
          <div className={styles.headerText}>
            <span>Add Document</span>
          </div>
          <div className={styles.containerUploadDocuments}>
            <Row gutter={['20', '20']}>
              <Col xs={12}>
                <FileUploadForm />
              </Col>
              <Col xs={12}>
                <InformationUploadForm />
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { PageContainer } from '@/layouts/layout/src';
import FileUploadForm from './components/FileUploadForm';
import InformationUploadForm from './components/InformationUploadForm';
import styles from './index.less';

export default class UploadDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileId: '',
    };
  }

  getResponse = (resp) => {
    const { statusCode, data = [] } = resp;
    const { id = '' } = data[0];
    if (statusCode === 200) {
      this.setState({
        fileId: id,
      });
    }
  };

  render() {
    const { fileId = '' } = this.state;
    return (
      <PageContainer>
        <div className={styles.UploadDocuments}>
          <div className={styles.headerText}>
            <span>Add Document</span>
          </div>
          <div className={styles.containerUploadDocuments}>
            <Row gutter={['20', '20']}>
              <Col xs={12}>
                <FileUploadForm getResponse={this.getResponse} />
              </Col>
              <Col xs={12}>
                <InformationUploadForm fileId={fileId} />
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

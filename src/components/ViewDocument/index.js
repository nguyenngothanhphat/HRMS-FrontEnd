import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import GoBackButton from '@/assets/goBack_icon.svg';
import styles from './index.less';

const identifyImageOrPdf = (fileName) => {
  const parts = fileName.split('.');
  const ext = parts[parts.length - 1];
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'png':
      return 0;
    case 'pdf':
      return 1;
    default:
      return 2;
  }
};

class ViewDocument extends PureComponent {
  render() {
    const { onBackClick = () => {}, data = {} } = this.props;

    const { key = '', employeeGroup = '', employee = '', attachment: { url = '' } = {} } = data;
    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <span>{formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.title' })}</span>
          <div onClick={onBackClick} className={styles.goBackButton}>
            <img src={GoBackButton} alt="back" />
            <span>
              {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.goBack' })}
            </span>
          </div>
        </div>
        <div className={styles.tableContent}>
          <Row>
            <Col xs={24} md={15}>
              {/* DOCUMENT VIEWER FRAME */}
              <div className={styles.documentPreviewFrame}>
                {identifyImageOrPdf(url) === 0 ? (
                  <div className={styles.imageFrame}>
                    <img alt="preview" src={url} />
                  </div>
                ) : (
                  <object width="100%" height="560" data={url} type="application/pdf">
                    <iframe
                      width="100%"
                      height="560"
                      src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
                      title="pdf-viewer"
                    />
                  </object>
                )}
              </div>
            </Col>
            <Col xs={0} md={1} />
            <Col xs={24} md={8}>
              {/* DOCUMENT INFORMATION & SHARING */}
              <div className={styles.documentInfo}>
                <Row className={styles.infoRow}>
                  <Col className={styles.infoCol1} span={10}>
                    Document Name
                  </Col>
                  <Col className={styles.infoCol2} span={14}>
                    {key}
                  </Col>
                </Row>
                <Row className={styles.infoRow}>
                  <Col className={styles.infoCol1} span={10}>
                    Document Type
                  </Col>
                  <Col className={styles.infoCol2} span={14}>
                    {employeeGroup}
                  </Col>
                </Row>
                <Row className={styles.infoRow}>
                  <Col className={styles.infoCol1} span={10}>
                    User ID
                  </Col>
                  <Col className={styles.infoCol2} span={14}>
                    {employee}
                  </Col>
                </Row>
                <Row className={styles.infoRow}>
                  <Col className={styles.infoCol1} span={10}>
                    Uploaded By
                  </Col>
                  <Col className={styles.infoCol2} span={14}>
                    Terralogic
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ViewDocument;

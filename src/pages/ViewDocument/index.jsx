import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import DownloadIcon from '@/assets/download_icon.svg';
import DownloadFile from '@/components/DownloadFile';
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
      return 0;
  }
};

@connect(({ viewDocument, loading }) => ({
  loadingFileDetail: loading.effects['viewDocument/fetchViewingDocumentDetail'],
  viewDocument,
}))
class ViewDocument extends PureComponent {
  // get document details
  fetchDocumentDetails = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'viewDocument/fetchViewingDocumentDetail',
      payload: { id },
    });
  };

  componentDidMount = () => {
    const {
      match: { params: { documentId: id = '' } = {} },
    } = this.props;
    this.fetchDocumentDetails(id);
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'viewDocument/removeViewingDocumentDetail',
    });
  };

  documentWarning = (msg) => (
    <div className={styles.documentWarning}>
      <p>{msg}</p>
    </div>
  );

  includeString = (str1, str2) => {
    return str1.toLowerCase().includes(str2.toLowerCase());
  };

  renderDownloadIcon = () => (
    <div>
      <img alt="download" src={DownloadIcon} className={styles.downloadButton} />
      <span>Download</span>
    </div>
  );

  goBack = () => {
    history.push('/documents');
  };

  render() {
    const { viewDocument: { documentDetail = {} } = {}, location = '' } = this.props;
    const { state = '' } = location;
    const { renderBackButton } = state;
    const { key = '', employeeGroup = '', attachment = {} } = documentDetail;
    const url = attachment !== null ? attachment.url : '';
    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <div className={styles.backAndTitle}>
            {renderBackButton ? (
              <ArrowLeftOutlined onClick={this.goBack} className={styles.backButton} />
            ) : (
              ''
            )}
            <span className={styles.title}>View Document</span>
          </div>
          <div className={styles.downloadButtonArea}>
            <DownloadFile content={this.renderDownloadIcon()} url={url} />
          </div>
        </div>

        <Row className={styles.tableContent}>
          {/* DOCUMENT VIEWER FRAME */}
          <Col xs={16} className={styles.documentPreviewFrame}>
            {url && identifyImageOrPdf(url) === 0 ? (
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
          </Col>

          {/* DOCUMENT INFORMATION & SHARING */}
          <Col xs={8} className={styles.documentInfo}>
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
                Document Name
              </Col>
              <Col className={styles.infoCol2} span={14}>
                {key}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewDocument;

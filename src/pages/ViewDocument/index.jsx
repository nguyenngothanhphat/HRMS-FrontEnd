import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { connect, history } from 'umi';
import DownloadIcon from '@/assets/download_icon.svg';
import DownloadFile from '@/components/DownloadFile';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
    };
  }

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

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
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
    history.go(-2);
  };

  render() {
    const { numPages } = this.state;
    const { viewDocument: { documentDetail = {} } = {} } = this.props;
    const { key = '', employeeGroup = '', attachment: { url = '' } = {} } = documentDetail;
    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <div className={styles.backAndTitle}>
            <ArrowLeftOutlined onClick={this.goBack} className={styles.backButton} />
            <span className={styles.title}>View Document</span>
          </div>
          <div className={styles.downloadButtonArea}>
            <DownloadFile content={this.renderDownloadIcon()} url={url} />
          </div>
        </div>

        <Row className={styles.tableContent}>
          {/* DOCUMENT VIEWER FRAME */}
          <Col xs={16} className={styles.documentPreviewFrame}>
            {identifyImageOrPdf(url) === 0 ? (
              <div className={styles.imageFrame}>
                <img alt="preview" src={url} />
              </div>
            ) : (
              <Document
                className={styles.pdfFrame}
                onLoadSuccess={this.onDocumentLoadSuccess}
                file={url}
                loading={this.documentWarning('Loading document. Please wait...')}
                noData={this.documentWarning('URL is not available.')}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    loading=""
                    className={styles.pdfPage}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ))}
              </Document>
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

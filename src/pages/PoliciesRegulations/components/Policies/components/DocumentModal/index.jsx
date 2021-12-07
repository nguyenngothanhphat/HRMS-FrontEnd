import React, { Component } from 'react';
import { Modal } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class DocumentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
    };
  }

  documentWarning = (msg) => (
    <div className={styles.viewLoading}>
      <p>{msg}</p>
    </div>
  );

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  };

  identifyImageOrPdf = (fileName) => {
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

  render() {
    const { visible, handleCancel = () => {}, link = '', title = '' } = this.props;
    const { numPages } = this.state;
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={handleCancel}
        className={styles.root}
        destroyOnClose
        footer={null}
        centered
      >
        <div className={styles.viewDocument}>
          {this.identifyImageOrPdf(link) === 0 ? (
            <div className={styles.imageFrame}>
              <img alt="preview" src={link} />
            </div>
          ) : (
            <Document
              file={link}
              onLoadSuccess={this.onDocumentLoadSuccess}
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
        </div>
      </Modal>
    );
  }
}

export default DocumentModal;

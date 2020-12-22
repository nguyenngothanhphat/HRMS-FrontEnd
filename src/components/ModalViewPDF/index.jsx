import React, { Component } from 'react';
import { Modal } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import s from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ModalViewPDF extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
    };
  }

  documentWarning = (msg) => (
    <div className={s.viewLoading}>
      <p>{msg}</p>
    </div>
  );

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
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
        className={s.root}
        destroyOnClose
        footer={null}
        centered
      >
        <div className={s.viewDocument}>
          <Document
            file={link}
            onLoadSuccess={this.onDocumentLoadSuccess}
            loading={this.documentWarning('Loading document. Please wait...')}
            noData={this.documentWarning('URL is not available.')}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                loading=""
                className={s.pdfPage}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        </div>
      </Modal>
    );
  }
}

export default ModalViewPDF;

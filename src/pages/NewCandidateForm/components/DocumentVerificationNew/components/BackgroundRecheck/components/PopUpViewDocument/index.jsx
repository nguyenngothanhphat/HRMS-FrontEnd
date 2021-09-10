import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class PopUpViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
    };
  }

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
        return 2;
    }
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({}, () => handleCancel());
  };

  renderHeaderModal = () => {
    const { titleModal = 'Your title' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  onDocumentLoadSuccess = (infoPDF) => {
    const { numPages } = infoPDF._pdfInfo;
    this.setState({ numPages });
  };

  render() {
    const { visible = false, url } = this.props;
    const { numPages } = this.state;
    const arrNumPages = new Array(numPages);
    return (
      <Modal
        className={styles.modalUpload}
        visible={visible}
        loading={url === ''}
        title={this.renderHeaderModal()}
        style={{ top: 50 }}
        width="50%"
        onCancel={this.handleCancel}
        destroyOnClose
        footer={false}
      >
        {this.identifyImageOrPdf(url) === 0 ? (
          <div className={styles.imageFrame}>
            <img alt="preview" src={url} />
          </div>
        ) : (
          <Document
            loading=""
            noData="Document Not Found"
            file={url}
            // file="/assets/files/sample_1.pdf"
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            {Array.from(arrNumPages).map((item, index) => (
              <Page
                loading=""
                className={styles.pdfPage}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        )}
      </Modal>
    );
  }
}

export default PopUpViewDocument;

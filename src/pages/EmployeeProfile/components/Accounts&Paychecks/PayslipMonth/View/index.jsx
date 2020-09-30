import React, { PureComponent } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import GoBackButton from '@/assets/goBack_icon.svg';
import { formatMessage } from 'umi';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
class ViewFile extends PureComponent {
  constructor(props) {
    super(props);
    // const { selectedFile } = this.props;
    this.state = {
      numPages: null,
      // currentViewingFile: selectedFile,
    };
  }

  onDocumentLoadSuccess = (infoPDF) => {
    const { numPages } = infoPDF._pdfInfo;
    this.setState({ numPages });
  };

  render() {
    // const { url, onBackClick } = this.props;
    const { onBackClick } = this.props;
    const { numPages } = this.state;
    const test = new Array(numPages);
    return (
      <div className={styles.ViewFile}>
        <div onClick={onBackClick} className={styles.goBackButton}>
          <img src={GoBackButton} alt="back" />
          <span>
            {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.goBack' })}
          </span>
        </div>
        <div>
          <Document
            loading=""
            noData="Document Not Found"
            // file={url}
            file="/assets/files/sample_1.pdf"
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            {Array.from(test).map((item, index) => (
              <Page
                loading=""
                className={styles.pdfPage}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        </div>
      </div>
    );
  }
}

export default ViewFile;

/* eslint-disable no-return-assign */
import React, { PureComponent } from 'react';
import { Modal, Spin, message } from 'antd';
import axios from 'axios';
import DownloadIcon from '@/assets/downloadIconTimeOff.svg';
import PrintIcon from '@/assets/printIconTimeOff.svg';
import CloseIcon from '@/assets/closeIconTimeOff.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactToPrint from 'react-to-print';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ViewDocumentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
    };
  }

  onDownload = (url) => {
    const fileName = url.split('/').pop();
    message.loading('Downloading file. Please wait...');
    axios({
      url,
      method: 'GET',
      responseType: 'blob',
    }).then((resp) => {
      // eslint-disable-next-line compat/compat
      const urlDownload = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement('a');
      link.href = urlDownload;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  onPrint = (url) => {
    // event.preventDefault();
    window.open(url, 'PRINT');
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

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  };

  renderLoading = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
      <div className={styles.loading}>
        <Spin indicator={antIcon} />,
      </div>
    );
  };

  _renderHandleButtons = () => {
    const {
      onClose = () => {},
      url = 'http://api-stghrms.paxanimi.ai/api/attachments/5f744ecfd44f6745847c0eea/Payslip_Apr20.pdf',
    } = this.props;
    return (
      <div className={styles.handleButtons}>
        <img src={DownloadIcon} alt="download" onClick={() => this.onDownload(url)} />
        <ReactToPrint
          trigger={() => <img src={PrintIcon} alt="print" />}
          content={() => this.componentRef}
        />
        <img src={CloseIcon} alt="close" onClick={() => onClose(false)} />
      </div>
    );
  };

  _renderViewImage = () => {
    const {
      url = 'http://api-stghrms.paxanimi.ai/api/attachments/5f744ecfd44f6745847c0eea/Payslip_Apr20.pdf',
    } = this.props;
    return (
      <div className={styles.imageFrame} ref={(el) => (this.componentRef = el)}>
        {/* <Image width="100%" height="100%" src={url} /> */}
        <img src={url} alt="document" />
      </div>
    );
  };

  _renderViewPDF = () => {
    const {
      url = 'http://api-stghrms.paxanimi.ai/api/attachments/5f744ecfd44f6745847c0eea/Payslip_Apr20.pdf',
      fileName = 'View Document',
    } = this.props;
    const { numPages } = this.state;

    return (
      <>
        <p className={styles.fileName}>{fileName}</p>
        <Document
          className={styles.pdfFrame}
          onLoadSuccess={this.onDocumentLoadSuccess}
          file={url}
          loading={this.renderLoading()}
          noData="Document Not Found"
          ref={(el) => (this.componentRef = el)}
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
      </>
    );
  };

  _renderStickyFooter = () => {
    return (
      <div className={styles.stickyFooter}>
        <span>
          For any queries, e-mail at{' '}
          <span style={{ fontWeight: 'bold' }}>hrmanager@companyname.com</span>
        </span>
      </div>
    );
  };

  render() {
    const {
      visible,
      onClose = () => {},
      url = 'http://api-stghrms.paxanimi.ai/api/attachments/5f744ecfd44f6745847c0eea/Payslip_Apr20.pdf',
    } = this.props;

    const viewType = this.identifyImageOrPdf(url); // 0: images, 1: pdf

    return (
      <Modal
        className={styles.ViewDocumentModal}
        destroyOnClose
        // eslint-disable-next-line no-nested-ternary
        width={viewType === 0 ? 500 : 900}
        visible={visible}
        footer={null}
        onCancel={onClose}
        centered
        maskClosable
      >
        {this._renderHandleButtons()}
        <div className={styles.container}>
          <div className={viewType === 0 ? styles.contentViewImage : styles.contentViewPDF}>
            {viewType === 0 && this._renderViewImage()}
            {viewType === 1 && this._renderViewPDF()}
          </div>
          {viewType === 1 && this._renderStickyFooter()}
        </div>
      </Modal>
    );
  }
}
export default ViewDocumentModal;

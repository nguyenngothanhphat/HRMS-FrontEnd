/* eslint-disable no-return-assign */
import { LoadingOutlined } from '@ant-design/icons';
import { message, Modal, Spin } from 'antd';
import axios from 'axios';
import React, { PureComponent } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactToPrint from 'react-to-print';
import { connect } from 'umi';
import PrintIcon from '@/assets/printIconTimeOff.svg';
import DownloadIcon from '@/assets/downloadIconTimeOff.svg';
import CloseIcon from '@/assets/closeIconTimeOff.svg';
import styles from './index.less';
import { getCurrentCompany } from '@/utils/authority';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class ViewDocumentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
    };
  }

  componentDidUpdate = (prevProps) => {
    const { dispatch, visible = false } = this.props;
    if (visible !== prevProps.visible && visible) {
      dispatch({
        type: 'adminSetting/getDomain',
      });
    }
  };

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
        <Spin indicator={antIcon} />
      </div>
    );
  };

  _renderHandleButtons = () => {
    const { onClose = () => {}, url = '', disableDownload = false } = this.props;
    return (
      <div className={styles.handleButtons}>
        {!disableDownload && (
          <>
            <img src={DownloadIcon} alt="download" onClick={() => this.onDownload(url)} />
            <ReactToPrint
              trigger={() => <img src={PrintIcon} alt="print" />}
              content={() => this.componentRef}
            />
          </>
        )}
        <img src={CloseIcon} alt="close" onClick={() => onClose(false)} />
      </div>
    );
  };

  _renderViewImage = () => {
    const { url = '' } = this.props;
    return (
      <div className={styles.imageFrame} ref={(el) => (this.componentRef = el)}>
        {/* <Image width="100%" height="100%" src={url} /> */}
        <img src={url} alt="document" />
      </div>
    );
  };

  _renderViewPDF = () => {
    const { url = '', fileName = 'View Document' } = this.props;
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
    const { emailDomain } = this.props;
    return (
      <div className={styles.stickyFooter}>
        <span>
          For any queries, email at{' '}
          <span style={{ fontWeight: 'bold' }}>{`hr@${emailDomain}`}</span>
        </span>
      </div>
    );
  };

  render() {
    const { visible, onClose = () => {}, url = '', disableDownload = false } = this.props;

    const viewType = this.identifyImageOrPdf(url); // 0: images, 1: pdf

    return (
      <Modal
        className={styles.ViewDocumentModal}
        destroyOnClose
        // eslint-disable-next-line no-nested-ternary
        width={viewType === 0 ? 500 : 900}
        visible={visible}
        footer={null}
        onCancel={() => onClose(false)}
        centered
        maskClosable
      >
        {this._renderHandleButtons()}
        <div
          className={styles.container}
          onContextMenu={disableDownload ? (e) => e.preventDefault() : null}
        >
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
export default connect(({ adminSetting: { originData: { emailDomain = '' } = {} } = {} }) => ({
  emailDomain,
}))(ViewDocumentModal);

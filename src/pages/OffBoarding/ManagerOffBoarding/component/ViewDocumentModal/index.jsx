/* eslint-disable no-return-assign */
import React, { PureComponent } from 'react';
import { Modal, Spin, message } from 'antd';
import axios from 'axios';
import DownloadIcon from '@/assets/downloadIconTimeOff.svg';
import PrintIcon from '@/assets/printIconTimeOff.svg';

import { LoadingOutlined } from '@ant-design/icons';
import { pdfjs } from 'react-pdf';
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
    message.loading('Downloading file. Please wait...').then(() => {
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
        })
        .catch(error => {
            message.error(`${error} File Not Found!`)
        });

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
      url = 'http://api-stghrms.paxanimi.ai/api/attachments/5f744ecfd44f6745847c0eea/Payslip_Apr20.pdf',
    } = this.props;
    return (
      <div className={styles.handleButtons}>
        <ReactToPrint
          trigger={() => <img src={PrintIcon} alt="print" />}
          content={() => this.componentRef}
        />
        <img src={DownloadIcon} alt="Download Policy" onClick={() => this.onDownload(url)} />
      </div>
    );
  };

    infoModal = () => {
    const InfoEditCheckList = (
      <div className={styles.bodyInfo}>
        <div className={styles.modalText}>
          Offboarding Policy
        </div>
        <div className={styles.bodyText}>
          <div className={styles.modalTitle}>What is an off boarding policy?</div>
          <div className={styles.modalContent}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet. 
            
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet.
          </div>
          <div className={styles.modalTitle}>
            What is an Exit check list?
          </div>
          <div className={styles.modalContent}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
            sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing
          </div>
          <div className={styles.modalTitle}>
            Terms and conditions
          </div>
          <ul>
            <li className={styles.subText}>
              1. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
              tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            </li>
            <li className={styles.subText}>
              2. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
              no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </li>
            <li className={styles.subText}>
              3. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
              no sea takimata sanctus est Lorem ipsum dolor sit amet.
            </li>
          </ul>
        </div>
      </div>
    );
    return <div>{InfoEditCheckList}</div>;
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
            {/* {viewType === 0 && this._renderViewImage()}
            {viewType === 1 && this._renderViewPDF()} */}
            {viewType === 1 && this.infoModal()}
          </div>
          {viewType === 1 && this._renderStickyFooter()}
        </div>
      </Modal>
    );
  }
}
export default ViewDocumentModal;

/* eslint-disable no-return-assign */
import { LoadingOutlined } from '@ant-design/icons';
import { message, Modal, Spin } from 'antd';
import axios from 'axios';
import React, { PureComponent } from 'react';
import ReactToPrint from 'react-to-print';
import { connect } from 'umi';
import CloseIcon from '@/assets/closeIconTimeOff.svg';
import DownloadIcon from '@/assets/downloadIconTimeOff.svg';
import PrintIcon from '@/assets/printIconTimeOff.svg';
import { FILE_TYPE } from '@/constants/upload';
import { identifyFile } from '@/utils/upload';
import { getCountryId } from '@/utils/utils';
import styles from './index.less';

class ViewDocumentModal extends PureComponent {
  componentDidUpdate = (prevProps) => {
    const { dispatch, visible = false } = this.props;
    if (visible !== prevProps.visible && visible) {
      dispatch({
        type: 'adminSetting/getDomain',
      });
    }
  };

  onDownload = (url = '') => {
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
    return (
      <>
        <p className={styles.fileName}>{fileName}</p>
        <object width="100%" height="100%" data={url} type="application/pdf">
          <iframe
            width="100%"
            height="560"
            src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
            title="pdf-viewer"
          />
        </object>
      </>
    );
  };

  getCountryName = () => {
    const { location = {}, candidatePortal: { data: { workLocation = {} } } = {} } = this.props;

    const employeeLocation = getCountryId(location);
    const candidateLocation = getCountryId(workLocation);

    const id = employeeLocation || candidateLocation;

    switch (id) {
      case 'VN':
        return 'vn';
      case 'US':
        return 'us';
      case 'IN':
        return 'ind';

      default:
        return '';
    }
  };

  _renderStickyFooter = () => {
    const { emailDomain } = this.props;
    return (
      <div className={styles.stickyFooter}>
        <span>
          For any queries, email at{' '}
          <span style={{ fontWeight: 'bold' }}>
            {`hr-${this.getCountryName()}@${emailDomain || 'terralogic.com'}`}
          </span>
        </span>
      </div>
    );
  };

  render() {
    const { visible, onClose = () => {}, url = '', disableDownload = false } = this.props;

    const viewType = identifyFile(url); // 0: images, 1: pdf

    return (
      <Modal
        className={styles.ViewDocumentModal}
        destroyOnClose
        // eslint-disable-next-line no-nested-ternary
        width={viewType === FILE_TYPE.IMAGE ? 500 : 900}
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
            {viewType === FILE_TYPE.IMAGE && this._renderViewImage()}
            {viewType === FILE_TYPE.PDF && this._renderViewPDF()}
          </div>
          {this._renderStickyFooter()}
        </div>
      </Modal>
    );
  }
}
export default connect(
  ({
    adminSetting: { originData: { emailDomain = '' } = {} } = {},
    user: { currentUser: { location = {} } = {} } = {},
    candidatePortal,
  }) => ({
    emailDomain,
    location,
    candidatePortal,
  }),
)(ViewDocumentModal);

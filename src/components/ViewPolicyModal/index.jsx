import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import DownloadIcon from '@/assets/downloadIconTimeOff.svg';
import PrintIcon from '@/assets/printIconTimeOff.svg';
import CloseIcon from '@/assets/closeIconTimeOff.svg';
import styles from './index.less';

export default class ViewPolicyModal extends PureComponent {
  onDownload = () => {
    alert('Download');
  };

  onPrint = () => {
    alert('Print');
  };

  render() {
    const { visible, onClose = () => {} } = this.props;
    return (
      <Modal
        className={styles.ViewPolicyModal}
        destroyOnClose
        // centered
        width={900}
        visible={visible}
        footer={null}
      >
        <div className={styles.handleButtons}>
          <img src={DownloadIcon} alt="download" onClick={this.onDownload} />
          <img src={PrintIcon} alt="print" onClick={this.onPrint} />
          <img src={CloseIcon} alt="close" onClick={() => onClose(false)} />
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>The Advance Leave Policy</p>
            <p style={{ fontWeight: 'bold', fontSize: '14px' }}>What is an Advance Leave Policy?</p>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
              sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
              rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
              amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
              tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
              eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
              takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
              consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
              dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea
            </p>

            <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Who are entitled to take it?</p>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
              sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
              rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
              amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
              tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
              eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
              takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
              consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
              dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea
            </p>
          </div>

          <div className={styles.stickyFooter}>
            <span>
              For any queries, e-mail at{' '}
              <span style={{ fontWeight: 'bold' }}>hrmanager@companyname.com</span>
            </span>
          </div>
        </div>
      </Modal>
    );
  }
}

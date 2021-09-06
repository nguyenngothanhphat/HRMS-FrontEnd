import React, { Component } from 'react';
import {
  message,
  Button,
  Spin,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Upload,
  Tooltip,
} from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { isEmpty } from 'lodash';

import styles from './index.less';

class VerifyDocumentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTitle = (name) => <div className={styles.titleName}>{name}</div>;

  destroyOnClose = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  render() {
    const { visible = false, url = '', fileName = '' } = this.props;

    return (
      <Modal
        visible={visible}
        className={styles.verifyDocumentModal}
        title={this.renderTitle(fileName)}
        onCancel={this.destroyOnClose}
        destroyOnClose={this.destroyOnClose}
        footer={false}
      >
        <div className={styles.document}>
          <img src={url} alt="document" />
        </div>
        <div className={styles.verifyDocumentModal__bottom}>
          <Button onClick={this.destroyOnClose} className={`${styles.btn} ${styles.resubmitBtn}`}>
            Resubmit
          </Button>
          <Button
            // onClick={}
            className={`${styles.btn} ${styles.verifiedBtn}`}
            // loading={loadingAddDocument}
          >
            Verified
          </Button>
        </div>
      </Modal>
    );
  }
}

export default VerifyDocumentModal;

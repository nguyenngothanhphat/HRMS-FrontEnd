import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'umi';

import styles from './index.less';

@connect(
  ({
    newCandidateForm: {
      data: { candidate = '' },
      rookieId = '',
    },
    loading,
  }) => ({
    candidate,
    rookieId,
    loadingVerified: loading.effects['newCandidateForm/checkDocumentEffect'],
  }),
)
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

  handleVerified = () => {
    const { dispatch, candidate, document, onClose = () => {} } = this.props;
    if (!dispatch) {
      return;
    }

    dispatch({
      type: 'newCandidateForm/checkDocumentEffect',
      payload: {
        candidate,
        document,
        candidateDocumentStatus: 1,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
      }
    });
  };

  render() {
    const { visible = false, url = '', fileName = '', loadingVerified } = this.props;

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
            onClick={this.handleVerified}
            className={`${styles.btn} ${styles.verifiedBtn}`}
            loading={loadingVerified}
          >
            Verified
          </Button>
        </div>
      </Modal>
    );
  }
}

export default VerifyDocumentModal;

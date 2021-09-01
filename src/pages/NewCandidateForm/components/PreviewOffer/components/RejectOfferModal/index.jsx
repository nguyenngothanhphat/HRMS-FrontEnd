import { Button, Modal, Input } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

@connect(({ loading }) => ({
  loadingReject: loading.effects['candidatePortal/submitCandidateFinalOffer'],
}))
class RejectOfferModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
    };
  }

  componentDidMount = async () => {};

  renderModalHeader = () => {
    const { title = 'Reason for Rejection' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalContent = () => {
    return (
      <div className={styles.queryContent}>
        <span className={styles.describeText}>Reason</span>

        <TextArea
          onChange={(e) => {
            this.setState({ reason: e.target?.value || '' });
          }}
          autoSize={{ minRows: 6, maxRows: 10 }}
        />
      </div>
    );
  };

  // on finish
  onFinish = () => {
    const { onFinish = () => {} } = this.props;
    const { reason } = this.state;
    onFinish(reason);
  };

  render() {
    const { visible = false, loadingReject } = this.props;
    const { reason } = this.state;

    return (
      <>
        <Modal
          className={styles.RejectOfferModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              onClick={this.onFinish}
              disabled={!reason}
              loading={loadingReject}
            >
              Submit
            </Button>,
          ]}
          title={this.renderModalHeader()}
          centered
          visible={visible}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default RejectOfferModal;

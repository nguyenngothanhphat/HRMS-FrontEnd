import { Button, Modal, Input } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { TextArea } = Input;

@connect(() => ({}))
class RejectOfferModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
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
        <span className={styles.describeText}>Message</span>

        <TextArea
          onChange={(e) => {
            this.setState({ message: e.target?.value || '' });
          }}
          autoSize={{ minRows: 6, maxRows: 10 }}
        />
      </div>
    );
  };

  render() {
    const { visible = false } = this.props;
    const { message } = this.state;

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
              disabled={!message}
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

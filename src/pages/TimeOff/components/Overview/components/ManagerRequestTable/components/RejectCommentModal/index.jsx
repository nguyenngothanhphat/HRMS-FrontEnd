import React, { PureComponent } from 'react';
import { Button, Modal, Input } from 'antd';
// import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const { TextArea } = Input;
export default class RejectCommentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
    };
  }

  onCommentChange = (e) => {
    const { target: { value = '' } = {} } = e;
    this.setState({
      comment: value,
    });
  };

  render() {
    const { comment } = this.state;
    const {
      visible,
      onClose = () => {},
      onReject = () => {},
      ticketID = '',
      rejectMultiple = false,
      loading,
    } = this.props;
    const header = 'Request Rejection Comments';

    return (
      <Modal
        className={styles.RejectCommentModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <span className={styles.title}>{header}</span>
          {!rejectMultiple && <span className={styles.subtitle1}>Ticket ID: {ticketID}</span>}
          <div className={styles.formContainer}>
            <div className={styles.formInput}>
              <TextArea
                autoSize={{ minRows: 3, maxRows: 7 }}
                maxLength={500}
                placeholder="The reason I am rejecting this request is..."
                onChange={this.onCommentChange}
                disabled={loading}
              />
            </div>
          </div>
          <div className={styles.operationButtons}>
            <Button
              loading={loading}
              className={styles.proceedBtn}
              onClick={() => onReject(comment)}
            >
              Submit
            </Button>
            <Button className={styles.cancelBtn} onClick={() => onClose()}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

import React, { PureComponent } from 'react';
import { Button, Modal, Input } from 'antd';
import { TIMEOFF_STATUS } from '@/utils/timeOff';
import styles from './index.less';

const { TextArea } = Input;
const { DRAFTS } = TIMEOFF_STATUS;
export default class Withdraw2Modal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      reason: '',
    };
  }

  onTitleChange = (e) => {
    const { target: { value = '' } = {} } = e;
    this.setState({
      title: value,
    });
  };

  onReasonChange = (e) => {
    const { target: { value = '' } = {} } = e;
    this.setState({
      reason: value,
    });
  };

  render() {
    const { title, reason } = this.state;
    const {
      visible,
      onClose = () => {},
      onProceed = () => {},
      status = '',
      loading = false,
    } = this.props;
    let header = 'Withdraw timeoff request?';
    const content1 = 'Are you sure you want to withdraw your leave request?';
    let content2 = 'Both your Manager and HR will be notified of this change.';
    if (status === DRAFTS) {
      header = 'Discard draft request?';
      content2 = '';
    }
    return (
      <Modal
        className={styles.Withdraw2Modal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
      >
        <div className={styles.container}>
          <span className={styles.title}>{header}</span>
          <div className={styles.formContainer}>
            <p className={styles.subtitle1}>{content1}</p>
            {/* <div className={styles.formInput}>
              <Input placeholder="Title" onChange={this.onTitleChange} />
            </div> */}
            <div className={styles.formInput}>
              <TextArea
                autoSize={{ minRows: 3, maxRows: 7 }}
                maxLength={250}
                placeholder="Reason..."
                onChange={this.onReasonChange}
                disabled={loading}
              />
            </div>
          </div>
          {content2 !== '' && <p className={styles.subtitle2}>{content2}</p>}
          <div className={styles.operationButtons}>
            <Button
              loading={loading}
              className={styles.proceedBtn}
              onClick={() => onProceed(title, reason)}
            >
              Submit
            </Button>
            <Button className={styles.cancelBtn} onClick={() => onClose(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}

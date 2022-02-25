import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import styles from './index.less';

class ViewQuestionAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  render() {
    const { visible, item } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>View Question</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <p>Question: {item ? item.question : ''}</p>
          <p>Answer: answer of question</p>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.ViewQuestionAnswer} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={696}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                onClick={this.handleCancel}
              >
                Close
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default ViewQuestionAnswer;

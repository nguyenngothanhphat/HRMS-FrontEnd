import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import Parser from 'html-react-parser';
import styles from './index.less';
import { hashtagify, urlify } from '@/utils/homePage';

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
    const renderContent = (text) => {
      const temp = urlify(text);
      return hashtagify(temp);
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <p>
            <b>Question:</b> {item ? item.question : ''}
          </p>
          <p>
            <b>Answer:</b> {item.answer ? Parser(renderContent(item.answer)) : ''}
          </p>
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
              <Button className={styles.btnSubmit} onClick={this.handleCancel}>
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

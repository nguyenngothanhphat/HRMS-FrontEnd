import React, { Component } from 'react';
import { Button, Affix } from 'antd';
import FeedbackIcon from '@/assets/feedbackIcon.svg';
import ModalFeedback from '@/components/ModalFeedback';
import styles from './index.less';
import RaiseTicketModal from '../RaiseTicketModal';

export default class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openFeedback = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <>
        <Affix style={{ width: 48 }} offsetBottom={60} className={styles.feedbackRoot}>
          <div className={styles.feedback}>
            <Button onClick={this.openFeedback} className={styles.btnFeedback}>
              <div className={styles.spanText}>
                <img alt="feedback-icon" src={FeedbackIcon} />
                <span className={styles.feedbackText}>Feedback</span>
              </div>
            </Button>
          </div>
        </Affix>
        {/* <ModalFeedback
          visible={visible}
          handleCancelModal={this.handleCancelModal}
          openFeedback={this.openFeedback}
        /> */}
        <RaiseTicketModal visible={visible} onClose={this.handleCancelModal} isFeedback />
      </>
    );
  }
}

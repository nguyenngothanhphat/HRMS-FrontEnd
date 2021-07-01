import React, { Component } from 'react';
import { Button, Affix } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import ModalFeedback from '@/components/ModalFeedback';
import styles from './index.less';

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

  handleCandelModal = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <>
        <Affix offsetBottom={60} className={styles.feedbackRoot}>
          <div className={styles.feedback}>
            <Button onClick={this.openFeedback} className={styles.btnFeedback}>
              <div className={styles.spanText}>
                <FormOutlined className={styles.feedbackIcon} />
                <span className={styles.feedbackText}>Feedback</span>
              </div>
            </Button>
          </div>
        </Affix>
        <ModalFeedback visible={visible} handleCandelModal={this.handleCandelModal} />
      </>
    );
  }
}

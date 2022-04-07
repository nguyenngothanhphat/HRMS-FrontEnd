import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi';
// import icon from '@/assets/question_icon.svg';
import helpContact from '@/assets/faqPage/helpContact.svg';
import styles from './index.less';
import ModalFeedback from '@/components/ModalFeedback';

class ContactPage extends PureComponent {
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
      <div className={styles.container}>
        <div>
          <img src={helpContact} alt="" />
          <span className={styles.title}>
            {formatMessage({ id: 'pages.frequentlyAskedQuestions.contactUs.title' })}
          </span>
        </div>
        <div className={styles.subText}>
          {formatMessage({ id: 'pages.frequentlyAskedQuestions.contactUs.content' })}
        </div>
        <div className={styles.center}>
          <Button className={styles.btnUpload} onClick={this.openFeedback}>
            {formatMessage({ id: 'pages.frequentlyAskedQuestions.contactUs' })}
          </Button>
          <ModalFeedback
          visible={visible}
          handleCancelModal={this.handleCancelModal}
          openFeedback={this.openFeedback}
        />
        </div>
        
      </div>
      
    );
  }
}

export default ContactPage;

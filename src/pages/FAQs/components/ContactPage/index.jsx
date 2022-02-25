import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { formatMessage } from 'umi';
// import icon from '@/assets/question_icon.svg';
import helpContact from '@/assets/faqPage/helpContact.svg';
import styles from './index.less';

class ContactPage extends PureComponent {
  render() {
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
          <Button className={styles.btnUpload}>
            {formatMessage({ id: 'pages.frequentlyAskedQuestions.contactUs' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default ContactPage;

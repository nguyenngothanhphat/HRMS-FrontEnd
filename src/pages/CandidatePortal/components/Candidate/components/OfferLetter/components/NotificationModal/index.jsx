import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import WelcomeImage from '@/assets/candidatePortal/welcome.svg';
import styles from './index.less';

@connect(({ user: { companiesOfUser = [] } }) => ({ companiesOfUser }))
class NotificationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalContent = () => {
    const { action = '' } = this.props;
    let title1 = '';
    let title2 = '';
    let content1 = '';
    let content2 = '';
    let content3 = '';
    if (action === 'accept') {
      title1 = 'Thank you!';
      title2 = 'Welcome to Terralogic !';
      content1 = 'Congratulations on joining our team! We look forward to sharing many successes!';
      content2 = 'The HR will reach out to you shortly with the next steps.';
      content3 = 'The physical offer letter will be provided only on the day of joining.';
    }
    if (action === 'reject') {
      title1 = 'Thank you!';
      content1 = 'Your response has been noted.';
    }
    return (
      <div className={styles.welcomeContent}>
        <img src={WelcomeImage} alt="welcome" />
        <span className={styles.welcomeText}>{title1}</span>
        {action === 'accept' && <span className={styles.welcomeText}>{title2}</span>}
        <span className={styles.describeText}>{content1}</span>
        {action === 'accept' && (
          <span className={styles.describeText}>
            {content2}
            <br />
            {content3}
          </span>
        )}
        <Button className={styles.btnSubmit} type="primary" onClick={this.handleCancel}>
          Go back to home
        </Button>
      </div>
    );
  };

  render() {
    const { visible = false } = this.props;

    return (
      <>
        <Modal
          className={styles.NotificationModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={null}
          centered
          visible={visible}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default NotificationModal;

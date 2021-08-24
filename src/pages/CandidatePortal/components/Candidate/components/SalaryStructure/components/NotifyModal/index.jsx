import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import DoneImage from '@/assets/candidatePortal/imgDone.png';
import styles from './index.less';

@connect(({ user: { companiesOfUser = [] } }) => ({ companiesOfUser }))
class NotifyModal extends PureComponent {
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
    const { title = '', content = '' } = this.props;
    return (
      <div className={styles.welcomeContent}>
        <img src={DoneImage} alt="welcome" />
        <span className={styles.welcomeText}>{title}</span>
        <span className={styles.describeText}>{content}</span>
        <Button className={styles.btnSubmit} type="primary" onClick={this.handleCancel}>
          Okay
        </Button>
      </div>
    );
  };

  render() {
    const { visible = false } = this.props;

    return (
      <>
        <Modal
          className={styles.NotifyModal}
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

export default NotifyModal;

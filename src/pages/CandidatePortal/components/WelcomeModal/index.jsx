import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import WelcomeImage from '@/assets/candidatePortal/welcome.svg';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';

@connect(({ user: { companiesOfUser = [] } }) => ({ companiesOfUser }))
class WelcomeModal extends PureComponent {
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
    const { companiesOfUser = [] } = this.props;
    const companyName = () => {
      const currentCompany =
        companiesOfUser.find((company) => company?._id === getCurrentCompany()) || {};
      return currentCompany.name || '';
    };

    return (
      <div className={styles.welcomeContent}>
        <img src={WelcomeImage} alt="welcome" />
        <span className={styles.welcomeText}>
          Welcome{companyName() ? ` to ${companyName()}` : ''}!
        </span>
        <span className={styles.describeText}>
          We are excited to have you here. Here are a list of tasks for you to complete to proceed
          ahead!
        </span>
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
          className={styles.WelcomeModal}
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

export default WelcomeModal;

import { Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import MyProjects from '../MyProjects';
import MyTasks from '../MyTasks';
import styles from './index.less';

@connect(() => ({}))
class CommonModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  renderModalHeader = () => {
    const { title = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalContent = () => {
    const { tabKey = '' } = this.props;
    switch (tabKey) {
      case '1':
        return <MyTasks isInModal />;
      case '2':
        return <MyProjects isInModal />;
      default:
        return '';
    }
  };

  render() {
    const { visible = false } = this.props;

    return (
      <>
        <Modal
          className={`${styles.CommonModal} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={null}
          title={this.renderModalHeader()}
          centered
          visible={visible}
          width={750}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default CommonModal;
